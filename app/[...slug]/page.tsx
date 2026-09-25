import { AboutPage, ContactPage, EventPage, ListingPage, NotFoundPage } from '@/components/feloga-site'
import { RegistrationPage } from '@/components/registration-page'
import { DonationPage } from '@/components/donation-page'
import { NewsPage } from '@/components/news-page'
import { AgendaPage, GalleryPage, JoinPage } from '@/components/special-pages'

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const path = slug.join('/')
  if (path === 'contact') return <ContactPage />
  if (path === 'faire-un-don') return <DonationPage />
  if (path === 'a-propos') return <AboutPage />
  if (path === 'a-propos/vision-missions' || path === 'a-propos/gouvernance') return <NotFoundPage />
  if (path === 'evenements-competitions/gestion-de-crise-tour') return <EventPage />
  if (path === 'evenements-competitions/gestion-de-crise-tour/inscription') return <RegistrationPage />
  if (path === 'actualites-presse') return <NewsPage />
  if (path === 'evenements-competitions/agenda') return <AgendaPage />
  if (path === 'evenements-competitions/galerie') return <GalleryPage />
  if (path === 'nous-rejoindre') return <JoinPage />
  return <ListingPage slug={path} />
}

export function generateStaticParams() {
  return [
    'contact', 'a-propos',
    'programmes-formations', 'programmes-formations/art-oratoire', 'programmes-formations/feloga-seed', 'programmes-formations/ateliers',
    'evenements-competitions', 'evenements-competitions/agenda', 'evenements-competitions/gestion-de-crise-tour', 'evenements-competitions/gestion-de-crise-tour/inscription', 'evenements-competitions/galerie',
    'faire-un-don', 'actualites-presse', 'actualites-presse/articles', 'actualites-presse/kit-media', 'nous-rejoindre', 'nous-rejoindre/adhesion', 'nous-rejoindre/partenariats',
  ].map((route) => ({ slug: route.split('/') }))
}
