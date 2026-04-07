/** Grille décorative alignée sur Home / À propos */
const HERO_GRID_PATTERN =
  'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';

/**
 * Héros marketing : même langage visuel qu'Accueil et À propos (gradient, halos, grille, vague).
 */
export function PageHero({
  badge,
  title,
  description,
  children,
  showWave = true,
  /** ex. min-h-[50vh] pour des pages plus compactes */
  minHeightClass = 'min-h-[60vh] md:min-h-[70vh]',
}) {
  return (
    <section className={`relative ${minHeightClass} overflow-hidden`} aria-labelledby="page-hero-title">
      <div className="absolute inset-0 gradient-hero" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-secondary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-white/10 rounded-full blur-[60px] md:blur-[80px]" />
        <div className="absolute top-1/2 right-0 w-[280px] h-[300px] bg-primary/30 rounded-full blur-[60px] hidden sm:block" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: HERO_GRID_PATTERN }}
      />

      <div className="container-max relative z-10 flex flex-col justify-center px-4 md:px-8 py-16 md:py-20 min-h-[inherit] text-center">
        {badge ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-5 mx-auto bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            {badge}
          </span>
        ) : null}
        <h1 id="page-hero-title" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">{description}</p>
        ) : null}
        {children ? <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">{children}</div> : null}
      </div>

      {showWave ? (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none leading-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-auto translate-y-px"
            aria-hidden
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      ) : null}
    </section>
  );
}
