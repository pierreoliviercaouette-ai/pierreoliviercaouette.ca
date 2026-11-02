import { useMemo, useState } from 'react';
import { AlertTriangle, Building2, Check, Home, Scale } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

const MOIS_PRESETS = [
  { value: '12', label: '12 mois' },
  { value: '24', label: '24 mois' },
  { value: '36', label: '36 mois' },
];

const COMPARISON_ROWS = [
  {
    id: 'beneficiaire',
    label: 'Qui est protégé ?',
    banque: 'Souvent le prêteur (la banque) en premier',
    privee: 'Tes bénéficiaires — la famille / ton choix',
  },
  {
    id: 'couverture',
    label: 'Montant de couverture',
    banque: 'Suit en général le solde qui baisse',
    privee: 'Capital choisi — peut rester stable',
  },
  {
    id: 'cout',
    label: 'Coût dans le temps',
    banque: 'Prime souvent stable pendant que la couverture diminue → coût « par $ » qui monte',
    privee: 'Tarif fixé à la souscription (selon le produit) — plus prévisible à long terme',
  },
  {
    id: 'flexibilite',
    label: 'Flexibilité',
    banque: 'Souvent liée au prêt ; peut changer si tu refinances ou vends',
    privee: 'Portable : tu peux la garder après l’hypothèque',
  },
  {
    id: 'controle',
    label: 'Contrôle',
    banque: 'Conditions du créancier ; peu de levier pour la famille',
    privee: 'Tu choisis montant, durée, bénéficiaires',
  },
];

