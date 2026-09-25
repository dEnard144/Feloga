import Link from 'next/link'
import { ArrowUpRight, ChevronRight } from 'lucide-react'

const logo = '/images/feloga-logo.jpeg'

const nav = [
  { label: 'À propos', href: '/a-propos', children: [] },
  { label: 'Programmes', href: '/programmes-formations', children: [{ label: 'FELOGA Seed', href: '/programmes-formations/feloga-seed' }, { label: 'Ateliers & Workshops', href: '/programmes-formations/ateliers' }] },
  { label: 'Événements', href: '/evenements-competitions', children: [] },
  { label: 'Actualités', href: '/actualites-presse', children: [] },
  { label: 'Rejoindre FELOGA', href: '/nous-rejoindre', children: [] },
]

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return <nav className={mobile ? 'mobile-nav' : 'desktop-nav'} aria-label={mobile ? 'Navigation mobile' : 'Navigation principale'}>{nav.map((item) => mobile ? <div className="mobile-nav-group" key={item.href}><Link href={item.href}>{item.label}</Link>{item.children.map((child) => <Link className="mobile-nav-child" key={child.href} href={child.href}>{child.label}</Link>)}</div> : <div className="nav-item" key={item.href}><Link href={item.href}>{item.label}</Link><div className="nav-menu">{item.children.map((child) => <Link key={child.href} href={child.href}>{child.label}<ChevronRight size={14} /></Link>)}</div></div>)}<Link className="nav-donation" href="/faire-un-don">Faire un don</Link><Link className={mobile ? 'mobile-nav-contact' : 'nav-contact'} href="/contact">Contact <ArrowUpRight size={15} /></Link></nav>
}

export function Header() {
  return <header className="site-header"><Link href="/" className="brand"><img src={logo} alt="FELOGA" /></Link><Navigation /><details className="mobile-menu"><summary aria-label="Ouvrir le menu">Menu</summary><Navigation mobile /></details></header>
}
