'use client';
import { useState, useRef, type FormEvent } from 'react';
import { ArrowUpRight, Mail, Check, Copy, Phone } from 'lucide-react';
import { contact } from '@/lib/content';
export function ContactForm() {
 const [draft, setDraft] = useState<{body:string;href:string}|null>(null);
 const [copyState,setCopyState] = useState('Copy message');
 const resultRef=useRef<HTMLDivElement>(null);
 function prepare(e:FormEvent<HTMLFormElement>) {
  e.preventDefault(); const data=new FormData(e.currentTarget);
  const text=(key:string)=>String(data.get(key)||'').trim();
  const body=`Hello Sisi Care,\n\nI would like to arrange a free care consultation.\n\nName: ${text('name')}\nPhone: ${text('phone')}\nEmail: ${text('email')}\nWho needs care: ${text('who')}\nSupport requested: ${data.getAll('support').join(', ')||'Not sure yet'}\nTiming: ${text('when')}\n\n${text('message') ? 'Additional information: '+text('message')+'\n\n' : ''}Thank you!`;
  setDraft({body,href:`mailto:${contact.email}?subject=${encodeURIComponent('Free care consultation request')}&body=${encodeURIComponent(body)}`});
  setCopyState('Copy message');
  requestAnimationFrame(()=>resultRef.current?.focus());
 }
 async function copy() { if(!draft)return; try { await navigator.clipboard.writeText(draft.body); setCopyState('Message copied'); } catch { setCopyState('Please select and copy the message below'); } }
 return <form className="contact-form" onSubmit={prepare}><h2>Let’s get to know<br /><em>what you need.</em></h2><p className="form-intro">Share a few details, then send your request by email.</p>
 <div className="field"><label htmlFor="name">Your name <span>*</span></label><input id="name" name="name" autoComplete="name" placeholder="First and last name" required maxLength={100}/></div>
 <div className="form-row"><div className="field"><label htmlFor="phone">Phone number <span>*</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(206) 555-0123" required minLength={7} maxLength={30}/></div><div className="field"><label htmlFor="email">Email address <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={150}/></div></div>
 <fieldset><legend>Who needs care?</legend><div className="choice-row">{['Myself','Parent','Spouse','Other loved one'].map((s,i)=><label className="choice" key={s}><input type="radio" name="who" value={s} defaultChecked={i===1}/><span>{s}</span></label>)}</div></fieldset>
 <fieldset><legend>What kind of support are you looking for?</legend><div className="choice-grid">{['Personal / in-home care','Companion care','Dementia & memory support','24-hour care','Not sure yet'].map(s=><label className="choice" key={s}><input type="checkbox" name="support" value={s}/><span>{s}</span></label>)}</div></fieldset>
 <div className="field"><label htmlFor="when">When would you like care to begin?</label><select name="when" id="when" defaultValue="Not sure yet"><option>As soon as possible</option><option>Within a few weeks</option><option>Planning ahead</option><option>Not sure yet</option></select></div>
 <div className="field"><label htmlFor="message">Anything else you’d like us to know? <small>(optional)</small></label><textarea id="message" name="message" rows={4} maxLength={1500} placeholder="Share your questions or the kind of support you have in mind."/><p className="field-note">Please leave medical records and other sensitive details for a conversation with our team.</p></div>
 <button type="submit" className="button button-primary form-submit">Prepare my consultation request <ArrowUpRight size={18}/></button><p className="form-footnote"><Mail size={14}/>You’ll review and send this from your own email app.</p>
 {draft&&<div className="draft-result" ref={resultRef} tabIndex={-1} role="status"><span className="round-icon"><Check size={25}/></span><h3>Your email is ready.</h3><p>Your request has <strong>not been sent yet</strong>. Open your email app to review and send it to <strong>{contact.email}</strong>.</p><div className="draft-actions"><a href={draft.href} className="button button-primary">Open email & review <ArrowUpRight size={17}/></a><button className="button button-secondary" type="button" onClick={copy}><Copy size={16}/>{copyState}</button></div><details><summary>View your message</summary><pre>{draft.body}</pre></details><p>No email app? Copy your message into your preferred email service, or <a href={`tel:${contact.tel}`}>call {contact.phone}</a>.</p></div>}
 </form>;
}
