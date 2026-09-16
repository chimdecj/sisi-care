import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Heart, Phone, Check } from 'lucide-react';
import { Eyebrow, CareLink, TrustStrip, CareCTA, ServiceArea } from '@/components/shared';
import { HomeStory, GettingStarted } from '@/components/home-story';
import { Testimonials } from '@/components/testimonials';
import { services, contact } from '@/lib/content';
export default function Home() {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><Eyebrow>IN-HOME CARE, WITH HEART</Eyebrow><h1>A little support.<br />A brighter<br /><em>tomorrow.</em></h1><p className="hero-description">Life feels better at home. We help your loved ones stay comfortable, independent, and connected—with care that feels like family.</p><div className="hero-actions"><CareLink>Find care for your loved one</CareLink><a href={`tel:${contact.tel}`} className="hero-call" aria-label={`Call Sisi Care at ${contact.phone}`}><Phone size={18} /><span>Let’s talk<small>{contact.phone}</small></span></a></div><p className="hero-note"><Check size={15} /> Free consultation <span>·</span> Personalized care <span>·</span> Peace of mind</p></div><div className="hero-visual"><div className="hero-image-wrap"><Image className="hero-image" src="/images/care-at-home.webp" alt="A caregiver and an older woman sharing a warm moment at home" fill priority sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="hero-caption"><span className="caption-icon"><Heart size={25} strokeWidth={1.5} /></span><div><strong>More than care.<br />A real connection.</strong><p>Caring people. Brighter days.</p></div></div><div className="hero-side-note">HERE FOR YOUR FAMILY, SINCE 2014</div><div className="hero-small-flower" aria-hidden="true">✳</div></div></div></section>
    <TrustStrip />
    <section className="section services-section"><div className="container"><div className="section-heading"><div><Eyebrow>A HELPING HAND, EVERY DAY</Eyebrow><h2>The care you need.<br /><em>The comfort of home.</em></h2></div><div className="heading-aside"><p>From the little things to everyday essentials, we’re here to make each day a little easier.</p><Link href="/in-home-care/" className="text-link">Explore our care services <ArrowRight size={18} /></Link></div></div><div className="service-grid">{services.map(({ id, title, description, icon: Icon }, i) => <Link href={`/in-home-care/#${id}`} className="service-card" key={id}><div className="service-top"><Icon size={30} strokeWidth={1.4} /><span>0{i + 1}</span></div><h3>{title}</h3><p>{description}</p><span className="service-arrow" aria-label={`Learn about ${title}`}><ArrowUpRight size={19} /></span></Link>)}</div></div></section>
    <HomeStory /><Testimonials /><GettingStarted /><ServiceArea /><CareCTA />
  </>;
}
