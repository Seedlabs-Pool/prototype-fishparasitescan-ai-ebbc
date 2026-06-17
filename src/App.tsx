import React, { useMemo, useState } from 'react';

type Parasite = {
  id: string;
  name: string;
  group: 'Trematode' | 'Cestode' | 'Nematode' | 'Acanthocephalan';
  site: string;
  prevalence: number;
  intensity: number;
  zoonotic: boolean;
  trend: 'rising' | 'stable' | 'falling';
};

const PALETTE = {
  bg: '#0d3b3a',
  surface: '#ffffff',
  ink: '#10302f',
  sub: '#3f5c5a',
  accent: '#0b8a7d',
  accentDark: '#076457',
  warn: '#c4561b',
  danger: '#b3261e',
  soft: '#e6f2f0',
  line: '#d3e3e0',
};

const PARASITES: Parasite[] = [
  { id: 'p1', name: 'Clinostomum tilapiae', group: 'Trematode', site: 'Operculum / gills', prevalence: 64, intensity: 8.2, zoonotic: true, trend: 'rising' },
  { id: 'p2', name: 'Neoechinorhynchus rutili', group: 'Acanthocephalan', site: 'Intestine', prevalence: 71, intensity: 5.4, zoonotic: false, trend: 'rising' },
  { id: 'p3', name: 'Diphyllobothrium spp.', group: 'Cestode', site: 'Body cavity', prevalence: 38, intensity: 3.1, zoonotic: true, trend: 'stable' },
  { id: 'p4', name: 'Procamallanus laeviconchus', group: 'Nematode', site: 'Stomach / intestine', prevalence: 29, intensity: 2.6, zoonotic: false, trend: 'falling' },
  { id: 'p5', name: 'Euclinostomum heterostomum', group: 'Trematode', site: 'Eye / muscle', prevalence: 47, intensity: 6.8, zoonotic: true, trend: 'rising' },
  { id: 'p6', name: 'Polyonchobothrium clarias', group: 'Cestode', site: 'Intestine', prevalence: 33, intensity: 2.9, zoonotic: false, trend: 'stable' },
];

const SEASONS = [
  { name: 'Dry early', value: 41 },
  { name: 'Dry late', value: 58 },
  { name: 'Wet early', value: 72 },
  { name: 'Wet peak', value: 84 },
  { name: 'Wet late', value: 63 },
  { name: 'Cool', value: 45 },
];

const groupColor = (g: Parasite['group']) => {
  switch (g) {
    case 'Trematode': return '#0b8a7d';
    case 'Cestode': return '#5a6fb0';
    case 'Nematode': return '#c4561b';
    case 'Acanthocephalan': return '#9a4f9c';
  }
};

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#0b8a7d" />
      <path d="M8 24c6-9 20-12 30-4-4 3-4 5 0 8-10 8-24 5-30-4z" fill="#e6f2f0" />
      <circle cx="17" cy="22" r="2.4" fill="#076457" />
      <path d="M30 17l5-4M30 31l5 4" stroke="#076457" strokeWidth="2" strokeLinecap="round" />
      <circle cx="33" cy="24" r="3.2" fill="none" stroke="#c4561b" strokeWidth="2" />
    </svg>
  );
}

