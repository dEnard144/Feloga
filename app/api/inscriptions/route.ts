import { NextResponse } from 'next/server'

const fields = ['nom', 'prenom', 'email', 'whatsapp', 'ville', 'profil', 'organisation', 'source', 'experienceFeloga', 'accessibilite', 'precisionAccessibilite', 'attentes', 'motivation', 'consentement'] as const
const DEFAULT_ENDPOINT = 'https://script.google.com/macros/s/AKfycby4xErcNMcKgAJlVdUi5VM38WAu9rhuVMpDQlvCCOAxxV5sNHYPf20Mhg962mKptRYQ/exec'
const MAX_BODY_SIZE = 20_000

export async function POST(request: Request) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_ENDPOINT
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return NextResponse.json({ error: 'Format de requête invalide.' }, { status: 415 })
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_BODY_SIZE) return NextResponse.json({ error: 'Votre inscription est trop volumineuse.' }, { status: 413 })
  try {
    const body = await request.json() as Record<string, unknown>
    const values = Object.fromEntries(fields.map((field) => [field, typeof body[field] === 'string' ? body[field].trim() : ''])) as Record<string, string>
    if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true })
    if (fields.some((field) => !values[field]) || values.consentement !== 'Oui') return NextResponse.json({ error: 'Merci de compléter tous les champs obligatoires.' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return NextResponse.json({ error: 'Veuillez vérifier votre adresse email.' }, { status: 400 })
    if (values.motivation.length < 30 || values.attentes.length < 20) return NextResponse.json({ error: 'Merci de préciser votre motivation et vos attentes.' }, { status: 400 })
    if (values.nom.length > 80 || values.prenom.length > 80 || values.organisation.length > 160 || values.motivation.length > 2000) return NextResponse.json({ error: 'Certaines réponses sont trop longues.' }, { status: 400 })
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    const payload = { evenement: 'Gestion de Crise Tour', dateEvenement: '2026-10-31', dateInscription: new Date().toISOString(), ...values }
    // The deployed Apps Script expects JSON and parses e.postData.contents in doPost(e).
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8', Accept: 'application/json, text/plain, */*' }, body: JSON.stringify(payload), cache: 'no-store', signal: controller.signal })
    clearTimeout(timeout)
    const responseText = await response.text()
    if (!response.ok || /error|failed|exception/i.test(responseText)) throw new Error('Google Apps Script returned an error')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'L’envoi a échoué. Vérifiez votre connexion et réessayez.' }, { status: 502 })
  }
}
