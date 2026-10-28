import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock } from 'lucide-react';
import { useAudienceMode } from '../../context/AudienceModeContext';
import { getApprendrePath, getFormationsForAudience } from '../../data/formations';
import { useFormationProgress } from '../../hooks/useFormationProgress';
import { trackEvent } from '../../lib/analytics';

export function FormationsTeaser({ variant = 'light' }) {
  const { audience, isPrive } = useAudienceMode();
  const all = getFormationsForAudience(audience);
  const { isComplete } = useFormationProgress();
  const dark = variant === 'dark';

  const items = (
    isPrive
      ? [...all.filter((f) => f.category === 'corpo'), ...all.filter((f) => f.category !== 'corpo')]
      : all
  ).slice(0, 4);

  if (!items.length) return null;

  return (
    <section
      className={`section-padding ${dark ? 'bg-[#111111] text-white' : 'bg-white'}`}
      data-testid="apprendre-teaser"
    >
      <div className="container-max">
        <div
          className={`mb-10 flex flex-col gap-4 border-b pb-8 md:flex-row md:items-end md:justify-between ${
            dark ? 'border-white/12' : 'border-prestige-beige'
          }`}
        >
          <div className="max-w-2xl">
            <p
              className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                dark ? 'text-white/45' : 'text-prestige-taupe'
              }`}
            >
              Apprendre
            </p>
            <h2
              className={`font-heading text-3xl font-bold md:text-4xl ${
                dark ? 'text-white' : 'text-dark'
              }`}
            >
              {isPrive ? 'Capsules pour affûter vos décisions' : 'Un sujet à la fois, clairement'}
            </h2>
            <p
              className={`mt-3 max-w-xl text-sm leading-relaxed md:text-base ${
                dark ? 'text-white/55' : 'text-slate-600'
              }`}
            >
              Mini-formations avec schémas simples — pour voir le parcours de l’argent d’un coup d’œil.
            </p>
          </div>
          <Link
            to="/apprendre"
            onClick={() =>
              trackEvent('select_content', { content_type: 'cta', item_id: 'apprendre_teaser_all' })
            }
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 text-sm font-semibold ${
              dark ? 'text-white hover:underline' : 'text-primary hover:underline'
            }`}
          >
            Voir tous les sujets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul
          className={`divide-y border-y ${
            dark ? 'divide-white/10 border-white/10' : 'divide-prestige-beige border-prestige-beige'
          }`}
        >
          {items.map((item) => {
            const done = isComplete(item.id);
            return (
              <li key={item.id}>
                <Link
                  to={getApprendrePath(item.id)}
                  onClick={() =>
                    trackEvent('select_content', {
                      content_type: 'cta',
                      item_id: `apprendre_teaser_${item.id}`,
                    })
                  }
                  className={`group flex items-center justify-between gap-4 py-4 transition-opacity hover:opacity-80 md:py-5 ${
                    dark ? 'text-white' : 'text-dark'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-semibold">{item.title}</p>
                    <p className={`mt-0.5 text-sm ${dark ? 'text-white/45' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </p>
                  </div>
                  <div
                    className={`flex shrink-0 items-center gap-3 text-xs ${
                      dark ? 'text-white/40' : 'text-slate-500'
                    }`}
                  >
                    {done ? (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <Check className="h-3.5 w-3.5" />
                        Lu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {item.readMinutes} min
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
