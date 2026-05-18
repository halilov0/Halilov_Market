// Main app — general marketplace orchestration.

const {
  UtilityBar, Header, DepartmentNav, Hero, BrandStrip,
  DepartmentTiles, FlashDeals, ProductGrid, DualPromo, TrustStrip, Footer,
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle,
} = window;

const ACCENT_PRESETS = {
  red:     { accent: 'oklch(0.58 0.18 27)',  deep: 'oklch(0.48 0.18 27)',  soft: 'oklch(0.96 0.04 27)' },
  navy:    { accent: 'oklch(0.45 0.14 255)', deep: 'oklch(0.35 0.14 255)', soft: 'oklch(0.95 0.03 255)' },
  green:   { accent: 'oklch(0.5 0.13 145)',  deep: 'oklch(0.4 0.13 145)',  soft: 'oklch(0.95 0.04 145)' },
  orange:  { accent: 'oklch(0.65 0.16 55)',  deep: 'oklch(0.55 0.16 55)',  soft: 'oklch(0.96 0.05 60)' },
  purple:  { accent: 'oklch(0.5 0.18 295)',  deep: 'oklch(0.4 0.18 295)',  soft: 'oklch(0.96 0.03 295)' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "red",
  "density": "default",
  "showDelivery": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const { FEATURED, RECOMMEND } = window.MARKET_DATA;

  React.useEffect(() => {
    const p = ACCENT_PRESETS[t.accent] ?? ACCENT_PRESETS.red;
    const root = document.documentElement;
    root.style.setProperty('--accent', p.accent);
    root.style.setProperty('--accent-deep', p.deep);
    root.style.setProperty('--accent-soft', p.soft);
  }, [t.accent]);

  return (
    <>
      <UtilityBar />
      <Header cartCount={3} />
      <DepartmentNav />
      <main className="page">
        <Hero />
        <BrandStrip />
        <DepartmentTiles />
        <FlashDeals />
        <ProductGrid
          label="08a Featured"
          title="מובחר השבוע"
          meta={`${FEATURED.length} פריטים · ממוין לפי פופולריות`}
          products={FEATURED}
          density={t.density}
          showDelivery={t.showDelivery}
        />
        <DualPromo />
        <ProductGrid
          label="08b Recommended"
          title="חזרו לחפש"
          meta="פריטים שמתחברים לקטגוריות שלך"
          products={RECOMMEND}
          density={t.density}
          showDelivery={t.showDelivery}
        />
        <TrustStrip />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand color">
          <TweakRadio
            label="Accent"
            value={t.accent}
            onChange={(v) => setTweak('accent', v)}
            options={[
              { value: 'red',    label: 'Red' },
              { value: 'navy',   label: 'Navy' },
              { value: 'green',  label: 'Green' },
              { value: 'orange', label: 'Orange' },
              { value: 'purple', label: 'Purple' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Catalog layout">
          <TweakRadio
            label="Density"
            value={t.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'spacious', label: 'Roomy' },
              { value: 'default',  label: 'Default' },
              { value: 'dense',    label: 'Dense' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Cards">
          <TweakToggle
            label="Show delivery tag"
            value={t.showDelivery}
            onChange={(v) => setTweak('showDelivery', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
