// Inline SVG icon helpers. Stroke-style, single weight.

function Icon({ name, size = 18, stroke = 1.6, fill = 'none' }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill,
    stroke: 'currentColor', strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const paths = {
    search:  <><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></>,
    bag:     <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8a3 3 0 1 1 6 0" /></>,
    heart:   <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
    user:    <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    chev:    <path d="m6 9 6 6 6-6" />,
    chev_l:  <path d="m15 6-6 6 6 6" />,
    chev_r:  <path d="m9 6 6 6-6 6" />,
    menu:    <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
    plus:    <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    pin:     <><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" /><circle cx="12" cy="9" r="2.5" /></>,
    truck:   <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
    shield:  <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 4v4h-4" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 20v-4h4" /></>,
    phone:   <path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    flame:   <path d="M12 22a6 6 0 0 0 6-6c0-4-3-6-3-10 0 0-3 1-3 5-1-2-3-3-3-5 0 0-3 3-3 8a6 6 0 0 0 6 8Z" />,
    star:    <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3l1.1-6.3L3 9.6l6.3-.9L12 3Z" />,
    star_f:  <path fill="currentColor" stroke="none" d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3l1.1-6.3L3 9.6l6.3-.9L12 3Z" />,
    bolt:    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    eye:     <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    box:     <><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
    grid:    <><path d="M3 3h7v7H3z" /><path d="M14 3h7v7h-7z" /><path d="M3 14h7v7H3z" /><path d="M14 14h7v7h-7z" /></>,
  };
  return <svg {...props}>{paths[name] ?? null}</svg>;
}

window.Icon = Icon;
