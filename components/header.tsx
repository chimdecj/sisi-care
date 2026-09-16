'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { contact } from '@/lib/content';
const links = [['/', 'Home'], ['/in-home-care/', 'In-Home Care'], ['/about/', 'About Us'], ['/careers/', 'Careers'], ['/contact/', 'Contact']];
export function Header() {
  const path = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { const close = (e: KeyboardEvent) => { if(e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, []);
  return <header className="site-header">
    <div className="topbar"><div className="container flex items-center justify-between gap-4"><span className="flex items-center gap-2"><MapPin size={13} /> Proudly serving Bellevue & the Eastside</span><a href={`tel:${contact.tel}`} className="flex items-center gap-2">Let’s talk about care <ArrowUpRight size={13} /></a></div></div>
    <div className="container nav-inner">
      <Link href="/" className="brand" aria-label="Sisi Care home" onClick={() => setOpen(false)}><Image src="/images/sisi-care-logo.png" width={99} height={78} priority alt="Sisi Care" /><span className="brand-rule" /><span className="brand-tagline">A brighter<br />tomorrow at home.</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([href, label]) => <Link key={href} className={path.replace(/\/$/, '') === href.replace(/\/$/, '') ? 'active' : ''} href={href}>{label}</Link>)}</nav>
      <a className="nav-phone" href={`tel:${contact.tel}`}><Phone size={16} />{contact.phone}</a>
      <button ref={toggle} className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={path.replace(/\/$/, '') === href.replace(/\/$/, '') ? 'page' : undefined}>{label}<ArrowUpRight size={16} /></Link>)}<a href={`tel:${contact.tel}`}><Phone size={16} /> {contact.phone}</a></nav>}
  </header>;
}
