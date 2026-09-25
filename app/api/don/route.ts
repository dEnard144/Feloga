import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { amount?: string; email?: string; name?: string } | null
  const amount = Number(body?.amount)
  if (!Number.isInteger(amount) || amount < 1000 || amount > 10000000) return NextResponse.json({ error: 'Choisissez un montant compris entre 1 000 et 10 000 000 FCFA.' }, { status: 400 })
  if (!body?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return NextResponse.json({ error: 'Veuillez renseigner une adresse email valide.' }, { status: 400 })
  const endpoint = process.env.EBILLING_CHECKOUT_URL
  if (!endpoint) return NextResponse.json({ error: 'Le paiement sera bientôt disponible. Merci de réessayer prochainement.' }, { status: 503 })
  const reference = `FELOGA-DON-${Date.now()}`
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.EBILLING_API_KEY ? { Authorization: `Bearer ${process.env.EBILLING_API_KEY}` } : {}) }, body: JSON.stringify({ amount, currency: 'XAF', reference, customer: { name: body.name || '', email: body.email }, callbackUrl: process.env.EBILLING_CALLBACK_URL }), cache: 'no-store' })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error('E-Billing error')
    return NextResponse.json({ paymentUrl: result.paymentUrl || result.checkoutUrl || result.url, reference })
  } catch { return NextResponse.json({ error: 'Le service de paiement est momentanément indisponible.' }, { status: 502 }) }
}