function TrendIcon({ t }: { t: Parasite['trend'] }) {
  const color = t === 'rising' ? PALETTE.danger : t === 'falling' ? PALETTE.accent : PALETTE.sub;
  const path = t === 'rising' ? 'M3 13L8 7l3 3 5-6' : t === 'falling' ? 'M3 5l5 6 3-3 5 6' : 'M3 9h14';
  return (
    <svg width="18" height="18" viewBox="0 0 19 18" aria-hidden="true">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const [hostSpecies, setHostSpecies] = useState('Oreochromis niloticus (Nile tilapia)');
  const [season, setSeason] = useState('Wet peak');
  const [waterTemp, setWaterTemp] = useState(28);
  const [selected, setSelected] = useState<Parasite | null>(null);
  const [scanned, setScanned] = useState(false);

  const seasonFactor = useMemo(() => {
    const s = SEASONS.find((x) => x.name === season);
    return s ? s.value / 60 : 1;
  }, [season]);

  const tempFactor = useMemo(() => 0.8 + (waterTemp - 24) * 0.04, [waterTemp]);

  const ranked = useMemo(() => {
    return PARASITES.map((p) => {
      const score = Math.min(99, Math.round(p.prevalence * seasonFactor * tempFactor * 0.85));
      return { ...p, risk: score };
    }).sort((a, b) => b.risk - a.risk);
  }, [seasonFactor, tempFactor]);

  const topRisk = ranked[0];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', color: PALETTE.ink, background: PALETTE.soft, minHeight: '100vh' }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .wrap { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
        .card { background: ${PALETTE.surface}; border-radius: 16px; border: 1px solid ${PALETTE.line}; }
        .btn-primary { background: ${PALETTE.warn}; color: #fff; border: none; border-radius: 10px; padding: 14px 24px; font-size: 16px; font-weight: 700; cursor: pointer; }
        .btn-primary:hover { background: #a8480f; }
        .btn-ghost { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 10px; padding: 13px 22px; font-size: 15px; font-weight: 600; cursor: pointer; }
        input[type=range] { accent-color: ${PALETTE.accent}; }
        select { font-size: 15px; padding: 10px 12px; border-radius: 10px; border: 1px solid ${PALETTE.line}; width: 100%; background:#fff; color:${PALETTE.ink}; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 760px){ .grid2, .grid3 { grid-template-columns: 1fr; } }
        .pill { display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:700; padding:4px 10px; border-radius:999px; }
      `}</style>

      {/* Header */}
      <header style={{ background: PALETTE.bg }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', flexWrap: 'wrap' }}>
          <Logo />
          <div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>FishParasiteScan</div>
            <div style={{ color: '#9fd3cc', fontSize: 13 }}>AI parasite surveillance for tropical aquaculture</div>
          </div>
          <nav style={{ marginLeft: 'auto', display: 'flex', gap: 18 }}>
            <a href="#how" style={{ color: '#cfe9e5', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>How it works</a>
            <a href="#risk" style={{ color: '#cfe9e5', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Risk model</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${PALETTE.bg} 0%, ${PALETTE.accentDark} 100%)`, color: '#fff' }}>
        <div className="wrap" style={{ padding: '52px 20px 60px', display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
          <div style={{ maxWidth: 720 }}>
            <span className="pill" style={{ background: 'rgba(255,255,255,0.14)', color: '#bfe6e0' }}>Field-calibrated · Tropical freshwater</span>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.08, margin: '16px 0 14px', fontWeight: 800 }}>
              Catch the parasite before it costs the harvest.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: '#d4ece8', margin: '0 0 26px', maxWidth: 600 }}>
              FishParasiteScan turns standardized sampling kits and image AI into local infection baselines, seasonal forecasts, and clear inspect-and-treat alerts for your farm or fishery.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-primary" data-cta="hero-demo" onClick={() => { setScanned(true); document.getElementById('risk')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Run a live risk scan
              </button>
              <a href="#how"><button className="btn-ghost">See the protocol</button></a>
            </div>
            <div style={{ display: 'flex', gap: 28, marginTop: 34, flexWrap: 'wrap' }}>
              {[['59.5%', 'lake-wide prevalence baseline'], ['71%', 'peak acanthocephalan prevalence'], ['F=196.8', 'site-burden signal strength']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{n}</div>
                  <div style={{ fontSize: 13, color: '#9fd3cc', maxWidth: 150 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="wrap" style={{ padding: '44px 20px 60px', display: 'grid', gap: 44 }}>
        {/* How it works */}
        <section id="how">
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>From pond to prediction</h2>
          <p style={{ color: PALETTE.sub, fontSize: 15.5, margin: '0 0 22px', maxWidth: 640 }}>A repeatable workflow that any field officer can run, calibrated to your local water body.</p>
          <div className="grid3">
            {[
              { t: 'Sample with the kit', d: 'Standardized swabs and dissection guides target high-burden sites — operculum, gills, intestine, eye.', icon: 'kit' },
              { t: 'Scan & catalog', d: 'Upload images; AI identifies species and logs prevalence, intensity and infection site automatically.', icon: 'scan' },
              { t: 'Act on alerts', d: 'Get species, site and season-specific guidance on inspection, treatment and harvest timing.', icon: 'alert' },
            ].map((s, i) => (
              <div key={s.t} className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: PALETTE.soft, color: PALETTE.accentDark, display: 'grid', placeItems: 'center', fontWeight: 800 }}>{i + 1}</span>
                  <StepIcon kind={s.icon} />
                </div>
                <h3 style={{ fontSize: 17, margin: '0 0 6px' }}>{s.t}</h3>
                <p style={{ color: PALETTE.sub, fontSize: 14.5, margin: 0, lineHeight: 1.5 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Risk model */}
        <section id="risk">
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>Live risk model</h2>
          <p style={{ color: PALETTE.sub, fontSize: 15.5, margin: '0 0 22px', maxWidth: 640 }}>Set your conditions to recompute the parasite watchlist for your site.</p>
          <div className="grid2">
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'grid', gap: 16 }}>
                <label>
                  <span style={{ fontSize: 13.5, fontWeight: 700, display: 'block', marginBottom: 6 }}>Host species</span>
                  <select value={hostSpecies} onChange={(e) => setHostSpecies(e.target.value)}>
                    <option>Oreochromis niloticus (Nile tilapia)</option>
                    <option>Clarias gariepinus (African catfish)</option>
                    <option>Heterotis niloticus (African bonytongue)</option>
                    <option>Lates niloticus (Nile perch)</option>
                  </select>
                </label>
                <label>
                  <span style={{ fontSize: 13.5, fontWeight: 700, display: 'block', marginBottom: 6 }}>Season</span>
                  <select value={season} onChange={(e) => setSeason(e.target.value)}>
                    {SEASONS.map((s) => <option key={s.name}>{s.name}</option>)}
                  </select>
                </label>
                <label>
                  <span style={{ fontSize: 13.5, fontWeight: 700, display: 'block', marginBottom: 6 }}>Water temperature: {waterTemp}°C</span>
                  <input type="range" min={22} max={34} value={waterTemp} onChange={(e) => setWaterTemp(Number(e.target.value))} style={{ width: '100%' }} />
                </label>
                <button className="btn-primary" data-cta="recompute" style={{ background: PALETTE.accent }} onClick={() => setScanned(true)}>
                  Recompute watchlist
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: 22, background: scanned ? '#fff' : '#fbfdfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h3 style={{ fontSize: 16, margin: 0 }}>Top priority alert</h3>
                <span className="pill" style={{ background: PALETTE.soft, color: PALETTE.accentDark }}>{season} · {waterTemp}°C</span>
              </div>
              <div style={{ background: '#fdeee6', border: `1px solid #f0c4ab`, borderRadius: 12, padding: 16, margin: '12px 0 8px' }}>
                <div style={{ fontSize: 13, color: PALETTE.warn, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Inspect now · {topRisk.site}</div>
                <div style={{ fontSize: 19, fontWeight: 800, margin: '4px 0 2px' }}>{topRisk.name}</div>
                <p style={{ fontSize: 14, color: PALETTE.sub, margin: 0, lineHeight: 1.5 }}>
                  Projected risk index <strong>{topRisk.risk}</strong> for {hostSpecies.split(' (')[0]}. {topRisk.zoonotic ? 'Zoonotic — apply food-safety protocol before sale.' : 'Yield-impacting — schedule targeted treatment.'}
                </p>
              </div>
              <SeasonChart current={season} />
            </div>
          </div>
        </section>

        {/* Watchlist */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>Parasite watchlist</h2>
          <p style={{ color: PALETTE.sub, fontSize: 15.5, margin: '0 0 18px' }}>Ranked by projected risk index. Tap a row for inspection guidance.</p>
          <div className="card" style={{ overflow: 'hidden' }}>
            {ranked.map((p, i) => (
              <button key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)} style={{ width: '100%', textAlign: 'left', background: selected?.id === p.id ? PALETTE.soft : '#fff', border: 'none', borderTop: i ? `1px solid ${PALETTE.line}` : 'none', padding: '14px 18px', cursor: 'pointer', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ width: 8, height: 36, borderRadius: 4, background: groupColor(p.group) }} />
                  <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: PALETTE.sub }}>{p.group} · {p.site}</div>
                  </div>
                  {p.zoonotic && <span className="pill" style={{ background: '#fbe3e1', color: PALETTE.danger }}>Zoonotic</span>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendIcon t={p.trend} /><span style={{ fontSize: 13, color: PALETTE.sub }}>{p.trend}</span></div>
                  <div style={{ textAlign: 'right', minWidth: 70 }}>
                    <div style={{ fontSize: 19, fontWeight: 800, color: p.risk > 60 ? PALETTE.warn : PALETTE.accentDark }}>{p.risk}</div>
                    <div style={{ fontSize: 11.5, color: PALETTE.sub }}>risk index</div>
                  </div>
                </div>
                {selected?.id === p.id && (
                  <div style={{ marginTop: 12, paddingLeft: 20, fontSize: 14, color: PALETTE.sub, lineHeight: 1.6 }}>
                    <strong style={{ color: PALETTE.ink }}>Baseline prevalence:</strong> {p.prevalence}% · <strong style={{ color: PALETTE.ink }}>Mean intensity:</strong> {p.intensity} per host.<br />
                    Focus dissection on the <strong style={{ color: PALETTE.ink }}>{p.site.toLowerCase()}</strong>, where burden concentrates. {p.zoonotic ? 'Hold affected lots from market and notify the fisheries officer.' : 'Adjust stocking density and consider harvest before peak season.'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Trusted by */}
        <section className="card" style={{ padding: 28, background: PALETTE.bg, color: '#fff' }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 460 }}>
              <h2 style={{ fontSize: 22, margin: '0 0 8px' }}>Built for the people scaling tropical protein</h2>
              <p style={{ color: '#bfe6e0', fontSize: 15, margin: 0, lineHeight: 1.5 }}>Designed with feed, health and food-safety teams from across sub-Saharan aquaculture.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Skretting', 'Cargill Aqua', 'Premium Aquaculture', 'WorldFish', 'Zoetis'].map((n) => (
                <span key={n} className="pill" style={{ background: 'rgba(255,255,255,0.12)', color: '#dff1ee', fontSize: 13.5 }}>{n}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="card" style={{ padding: 32, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, margin: '0 0 10px' }}>Start a calibrated surveillance pilot</h2>
          <p style={{ color: PALETTE.sub, fontSize: 15.5, maxWidth: 540, margin: '0 auto 22px' }}>Send us your water body and host species. We return a baseline survey plan and your first seasonal forecast in two weeks.</p>
          <button className="btn-primary" data-cta="final-pilot" onClick={() => alert('Thanks! A FishParasiteScan specialist will reach out to set up your sampling kits.')}>
            Request a pilot kit
          </button>
        </section>
      </main>

      <footer style={{ background: PALETTE.bg, color: '#9fd3cc', fontSize: 13.5, textAlign: 'center', padding: '22px 20px' }}>
        FishParasiteScan — surveillance &amp; decision support for tropical freshwater aquaculture.
      </footer>
    </div>
  );
}

function StepIcon({ kind }: { kind: string }) {
  const c = PALETTE.accent;
  if (kind === 'kit') return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="13" rx="2" fill="none" stroke={c} strokeWidth="2" /><path d="M9 7V5h6v2M4 12h16" stroke={c} strokeWidth="2" fill="none" /></svg>
  );
  if (kind === 'scan') return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" fill="none" stroke={c} strokeWidth="2" /><path d="M20 20l-4-4" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>
  );
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 16H3z" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" /><path d="M12 9v5M12 16.5v.5" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>
  );
}

function SeasonChart({ current }: { current: string }) {
  const max = Math.max(...SEASONS.map((s) => s.value));
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: PALETTE.sub, marginBottom: 8 }}>Seasonal prevalence forecast</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 110 }}>
        {SEASONS.map((s) => {
          const active = s.name === current;
          return (
            <div key={s.name} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: `${(s.value / max) * 86}px`, background: active ? PALETTE.warn : PALETTE.accent, borderRadius: '6px 6px 0 0', opacity: active ? 1 : 0.55 }} />
              <div style={{ fontSize: 10.5, color: PALETTE.sub, marginTop: 5, lineHeight: 1.1 }}>{s.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
