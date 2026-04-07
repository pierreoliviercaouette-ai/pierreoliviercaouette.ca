export function PageHero({ badge, title, description }) {
  return (
    <section className="section-padding gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container-max text-center relative z-10">
        {badge ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            {badge}
          </span>
        ) : null}
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
        {description ? (
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