function toNum(value) {
  const n = Number(String(value).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function Field({ id, label, hint, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">{hint}</p> : null}
    </div>
  );
}

function NumberField({ id, label, value, onChange, min, max, step, suffix, hint }) {
  return (
    <Field id={id} label={label} hint={hint}>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          className={`${inputClass} ${suffix ? 'pr-10' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
            {suffix}
          </span>
        ) : null}
      </div>
    </Field>
  );
}

function ResultCard({ label, value, detail, tone = 'default' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white'
      : tone === 'ok'
        ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white'
        : 'border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05]';

  return (
    <div className={`rounded-2xl border px-4 py-3.5 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">{label}</p>
      <p className="font-heading mt-1.5 text-2xl font-bold tabular-nums text-dark">{value}</p>
      {detail ? <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

/**
 * Banque/prêteur vs protection personnelle + estimateur capital famille.
 */
export function AssuranceHypothecaireTool() {
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_assurance-hypothecaire_pdf');
  const [solde, setSolde] = useState('350000');
  const [annees, setAnnees] = useState('20');
  const [primeMensuelle, setPrimeMensuelle] = useState('45');
  const [autresDettes, setAutresDettes] = useState('10000');
  const [remplacementMensuel, setRemplacementMensuel] = useState('3000');
  const [moisRemplacement, setMoisRemplacement] = useState('24');
  const [coussin, setCoussin] = useState('15000');
  const [checked, setChecked] = useState({});

  const calc = useMemo(() => {
    const balance = toNum(solde);
    const years = Math.min(40, Math.max(1, Math.round(toNum(annees) || 20)));
    const premium = toNum(primeMensuelle);
    const midYears = Math.max(1, Math.round(years / 2));
    const balanceMid = Math.round(balance * 0.5);
    const costPer1kStart = balance > 0 && premium > 0 ? (premium * 12 * 1000) / balance : null;
    const costPer1kMid =
      balanceMid > 0 && premium > 0 ? (premium * 12 * 1000) / balanceMid : null;
    const ratio =
      costPer1kStart && costPer1kMid && costPer1kStart > 0
        ? costPer1kMid / costPer1kStart
        : null;

    const dettesN = toNum(autresDettes);
    const rempN = toNum(remplacementMensuel);
    const moisN = toNum(moisRemplacement);
    const coussinN = toNum(coussin);
    const remplacementTotal = rempN * moisN;
    const auDelaDuPret = dettesN + remplacementTotal + coussinN;
    const capitalFamille = balance + auDelaDuPret;

    return {
      balance,
      years,
      midYears,
      premium,
      balanceMid,
      costPer1kStart,
      costPer1kMid,
      ratio,
      hasInputs: balance > 0,
      dettesN,
      rempN,
      moisN,
      coussinN,
      remplacementTotal,
      auDelaDuPret,
      capitalFamille,
    };
  }, [solde, annees, primeMensuelle, autresDettes, remplacementMensuel, moisRemplacement, coussin]);

  const toggleRow = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = COMPARISON_ROWS.filter((r) => checked[r.id]).length;

  const handlePdf = () =>
    downloadPdf({
      title: 'Assurance hypothecaire — banque vs famille',
      filename: 'resume-assurance-hypothecaire.pdf',
      sections: [
        {
          heading: 'Comparaison creancier vs personnel',
          rows: [
            { label: 'Solde approximatif', value: formatCad(calc.balance) },
            { label: 'Annees restantes', value: `${calc.years} ans` },
            {
              label: 'Prime mensuelle (si saisie)',
              value: calc.premium > 0 ? formatCad(calc.premium) : 'Non saisie',
            },
            {
              label: 'Cout relatif (illustration)',
              value:
                calc.ratio != null
                  ? `Environ x${calc.ratio.toFixed(1)} a mi-parcours`
                  : 'Ajoute une prime pour illustrer',
            },
          ],
        },
        {
          heading: 'Estimateur capital famille',
          rows: [
            { label: 'Si on couvre seulement le solde', value: formatCad(calc.balance) },
            { label: 'Autres dettes', value: formatCad(calc.dettesN) },
            {
              label: 'Revenu de transition',
              value: `${formatCad(calc.remplacementTotal)} (${calc.moisN} mois)`,
            },
            { label: 'Coussin imprevus', value: formatCad(calc.coussinN) },
            {
              label: 'Montant illustratif pour la famille',
              value: formatCad(calc.capitalFamille),
            },
          ],
        },
        {
          heading: 'Points de comparaison',
          rows: COMPARISON_ROWS.map((row) => ({
            label: row.label,
            value: `Banque: ${row.banque} | Personnel: ${row.privee}`,
          })),
        },
      ],
      notes: [
        'Illustration educative seulement — pas un amortissement exact ni un conseil personnalise.',
        'L’assurance creancier et l’assurance vie personnelle ne sont pas interchangeables automatiquement.',
      ],
    });

  return (
    <CampagneToolShell
      title="Banque vs famille : compare, puis chiffre"
      intro="L’assurance du prêteur et une protection personnelle, ce n’est pas le même produit. Compare les logiques, vois le coût relatif qui monte pendant que la couverture baisse — puis estime ce qu’il faudrait vraiment aux proches."
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-prestige-taupe">
            {checkedCount > 0
              ? `${checkedCount}/${COMPARISON_ROWS.length} points lus · capital illustratif ${formatCad(calc.capitalFamille)}`
              : 'Compare d’abord, puis ajuste les chiffres pour la famille'}
          </p>
          <ToolDownloadPdf onClick={handlePdf} busy={busy} />
        </div>
      }
    >
      <div className="space-y-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberField
            id="hypo-solde"
            label="Solde d’hypothèque (approx.)"
            value={solde}
            onChange={setSolde}
            min={0}
            step={1000}
            suffix="$"
            hint="Sert aux deux parties de l’outil"
          />
          <NumberField
            id="hypo-annees"
            label="Années restantes (approx.)"
            value={annees}
            onChange={setAnnees}
            min={1}
            max={40}
            step={1}
            suffix="ans"
          />
          <NumberField
            id="hypo-prime"
            label="Prime mensuelle (si tu l’as)"
            value={primeMensuelle}
            onChange={setPrimeMensuelle}
            min={0}
            step={1}
            suffix="$"
            hint="Optionnel — illustration du coût relatif"
          />
        </div>

        {calc.hasInputs ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white px-4 py-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide">Côté prêteur</p>
              </div>
              <p className="mt-2 font-heading text-lg font-bold text-dark">
                Couverture ≈ {formatCad(calc.balance)} → ~{formatCad(calc.balanceMid)}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">
                Vers l’année {calc.midYears}, si le solde a diminué d’environ moitié, la couverture
                liée au prêt suit souvent le solde — alors que la prime peut rester semblable.
              </p>
              {calc.ratio != null ? (
                <p className="mt-3 flex items-start gap-2 text-sm font-medium text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  Coût relatif ≈ ×{calc.ratio.toFixed(1)} à mi-parcours
                  {calc.costPer1kStart != null && calc.costPer1kMid != null
                    ? ` (${calc.costPer1kStart.toFixed(1)} → ${calc.costPer1kMid.toFixed(1)} $/an pour 1 000 $)`
                    : ''}
                  .
                </p>
              ) : (
                <p className="mt-3 text-sm text-prestige-taupe">
                  Ajoute une prime mensuelle approximative pour voir le « prix » relatif monter.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white px-4 py-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <Home className="h-4 w-4 shrink-0" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide">Côté personnel</p>
              </div>
              <p className="mt-2 font-heading text-lg font-bold text-dark">
                Capital pour la famille
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">
                Bénéficiaires choisis, montant et durée que tu contrôles, souvent portable après le
                prêt — d’où la flexibilité à long terme.
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm font-medium text-emerald-900">
                <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                Banque = prêt. Personnel = famille + options dans le temps.
              </p>
            </div>
          </div>
        ) : null}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" aria-hidden />
            <h3 className="font-heading text-base font-semibold text-dark">
              1. Tableau comparatif (éducatif)
            </h3>
          </div>
          <div className="overflow-hidden rounded-2xl border border-prestige-beige">
            <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-0 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-prestige-taupe sm:grid">
              <div className="px-3 py-2.5">Critère</div>
              <div className="px-3 py-2.5">Prêteur / banque</div>
              <div className="px-3 py-2.5">Protection personnelle</div>
              <div className="px-3 py-2.5">Lu</div>
            </div>
            <ul className="divide-y divide-prestige-beige/80">
              {COMPARISON_ROWS.map((row) => {
                const on = Boolean(checked[row.id]);
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => toggleRow(row.id)}
                      className={`grid w-full grid-cols-1 gap-2 px-3 py-3.5 text-left transition sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-start sm:gap-0 ${
                        on ? 'bg-primary/[0.04]' : 'bg-white hover:bg-gray-50/80'
                      }`}
                      aria-pressed={on}
                    >
                      <p className="text-sm font-semibold text-dark sm:pr-2">{row.label}</p>
                      <p className="text-sm leading-relaxed text-prestige-taupe sm:px-2">
                        <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-amber-700/90 sm:hidden">
                          Banque
                        </span>
                        {row.banque}
                      </p>
                      <p className="text-sm leading-relaxed text-prestige-taupe sm:px-2">
                        <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-emerald-700/90 sm:hidden">
                          Personnel
                        </span>
                        {row.privee}
                      </p>
                      <span
                        className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full sm:mt-0 sm:justify-self-center ${
                          on
                            ? 'bg-primary text-white'
                            : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
                        }`}
                        aria-hidden
                      >
                        {on ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-heading mb-1 text-base font-semibold text-dark">
            2. Combien pour la famille ? (au-delà du solde)
          </h3>
          <p className="mb-4 text-sm text-prestige-taupe">
            Même solde — on ajoute dettes, revenu de transition et imprévus pour illustrer un
            montant pensé pour les proches, pas seulement pour le prêt.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              id="hypo-dettes"
              label="Autres dettes à régler"
              value={autresDettes}
              onChange={setAutresDettes}
              min={0}
              step={500}
              suffix="$"
              hint="Auto, cartes, marge…"
            />
            <NumberField
              id="hypo-coussin"
              label="Coussin imprévus"
              value={coussin}
              onChange={setCoussin}
              min={0}
              step={500}
              suffix="$"
            />
            <NumberField
              id="hypo-revenu"
              label="Revenu mensuel à remplacer"
              value={remplacementMensuel}
              onChange={setRemplacementMensuel}
              min={0}
              step={100}
              suffix="$"
            />
            <Field id="hypo-mois" label="Pendant combien de mois" hint="Souvent 12 à 36 mois">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Durée suggérée">
                  {MOIS_PRESETS.map((opt) => {
                    const active = moisRemplacement === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMoisRemplacement(opt.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? 'bg-primary text-white'
                            : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)] hover:text-dark'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <div className="relative">
                  <input
                    id="hypo-mois"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={120}
                    step={1}
                    value={moisRemplacement}
                    onChange={(e) => setMoisRemplacement(e.target.value)}
                    className={`${inputClass} pr-14`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                    mois
                  </span>
                </div>
              </div>
            </Field>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="Si on couvre seulement le solde"
              value={formatCad(calc.balance)}
              detail="Logique proche de l’assurance créancier : surtout le prêt."
            />
            <ResultCard
              label="Montant illustratif pour la famille"
              value={formatCad(calc.capitalFamille)}
              detail={
                calc.auDelaDuPret > 0
                  ? `Dont ${formatCad(calc.auDelaDuPret)} au-delà du prêt (dettes, revenu, imprévus).`
                  : 'Maison + dettes + revenu + imprévus — illustration seulement.'
              }
              tone={calc.auDelaDuPret > 0 ? 'warn' : 'ok'}
            />
          </div>
        </div>

        <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-prestige-taupe">
          Les contrats d’assurance créancier et d’assurance vie personnelle varient. Cette page ne
          remplace pas la lecture de ta police ni un conseil personnalisé. Produits d’assurance de
          iA Groupe financier le cas échéant — analyse au cas par cas.
        </p>
      </div>
    </CampagneToolShell>
  );
}
