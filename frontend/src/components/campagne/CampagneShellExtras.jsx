/**
 * Modules shell Vague 2 — uniformes sur les 15 landings.
 * Divergence = contenu data (labels, chips), pas la structure.
 */

/** Process strip 3 steps sous « En bref » */
export function CampagneProcessStrip({ steps }) {
  if (!steps?.length) return null;
  return (
    <nav
      aria-label="Parcours"
      className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-0"
      data-testid="campagne-process-strip"
    >
      {steps.map((label, index) => (
        <div key={label} className="flex items-center sm:contents">
          {index > 0 ? (
            <span
              className="mx-2 hidden text-prestige-taupe/40 sm:inline"
              aria-hidden
            >
              →
            </span>
          ) : null}
          <div className="flex items-center gap-2 rounded-full border border-prestige-beige bg-white px-3 py-2 sm:px-4">
            <span className="font-heading flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-dark">{label}</span>
          </div>
        </div>
      ))}
    </nav>
  );
}

/** Chips / kicker sujet dans le hero (micro-signaux) */
export function CampagneHeroChips({ chips }) {
  if (!chips?.length) return null;
  return (
    <>
      {chips.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm md:text-sm"
        >
          {chip}
        </span>
      ))}
    </>
  );
}

/** Portrait CSF uniforme — mid SoftClose / décision */
export function CampagneTrustPortrait({
  className = '',
  dense = false,
}) {
  return (
    <div
      className={`flex items-center gap-3 ${dense ? 'justify-start' : 'justify-center'} ${className}`}
      data-testid="campagne-trust-portrait"
    >
      <img
        src="/seo/portrait.jpg"
        alt=""
        width={dense ? 48 : 56}
        height={dense ? 48 : 56}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white/80 ${
          dense ? 'h-12 w-12' : 'h-14 w-14'
        }`}
        loading="lazy"
      />
      <div className={`min-w-0 text-left ${dense ? '' : 'sm:text-center sm:text-left'}`}>
        <p className="text-sm font-semibold text-dark">Pierre-Olivier Caouette</p>
        <p className="text-xs leading-snug text-prestige-taupe">
          Conseiller en sécurité financière · Victoriaville
        </p>
      </div>
    </div>
  );
}
