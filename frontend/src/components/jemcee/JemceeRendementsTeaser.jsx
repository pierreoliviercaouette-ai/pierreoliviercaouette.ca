import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BANQUE_5Y_BY_PROFIL,
  PROFIL_RISQUE_LABELS,
  formatPctFr,
} from '../../data/comparateurRendementsRates';
import { DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../../data/modelPortfolios';
import { useModelPortfolioReturns } from '../../hooks/useModelPortfolioReturns';

/** Palette sombre rallye (jemcee), distincte du bleu corporate des outils clairs. */
const COLORS = {
  ia: '#73c4ef',
  banque: 'rgba(255,255,255,0.28)',
  grid: 'rgba(255,255,255,0.08)',
  tick: 'rgba(255,255,255,0.55)',
  tooltipBg: '#01233f',
  tooltipBorder: 'rgba(115,196,239,0.35)',
};

const PROFILS = Object.keys(PROFIL_RISQUE_LABELS);

/**
 * Aperçu rendements 5 ans net (banque illustrative vs modèle iA), stylé pour la landing jemcee.
 */
export function JemceeRendementsTeaser({ onCta }) {
  const [profil, setProfil] = useState('equilibre');
  const { asOfLabel, returnsByProfil, getIaPct } = useModelPortfolioReturns();
  const dateLabel = asOfLabel || DEFAULT_MODEL_PORTFOLIOS_AS_OF;

  const chartData = useMemo(
    () =>
      PROFILS.map((key) => ({
        name: PROFIL_RISQUE_LABELS[key],
        banque: BANQUE_5Y_BY_PROFIL[key],
        ia: returnsByProfil[key],
        active: key === profil,
      })),
    [profil, returnsByProfil]
  );

  const iaPct = getIaPct(profil);
  const banquePct = BANQUE_5Y_BY_PROFIL[profil];
  const ecart = Math.round((iaPct - banquePct) * 10) / 10;

  return (
    <section
      id="rendements"
      className="relative scroll-mt-24 border-t border-white/10 px-6 py-20 md:py-28"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,77,217,0.22) 0%, transparent 55%), #011428',
      }}
      data-testid="jemcee-rendements"
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-heading text-sm tracking-[0.45em] text-secondary">RENDEMENTS</p>
        <h2 className="mt-4 max-w-2xl font-heading text-4xl leading-[0.95] text-white md:text-5xl">
          Banque vs modèles iA
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/70">
          Rendements nets annualisés sur 5 ans (au {dateLabel}), à profil égal.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Profil de risque">
          {PROFILS.map((key) => {
            const active = key === profil;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setProfil(key)}
                className="font-heading text-xs tracking-widest px-4 py-2.5 transition-colors border"
                style={{
                  borderColor: active ? 'rgba(115,196,239,0.85)' : 'rgba(255,255,255,0.2)',
                  backgroundColor: active ? 'rgba(115,196,239,0.15)' : 'transparent',
                  color: active ? '#73c4ef' : 'rgba(255,255,255,0.65)',
                }}
              >
                {PROFIL_RISQUE_LABELS[key].toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: COLORS.tick }}
                  axisLine={{ stroke: COLORS.grid }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: COLORS.tick }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v} %`}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  formatter={(value, name) => [`${formatPctFr(value)} %`, name]}
                  contentStyle={{
                    background: COLORS.tooltipBg,
                    border: `1px solid ${COLORS.tooltipBorder}`,
                    borderRadius: 0,
                    fontSize: 12,
                    color: '#fff',
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Bar
                  dataKey="banque"
                  name="Banque (illustratif)"
                  fill={COLORS.banque}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="ia"
                  name="Modèle iA"
                  fill={COLORS.ia}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-white/15 bg-white/[0.04] px-6 py-6 backdrop-blur-sm">
            <p className="text-xs tracking-widest text-white/45 uppercase">
              Profil {PROFIL_RISQUE_LABELS[profil]}
            </p>
            <p className="mt-3 font-heading text-4xl text-secondary">
              {formatPctFr(iaPct)}&nbsp;%
            </p>
            <p className="mt-1 text-sm text-white/60">Modèle iA · 5 ans net</p>
            <p className="mt-5 text-sm text-white/70">
              vs banques ~{formatPctFr(banquePct)}&nbsp;%
              <span className="ml-2 font-heading text-secondary">
                {ecart >= 0 ? '+' : ''}
                {formatPctFr(ecart)} pts
              </span>
            </p>
            <Link
              to="/outils/comparateur-rendements"
              onClick={() => onCta?.('jemcee_rendements_details')}
              className="mt-6 inline-flex items-center border border-white/40 px-5 py-3 font-heading text-sm tracking-widest text-white transition-colors hover:border-secondary hover:text-secondary"
            >
              LIRE LES DÉTAILS
            </Link>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-white/35">
          Illustration · fonds distincts, série Classique 75/75 · passés ≠ futurs · pas un conseil
          personnalisé.{' '}
          <Link
            to="/outils/comparateur-rendements"
            onClick={() => onCta?.('jemcee_rendements_details_footnote')}
            className="text-white/50 underline underline-offset-2 transition-colors hover:text-secondary"
          >
            Lire les détails
          </Link>
        </p>
      </div>
    </section>
  );
}
