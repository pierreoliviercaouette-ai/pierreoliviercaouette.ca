import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Clock } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { useAudienceMode } from '../context/AudienceModeContext';
import {
  FORMATION_CATEGORIES,
  getApprendrePath,
  getFormationsByCategory,
  getFormationsForAudience,
} from '../data/formations';
import { useFormationProgress } from '../hooks/useFormationProgress';
import { trackEvent, trackRendezVousClick } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

export function Apprendre() {
  const { audience, isPrive } = useAudienceMode();
  const grouped = getFormationsByCategory(audience);
  const all = getFormationsForAudience(audience);
  const { isComplete } = useFormationProgress();
  const total = all.length;
  const doneCount = all.filter((f) => isComplete(f.id)).length;
  const progressPct = total ? Math.round((doneCount / total) * 100) : 0;

  useSeoMeta({
    title: isPrive
      ? 'Apprendre | Stratégies patrimoniales et corporatives'
      : 'Apprendre | Épargne et protections — capsules courtes',
    description: isPrive
      ? 'Sujets courts pour comprendre assurances, fiscalité et stratégies d’entreprise — à votre rythme.'
      : 'Sujets courts pour comprendre le CELI, le REER et les assurances — éducation claire, sans jargon.',
    canonicalPath: '/apprendre',
  });

  return (
    <main data-testid="apprendre-page">
      <PageHero
        badge="Apprendre"
        title="Comprendre, un sujet à la fois"
        description={
          isPrive
            ? `${total} capsules sur les assurances, la fiscalité et les stratégies d’entreprise.`
            : `${total} capsules sur l’épargne et les protections — pour mieux décider.`
        }
        minHeightClass="min-h-[36vh] md:min-h-[42vh]"
      >
        <Link
          to="/rendez-vous"
          onClick={() => trackRendezVousClick('apprendre_hero_rdv')}
          className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-dark shadow-xl ring-2 ring-white/40 transition-all hover:scale-[1.02] hover:bg-secondary hover:text-white"
        >
          En parler avec moi
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </PageHero>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          {total > 0 ? (
            <div className="mb-12 flex flex-col gap-3 border-b border-prestige-beige pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-prestige-taupe">
                  Votre progression
                </p>
                <p className="mt-1 font-heading text-2xl font-semibold text-dark">
                  {doneCount}
                  <span className="text-slate-400"> / {total}</span>
                  <span className="ml-2 text-base font-normal text-slate-500">sujets lus</span>
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="mb-1.5 flex justify-between text-[11px] text-slate-500">
                  <span>Avancement</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="h-1 overflow-hidden bg-zinc-100">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-slate-600">Aucun sujet disponible pour le moment.</p>
          ) : (
            <div className="space-y-14">
              {Object.values(grouped).map((group) => {
                const CatIcon = FORMATION_CATEGORIES[group.id]?.icon || BookOpen;
                return (
                  <div key={group.id}>
                    <div className="mb-6 flex items-baseline gap-3 border-b border-prestige-beige pb-3">
                      <CatIcon className="relative top-0.5 h-4 w-4 text-primary" aria-hidden />
                      <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.16em] text-dark">
                        {group.label}
                      </h2>
                      <span className="text-xs text-slate-400">{group.items.length}</span>
                    </div>

                    <ul className="space-y-4">
                      {group.items.map((item) => {
                        const done = isComplete(item.id);
                        return (
                          <li key={item.id}>
                            <Link
                              to={getApprendrePath(item.id)}
                              onClick={() =>
                                trackEvent('select_content', {
                                  content_type: 'cta',
                                  item_id: `apprendre_card_${item.id}`,
                                })
                              }
                              className="group flex flex-col gap-3 border border-prestige-beige bg-white px-5 py-5 transition-colors hover:border-dark md:flex-row md:items-center md:justify-between md:gap-6 md:px-6"
                              data-testid={`apprendre-card-${item.id}`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <h3 className="font-heading text-xl font-semibold text-dark transition-colors group-hover:text-primary">
                                    {item.title}
                                  </h3>
                                  {done ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                                      <Check className="h-3 w-3" />
                                      Lu
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1 text-sm text-prestige-taupe">{item.subtitle}</p>
                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 line-clamp-2">
                                  {item.shortDescription}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center justify-between gap-4 md:flex-col md:items-end md:gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                  <Clock className="h-3.5 w-3.5" />
                                  {item.readMinutes} min
                                </span>
                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-dark">
                                  {done ? 'Relire' : 'Lire'}
                                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 border-t border-prestige-beige pt-10 text-center">
            <p className="font-heading text-2xl font-semibold text-dark">D’autres sujets arrivent</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              Une bibliothèque qui s’enrichit. Un thème précis en tête? Écrivez-moi.
            </p>
            <Link
              to="/contact"
              onClick={() =>
                trackEvent('select_content', {
                  content_type: 'cta',
                  item_id: 'apprendre_suggest_topic',
                })
              }
              className="mt-6 inline-flex min-h-[44px] items-center justify-center border border-dark px-7 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-dark hover:text-white"
            >
              Suggérer un sujet
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
