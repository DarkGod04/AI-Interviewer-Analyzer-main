'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const lerp = (a, b, n) => (1 - n) * a + n * b;

const getMousePos = (e, container) => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
  }
  return { x: e.clientX, y: e.clientY };
};

const Crosshair = ({ color = '#ec4899', containerRef = null, opacity = 0.7 }) => {
  const cursorRef = useRef(null);
  const lineHorizontalRef = useRef(null);
  const lineVerticalRef = useRef(null);
  const filterXRef = useRef(null);
  const filterYRef = useRef(null);
  // Use a ref so the closure in rAF always has the latest value
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (ev) => {
      mouse.current = getMousePos(ev, containerRef?.current);

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const outside =
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom;

        gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
          opacity: outside ? 0 : opacity,
          duration: 0.3,
        });
      }
    };

    const target = containerRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove);

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.12 },
      ty: { previous: 0, current: 0, amt: 0.12 },
    };

    // Start hidden
    gsap.set([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });

    // Show on first move
    const onFirstMouseMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.current.y;

      gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
        duration: 0.9,
        ease: 'power3.out',
        opacity: opacity,
      });

      requestAnimationFrame(render);
      target.removeEventListener('mousemove', onFirstMouseMove);
    };
    target.addEventListener('mousemove', onFirstMouseMove);

    // Turbulence (noise glitch on link hover)
    const primitiveValues = { turbulence: 0 };

    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        if (lineHorizontalRef.current)
          lineHorizontalRef.current.style.filter = `url(#filter-noise-x-${instanceId})`;
        if (lineVerticalRef.current)
          lineVerticalRef.current.style.filter = `url(#filter-noise-y-${instanceId})`;
      },
      onUpdate: () => {
        if (filterXRef.current)
          filterXRef.current.setAttribute('baseFrequency', primitiveValues.turbulence);
        if (filterYRef.current)
          filterYRef.current.setAttribute('baseFrequency', primitiveValues.turbulence);
      },
      onComplete: () => {
        if (lineHorizontalRef.current)
          lineHorizontalRef.current.style.filter = 'none';
        if (lineVerticalRef.current)
          lineVerticalRef.current.style.filter = 'none';
      },
    }).to(primitiveValues, {
      duration: 0.5,
      ease: 'power1.inOut',
      startAt: { turbulence: 1 },
      turbulence: 0,
    });

    const enter = () => tl.restart();
    const leave = () => tl.progress(1).kill();

    // rAF render loop
    let rafId;
    const render = () => {
      renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.current = mouse.current.y;

      for (const key in renderedStyles) {
        renderedStyles[key].previous = lerp(
          renderedStyles[key].previous,
          renderedStyles[key].current,
          renderedStyles[key].amt
        );
      }

      if (lineVerticalRef.current && lineHorizontalRef.current) {
        gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
        gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });
      }

      rafId = requestAnimationFrame(render);
    };

    // Register glitch effect on links
    const links = containerRef?.current
      ? containerRef.current.querySelectorAll('a, button')
      : document.querySelectorAll('a, button');

    links.forEach((link) => {
      link.addEventListener('mouseenter', enter);
      link.addEventListener('mouseleave', leave);
    });

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mousemove', onFirstMouseMove);
      links.forEach((link) => {
        link.removeEventListener('mouseenter', enter);
        link.removeEventListener('mouseleave', leave);
      });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef, opacity]);

  // Unique ID to avoid filter conflicts if multiple instances exist
  const instanceId = useRef(`ch-${Math.random().toString(36).slice(2)}`).current;

  return (
    <div
      ref={cursorRef}
      style={{
        position: containerRef ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* SVG filters for glitch noise effect */}
      <svg
        style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id={`filter-noise-x-${instanceId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
              ref={filterXRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id={`filter-noise-y-${instanceId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
              ref={filterYRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>

      {/* Horizontal line */}
      <div
        ref={lineHorizontalRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          pointerEvents: 'none',
          opacity: 0,
          boxShadow: `0 0 8px 1px ${color}80`,
        }}
      />

      {/* Vertical line */}
      <div
        ref={lineVerticalRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '1px',
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
          pointerEvents: 'none',
          opacity: 0,
          boxShadow: `0 0 8px 1px ${color}80`,
        }}
      />

      {/* Center dot at intersection — follows with same lerp */}
      <CrosshairDot color={color} lineH={lineHorizontalRef} lineV={lineVerticalRef} />
    </div>
  );
};

// A small glowing dot that sits at the intersection
const CrosshairDot = ({ color }) => (
  <div
    style={{
      position: 'absolute',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 12px 4px ${color}80`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      // Positioned via the parent gsap.set — but we keep it as a visual accent
    }}
  />
);

export default Crosshair;
