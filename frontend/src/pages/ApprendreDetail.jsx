import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useAudienceMode } from '../context/AudienceModeContext';
import {
  getApprendrePath,
  getFormationById,
  getRelatedFormations,
} from '../data/formations';
import { getServiceById } from '../data/services';
import { FormationConceptDiagram } from '../components/formations/FormationConceptDiagram';
import { FormationTimelineChart } from '../components/formations/FormationTimelineChart';
import { FormationQuiz } from '../components/formations/FormationQuiz';
import { useFormationProgress } from '../hooks/useFormationProgress';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

/** La page affiche déjà 01, 02… — retirer un préfixe « 1. » éventuel dans les données. */
function sectionTitle(heading) {
  return String(heading || '').replace(/^\d+\.\s+/, '');
}

export function ApprendreDetail() {
  const { slug } = useParams();
  const { audience, isPrive } = useAudienceMode();
  const item = getFormationById(slug);
  const { isComplete, markComplete } = useFormationProgress();
  const [activeSection, setActiveSection] = useState(0);

  useSeoMeta({
    title: item
      ? `${item.seoTitle} | Apprendre`
      : 'Apprendre | Pierre-Olivier Caouette',
    description: item?.seoDescription ?? 'Capsules éducatives courtes.',
    canonicalPath: item ? getApprendrePath(item.id) : '/apprendre',
  });

  const sectionIds = useMemo(
    () => (item?.sections || []).map((_, i) => `apprendre-s-${i}`),
    [item]
  );

  useEffect(() => {
    if (!sectionIds.length) return undefined;
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = sectionIds.indexOf(visible.target.id);
        if (idx >= 0) setActiveSection(idx);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.4] }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sectionIds, slug]);

  if (!item || !(item.audiences || []).includes(audience)) {
    return <Navigate to="/apprendre" replace />;
  }

  const Icon = item.icon || BookOpen;
  const done = isComplete(item.id);
  const related = getRelatedFormations(item, audience, 3);
  const relatedServices = (item.relatedServiceIds || [])
    .map((id) => getServiceById(id))
    .filter(Boolean)
    .filter((s) => (s.audiences || []).includes(audience))
    .slice(0, 3);

  return (
    <main data-testid={`apprendre-detail-${item.id}`} className="min-h-[70vh] bg-white">
      <header className={`relative overflow-hidden ${isPrive ? 'bg-[#111111]' : 'bg-dark'} text-white`}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
        </div>
        <div className="container-max relative px-5 py-10 md:px-8 md:py-12">
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/45" aria-label="Fil d’Ariane">
            <Link to="/apprendre" className="transition-colors hover:text-white">
              Apprendre
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/75">{item.title}</span>
          </nav>

          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-medium tracking-wide text-white/55">
            <span className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1">
              <Clock className="h-3.5 w-3.5" />
              {item.readMinutes} min de lecture
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              Mini-formation
            </span>
            {done ? (
              <span className="inline-flex items-center gap-1 text-white/80">
                <Check className="h-3.5 w-3.5" />
                Déjà lu
              </span>
            ) : null}
          </div>

          <h1 className="max-w-4xl font-heading text-3xl font-bold leading-tight md:text-5xl">
            {item.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-white/65 md:text-xl">{item.subtitle}</p>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/50">
            {item.shortDescription}
          </p>
        </div>
      </header>

      {item.keyFacts?.length ? (
        <div className="border-b border-prestige-beige/80 bg-zinc-50/40">
          <div className="container-max grid px-5 sm:grid-cols-3 md:px-8">
            {item.keyFacts.map((fact, fi) => (
              <div
                key={fact.label}
                className={`px-1 py-7 sm:px-6 ${
                  fi > 0 ? 'border-t border-prestige-beige/70 sm:border-t-0 sm:border-l' : ''
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">
                  {fact.label}
                </p>
                <p className="mt-2.5 font-heading text-[15px] font-semibold leading-snug text-dark md:text-base">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="container-max px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-prestige-taupe">
                Sommaire
              </p>
              <nav aria-label="Sommaire">
                <ol className="space-y-0.5 border-l border-prestige-beige">
                  {item.sections.map((section, i) => (
                    <li key={section.heading}>
                      <a
                        href={`#${sectionIds[i]}`}
                        className={`block border-l-2 py-2 pl-3 text-[13px] leading-snug transition-colors ${
                          activeSection === i
                            ? '-ml-px border-primary font-semibold text-dark'
                            : 'border-transparent text-slate-500 hover:text-dark'
                        }`}
                      >
                        {sectionTitle(section.heading)}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="space-y-16 md:space-y-[4.5rem]">
              {item.sections.map((section, i) => (
                <section key={section.heading} id={sectionIds[i]} className="scroll-mt-28">
                  <div className="mb-6 flex max-w-3xl items-baseline gap-3">
                    <span className="font-heading text-3xl font-light leading-none text-prestige-beige tabular-nums md:text-4xl">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-heading text-xl font-bold leading-snug text-dark md:text-2xl">
                      {sectionTitle(section.heading)}
                    </h2>
                  </div>
                  <div className="max-w-3xl">
                    {section.paragraphs?.map((p, pi) => (
                      <p
                        key={p}
                        className={`mb-5 text-[16.5px] leading-[1.85] text-slate-600 last:mb-0 md:text-[17px] ${
                          pi === 0 ? 'text-slate-700' : ''
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                    {section.bullets?.length ? (
                      <ul className="mt-6 space-y-3 border-l-2 border-prestige-beige pl-4">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-[15.5px] leading-[1.7] text-slate-600"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  {i === 0 ? (
                    <div className="mt-10">
                      <FormationConceptDiagram
                        formationId={item.id}
                        mode="concept"
                        variant="inline"
                      />
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            {item.workedExample ? (
              <section className="mt-16 md:mt-20">
                <div className="max-w-3xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">
                    Exemple chiffré
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-dark">
                    {item.workedExample.title}
                  </h2>
                  {item.workedExample.intro ? (
                    <p className="mt-4 text-[16px] leading-[1.8] text-slate-600">
                      {item.workedExample.intro}
                    </p>
                  ) : null}
                  {item.workedExample.steps?.length ? (
                    <ol className="mt-8 space-y-5">
                      {item.workedExample.steps.map((step, idx) => (
                        <li key={step.label} className="flex gap-4">
                          <span className="font-heading text-base font-light text-prestige-taupe tabular-nums">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <p className="font-heading font-semibold text-dark">{step.label}</p>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">
                              {step.detail}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {item.workedExample.result ? (
                    <p className="mt-8 border-l-2 border-dark pl-4 text-[15px] font-medium leading-relaxed text-dark">
                      {item.workedExample.result}
                    </p>
                  ) : null}
                </div>
                {item.timeline ? (
                  <div className="mt-10">
                    <FormationTimelineChart timeline={item.timeline} />
                  </div>
                ) : (
                  <div className="mt-10">
                    <FormationConceptDiagram
                      formationId={item.id}
                      mode="example"
                      variant="inline"
                    />
                  </div>
                )}
              </section>
            ) : null}

            {item.takeaways?.length ? (
              <div className="mt-16 bg-dark px-6 py-9 text-white md:mt-20 md:px-10">
                <h2 className="font-heading text-lg font-bold tracking-tight">À retenir</h2>
                <ul
                  className={`mt-6 grid gap-4 md:gap-x-10 md:gap-y-5 ${
                    item.takeaways.length === 3
                      ? 'md:grid-cols-3'
                      : 'md:grid-cols-2'
                  }`}
                >
                  {item.takeaways.map((line) => (
                    <li key={line} className="text-[15px] leading-relaxed text-white/80">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {item.quiz ? <FormationQuiz quiz={item.quiz} formationId={item.id} /> : null}

            {item.sources?.length ? (
              <details className="mt-12 border-t border-prestige-beige pt-6">
                <summary className="cursor-pointer list-none text-[10px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe marker:content-none [&::-webkit-details-marker]:hidden">
                  Sources consultées
                  <span className="ml-2 font-normal normal-case tracking-normal text-slate-400">
                    ({item.sources.length})
                  </span>
                </summary>
                <ul className="mt-3 space-y-1.5">
                  {item.sources.map((s) => (
                    <li key={s.url || s.name} className="text-xs text-slate-500">
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline"
                        >
                          {s.name}
                        </a>
                      ) : (
                        s.name
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}

            <div className="mt-10 flex flex-col gap-3 border-t border-prestige-beige pt-8 sm:flex-row sm:items-center">
              {!done ? (
                <button
                  type="button"
                  onClick={() => {
                    markComplete(item.id);
                    trackEvent('select_content', {
                      content_type: 'cta',
                      item_id: `apprendre_complete_${item.id}`,
                    });
                  }}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
                >
                  <Check className="h-4 w-4" />
                  Marquer comme lu
                </button>
              ) : (
                <>
                  <div className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 border border-primary/25 bg-light/40 px-5 text-sm font-semibold text-primary">
                    <Check className="h-4 w-4" />
                    Terminé
                  </div>
                  <Link
                    to="/apprendre"
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
                  >
                    Autres sujets
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>

            <p className="mt-6 text-[11px] leading-relaxed text-slate-400">
              Information générale à titre éducatif — pas un conseil personnalisé.
            </p>
          </article>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl border-t border-prestige-beige pt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-heading text-2xl font-bold text-dark">Continuer à apprendre</h2>
              <Link
                to="/apprendre"
                className="hidden text-sm font-semibold text-primary hover:underline sm:inline"
              >
                Tous les sujets
              </Link>
            </div>
            <div className="grid gap-0 divide-y divide-prestige-beige border border-prestige-beige sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {related.map((f) => (
                <Link
                  key={f.id}
                  to={getApprendrePath(f.id)}
                  onClick={() =>
                    trackEvent('select_content', {
                      content_type: 'cta',
                      item_id: `apprendre_related_${f.id}`,
                    })
                  }
                  className="group bg-white p-5 transition-colors hover:bg-zinc-50"
                >
                  <p className="font-heading text-base font-semibold text-dark group-hover:text-primary">
                    {f.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {f.subtitle} · {f.readMinutes} min
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-5xl text-center">
          {relatedServices.length > 0 ? (
            <>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">
                Services liés
              </p>
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                {relatedServices.map((service) => (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    className="inline-flex min-h-[40px] items-center border border-prestige-beige px-4 py-2 text-sm text-dark transition-colors hover:border-dark"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <Link
            to="/rendez-vous"
            onClick={() =>
              trackEvent('select_content', {
                content_type: 'cta',
                item_id: `apprendre_${item.id}_rdv`,
              })
            }
            className="inline-flex min-h-[48px] items-center gap-2 bg-dark px-8 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Appliquer ça à votre situation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
