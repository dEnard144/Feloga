'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react'

const eventLabel = 'Gestion de Crise Tour — FELOGA'

export function RegistrationForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending'); setError(''); const form = event.currentTarget
    try { const response = await fetch('/api/inscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setStatus('success'); form.reset() } catch (submissionError) { setStatus('error'); setError(submissionError instanceof Error ? submissionError.message : 'Impossible d’envoyer votre inscription.') }
  }
  if (status === 'success') return <Confirmation />
  return <form className="registration-form" onSubmit={handleSubmit} noValidate>
    <div className="form-intro"><span className="eyebrow">Inscription officielle · places limitées</span><h2>Vous vous inscrivez bien au Tour.</h2><p>Remplissez ce formulaire pour réserver votre participation au Gestion de Crise Tour du 31 octobre 2026. Les informations pratiques vous seront envoyées après validation.</p></div>
    <div className="form-grid">
      <Field label="Nom" name="nom" required /><Field label="Prénom" name="prenom" required /><Field label="Email" name="email" type="email" required /><Field label="Téléphone / WhatsApp" name="whatsapp" type="tel" required /><Field label="Ville de résidence" name="ville" required />
      <Select label="Votre profil" name="profil" required options={['Élève / lycéen','Étudiant','Jeune professionnel','Entrepreneur','Association / organisation','Autre']} />
      <Field label="École, entreprise ou association" name="organisation" className="full" required />
      <Select label="Comment avez-vous connu l’événement ?" name="source" required options={['Instagram / Facebook','WhatsApp','Un proche ou un collègue','Mon école / université','Une organisation partenaire','Presse / média','Autre']} />
      <Select label="Avez-vous déjà participé à une activité FELOGA ?" name="experienceFeloga" required options={['Oui','Non']} />
      <Select label="Avez-vous un besoin d’accessibilité à signaler ?" name="accessibilite" options={['Non','Oui, je préciserai ci-dessous']} />
      <label className="form-field full"><span>Précision accessibilité ou besoin particulier</span><input name="precisionAccessibilite" placeholder="Facultatif" /></label>
      <label className="form-field full"><span>Qu’attendez-vous de cette journée ? <b>*</b></span><textarea name="attentes" rows={3} required minLength={20} placeholder="Une compétence, une rencontre ou un sujet…" /></label>
      <label className="form-field full"><span>Pourquoi souhaitez-vous participer ? <b>*</b></span><textarea name="motivation" rows={4} required minLength={30} placeholder="Votre motivation en quelques lignes…" /></label>
    </div>
    <label className="honeypot" aria-hidden="true">Ne pas remplir<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent-field"><input type="checkbox" name="consentement" value="Oui" required /><span>J’accepte que FELOGA utilise mes informations pour traiter cette inscription et m’envoyer les informations pratiques du Tour.</span></label>
    {status === 'error' && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? <><Loader2 size={16} className="spin" /> Envoi en cours</> : <>Confirmer mon inscription <ArrowUpRight size={16} /></>}</button>
  </form>
}
function Field({ label, name, type = 'text', required = false, className = '' }: { label: string; name: string; type?: string; required?: boolean; className?: string }) { return <label className={`form-field ${className}`}><span>{label} {required && <b>*</b>}</span><input name={name} type={type} required={required} /></label> }
function Select({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) { return <label className="form-field"><span>{label} {required && <b>*</b>}</span><select name={name} required={required} defaultValue=""><option value="" disabled>Choisir une réponse</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label> }
function Confirmation() { const calendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventLabel)}&dates=20261031T073000Z/20261031T160000Z&location=${encodeURIComponent('Institut Français du Gabon, Libreville')}`; return <div className="confirmation-card" role="status"><CheckCircle2 size={42} /><span className="eyebrow">Inscription transmise</span><h2>À bientôt au Gestion de Crise Tour.</h2><p>Votre demande est bien enregistrée. FELOGA vous recontactera avec les informations pratiques.</p><div className="confirmation-actions"><a className="button button-primary" href={calendar} target="_blank" rel="noreferrer">Ajouter au calendrier <ArrowUpRight size={16} /></a><a className="button button-outline-dark" href="/evenements-competitions/gestion-de-crise-tour">Retour à l’événement <ArrowUpRight size={16} /></a></div></div> }

export { eventLabel }

  
