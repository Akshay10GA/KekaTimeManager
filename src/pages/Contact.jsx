import React from "react";

export default function Contact() {
  return (
    <div className="fade-in">
      <div className="page-header"><h1 className="page-title">Contact Us</h1></div>
      <div className="container" style={{ maxWidth: '600px', paddingBottom: '60px' }}>
        <form style={{ display: 'grid', gap: '20px' }} onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }}>
          <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '15px', border: '1px solid #ddd' }} required />
          <input type="email" placeholder="Your Email" style={{ width: '100%', padding: '15px', border: '1px solid #ddd' }} required />
          <textarea rows="5" placeholder="How can we help?" style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontFamily: 'inherit' }} required></textarea>
          <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', padding: '15px', textTransform: 'uppercase', fontWeight: '600' }}>Send Message</button>
        </form>
      </div>
    </div>
  );
}