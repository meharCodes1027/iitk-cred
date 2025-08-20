import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SplitText = ({ text, delay = 50, duration = 0.6, className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.split-char');
    
    // Set initial state
    gsap.set(chars, { y: 100, opacity: 0 });
    
    // Animate characters
    gsap.to(chars, {
      y: 0,
      opacity: 1,
      duration: duration,
      stagger: delay / 1000,
      ease: "power4.out"
    });
  }, [text, delay, duration]);

  const splitTextIntoChars = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="split-char" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className={`split-text ${className}`}>
      {splitTextIntoChars(text)}
    </div>
  );
};

export default SplitText;
