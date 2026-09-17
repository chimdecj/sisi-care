'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { BrandLogo } from './brand-logo';
import { contact } from '@/lib/content';
const links = [
  ['/', 'Home'],
  ['/in-home-care/', 'In-Home Care'],
  ['/about/', 'About Us'],
  ['/careers/', 'Careers'],
  ['/contact/', 'Contact'],
];
export function Header() {
  const path = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  const active = (href: string) => path.replace(/\/$/, '') === href.replace(/\/$/, '');
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Sisi Care home" onClick={() => setOpen(false)}>
          <BrandLogo priority />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              key={href}
              aria-current={active(href) ? 'page' : undefined}
              className={active(href) ? 'active' : ''}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <a className="nav-phone" href={`tel:${contact.tel}`}>
          <Phone size={22} aria-hidden="true" />
          {contact.phone}
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active(href) ? 'page' : undefined}
            >
              {label}
              <ArrowRight size={16} />
            </Link>
          ))}
          <a href={`tel:${contact.tel}`}>
            <Phone size={18} />
            {contact.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
