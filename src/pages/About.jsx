import React from "react";

export default function About() {
  return (
    <div className="fade-in">
      <div className="page-header"><h1 className="page-title">Our Story</h1></div>
      <div className="text-block">
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Pehrin was born in the narrow, colorful streets of Jaipur.</p>
        <p>We bridge the gap between traditional Indian craftsmanship and modern silhouettes. Our artisans use centuries-old block printing techniques to create fabrics that breathe. We believe in sustainable fashion that doesn't just look good, but feels good too.</p>
      </div>
      <img src="https://images.unsplash.com/photo-1560709426-ac8ac3757274?auto=format&fit=crop&q=80&w=1200" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
    </div>
  );
}