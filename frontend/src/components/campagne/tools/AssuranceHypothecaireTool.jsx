import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Building2, Check, ChevronDown, Home, Scale } from 'lucide-react';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolClimaxReveal, ToolSoftClose } from '../CampagneToolShell';
import {
  useCampagneWizard,
  WizardProgress,
  WizardBackButton,
  WizardChoiceList,
  WizardContinueButton,
  WizardStep,
  WizardStepHeading,
} from '../CampagneWizard';

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
    label: 'Qui est protÃ©gÃ© ?',
    banque: 'Souvent le prÃªteur (la banque) en premier',
    privee: 'Tes bÃ©nÃ©ficiaires â€” la famille / ton choix',
  },
  {
    id: 'couverture',
    label: 'Montant de couverture',
    banque: 'Suit en gÃ©nÃ©ral le solde qui baisse',
    privee: 'Capital choisi â€” peut rester stable',
  },
  {
    id: 'cout',
    label: 'CoÃ»t dans le temps',
    banque: 'Prime souvent stable pendant que la couverture diminue â†’ coÃ»t Â« par $ Â» qui monte',
    privee: 'Tarif fixÃ© Ã  la souscription (selon le produit) â€” plus prÃ©visible Ã  long terme',
  },
  {
    id: 'flexibilite',
    label: 'FlexibilitÃ©',
    banque: 'Souvent liÃ©e au prÃªt ; peut changer si tu refinances ou vends',
    privee: 'Portable : tu peux la garder aprÃ¨s lâ€™hypothÃ¨que',
  },
  {
    id: 'controle',
    label: 'ContrÃ´le',
    banque: 'Conditions du crÃ©ancier ; peu de levier pour la famille',
    privee: 'Tu choisis montant, durÃ©e, bÃ©nÃ©ficiaires',
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

function ResultCard({ label, value, detail, tone = 'default', size = 'md' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white'
      : tone === 'ok'
        ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white'
        : 'border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05]';
  const valueClass =
    size === 'lg'
      ? 'font-heading mt-1.5 text-3xl font-bold tabular-nums text-dark md:text-4xl'
      : 'font-heading mt-1.5 text-2xl font-bold tabular-nums text-dark';

  return (
    <div className={`rounded-2xl border px-4 py-3.5 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">{label}</p>
      <p className={valueClass}>{value}</p>
      {detail ? <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

/**
 * Banque/prÃªteur vs protection personnelle + estimateur capital famille.
 */
const HYPO_STEP_IDS = ['pret', 'famille', 'comparaison', 'result'];

export function AssuranceHypothecaireTool({ immersive = false } = {}) {
  const location = useLocation();
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_assurance-hypothecaire_pdf');
  const {
    stepIndex, currentStepId, isResult, questionCount, progress: wizardProgress,
    selectAndAdvance, advanceFrom, goBack,
  } = useCampagneWizard(HYPO_STEP_IDS, {
    onReachResult: () => trackEvent('select_content', { content_type: 'tool_result', item_id: 'campagne_hypotheque-assurance-vie_result' }),
  });
  const [solde, setSolde] = useState('350000');
  const [annees, setAnnees] = useState('20');
  const [primeMensuelle, setPrimeMensuelle] = useState('45');
  const [autresDettes, setAutresDettes] = useState('10000');
  const [remplacementMensuel, setRemplacementMensuel] = useState('3000');
  const [moisRemplacement, setMoisRemplacement] = useState('24');
  const [coussin, setCoussin] = useState('15000');
  const [checked, setChecked] = useState({});

  const rdvPath = buildCampagneRdvPath('hypotheque-assurance-vie', location.search);

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
    const gapShare =
      capitalFamille > 0 && auDelaDuPret > 0
        ? Math.min(100, (auDelaDuPret / capitalFamille) * 100)
        : 0;

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
      gapShare,
    };
  }, [solde, annees, primeMensuelle, autresDettes, remplacementMensuel, moisRemplacement, coussin]);

  const toggleRow = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePdf = () =>
    downloadPdf({
      title: 'Assurance hypothÃ©caire â€” banque vs famille',
      filename: 'resume-assurance-hypothecaire.pdf',
      sections: [
        {
          heading: 'Comparaison crÃ©ancier vs personnel',
          rows: [
            { label: 'Solde approximatif', value: formatCad(calc.balance) },
            { label: 'AnnÃ©es restantes', value: `${calc.years} ans` },
            {
              label: 'Prime mensuelle (si saisie)',
              value: calc.premium > 0 ? formatCad(calc.premium) : 'Non saisie',
            },
            {
              label: 'CoÃ»t relatif (illustration)',
              value:
                calc.ratio != null
                  ? `Environ Ã—${calc.ratio.toFixed(1)} Ã  mi-parcours`
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
            { label: 'Coussin imprÃ©vus', value: formatCad(calc.coussinN) },
            {
              label: 'Ã‰cart au-delÃ  du prÃªt',
              value: formatCad(calc.auDelaDuPret),
            },
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
        'Illustration Ã©ducative seulement â€” pas un amortissement exact ni un conseil personnalisÃ©.',
        'Le solde Ã  mi-parcours est une illustration (â‰ˆ moitiÃ©), pas un calendrier dâ€™amortissement exact.',
        'Lâ€™assurance crÃ©ancier et lâ€™assurance vie personnelle ne sont pas interchangeables automatiquement.',
        '* Selon le contrat et le prÃªteur. Conditions variables.',
      ],
    });


  /* immersive-wizard */
  if (immersive) {
    return (
      <div data-testid="tool-assurance-hypothecaire">
        <CampagneToolShell immersive titleAs="h1" eyebrow="HypothÃ¨que" title="Banque vs famille : chiffre lâ€™Ã©cart" intro="Une question Ã  la fois. Ã€ la fin, on compare les deux logiques en 15 minutes." disclaimer="Illustration Ã©ducative seulement." footer={null}>
          <WizardProgress stepIndex={stepIndex} questionCount={questionCount} isResult={isResult} resultLabel="Lâ€™Ã©cart" progress={wizardProgress} />
          {!isResult && stepIndex > 0 ? <WizardBackButton onClick={goBack} /> : null}
          {currentStepId === 'pret' ? (
            <WizardStep id="pret">
              <WizardStepHeading title="Ton prÃªt" hint="Solde, annÃ©es restantes, prime si tu lâ€™as." />
              <NumberField id="hypo-wiz-solde" label="Solde dâ€™hypothÃ¨que" value={solde} onChange={setSolde} min={0} step={1000} suffix="$" />
              <NumberField id="hypo-wiz-annees" label="AnnÃ©es restantes" value={annees} onChange={setAnnees} min={1} max={40} step={1} suffix="ans" />
              <NumberField id="hypo-wiz-prime" label="Prime mensuelle (optionnel)" value={primeMensuelle} onChange={setPrimeMensuelle} min={0} step={5} suffix="$" />
              <WizardContinueButton onClick={() => advanceFrom('pret')} />
            </WizardStep>
          ) : null}
          {currentStepId === 'famille' ? (
            <WizardStep id="famille">
              <WizardStepHeading title="Besoin famille au-delÃ  du solde" hint="Dettes, revenu de transition, coussin." />
              <NumberField id="hypo-wiz-dettes" label="Autres dettes" value={autresDettes} onChange={setAutresDettes} min={0} step={500} suffix="$" />
              <NumberField id="hypo-wiz-remp" label="Remplacement mensuel" value={remplacementMensuel} onChange={setRemplacementMensuel} min={0} step={100} suffix="$" />
              <NumberField id="hypo-wiz-mois" label="Pendant combien de mois" value={moisRemplacement} onChange={setMoisRemplacement} min={0} step={1} suffix="mois" />
              <NumberField id="hypo-wiz-coussin" label="Coussin imprÃ©vus" value={coussin} onChange={setCoussin} min={0} step={500} suffix="$" />
              <WizardContinueButton onClick={() => advanceFrom('famille')} />
            </WizardStep>
          ) : null}
          {currentStepId === 'comparaison' ? (
            <WizardStep id="comparaison">
              <WizardStepHeading title="Points de comparaison" hint="Coche ce qui te parle â€” optionnel." />
              <ul className="space-y-2">
                {COMPARISON_ROWS.map((row) => (
                  <li key={row.id}>
                    <button type="button" onClick={() => toggleRow(row.id)} className={`w-full rounded-2xl px-4 py-3 text-left text-sm ${checked[row.id] ? 'bg-primary/10' : 'bg-white shadow-[inset_0_0_0_1px_rgba(1,35,63,0.1)]'}`}>
                      <span className="font-semibold text-dark">{row.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <WizardContinueButton onClick={() => advanceFrom('comparaison')} label="Voir le rÃ©sultat" />
            </WizardStep>
          ) : null}
          {isResult ? (
            <WizardStep id="result">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Capital famille illustratif</p>
              <p className="font-heading mt-1 text-3xl font-bold text-dark">{formatCad(calc.capitalFamille)}</p>
              <p className="mt-2 text-sm text-prestige-taupe">Dont ~{formatCad(calc.auDelaDuPret)} au-delÃ  du seul solde.</p>
              <div className="mt-5">
                <ToolSoftClose
                  headline="Banque â‰  famille"
                  subline="15 min pour comparer crÃ©ancier vs protection personnelle â€” sans pression."
                  rdvPath={rdvPath}
                  rdvLabel="Comparer en 15 min"
                  onRdvClick={() => trackRendezVousClick('campagne_hypotheque-assurance-vie_rdv_outil')}
                  onPdf={handlePdf}
                  pdfBusy={busy}
                />
              </div>
            </WizardStep>
          ) : null}
        </CampagneToolShell>
      </div>
    );
  }

  return (
    <CampagneToolShell
      title="Banque vs famille : chiffre lâ€™Ã©cart, puis compare"
      intro="Lâ€™assurance du prÃªteur et une protection personnelle, ce nâ€™est pas le mÃªme produit. Estime dâ€™abord ce quâ€™il faudrait aux proches â€” au-delÃ  du seul solde. Ensuite, compare les deux logiques."
      disclaimer="Illustration Ã©ducative seulement â€” pas un amortissement exact ni un conseil personnalisÃ©. Lâ€™assurance crÃ©ancier et lâ€™assurance vie personnelle ne sont pas interchangeables automatiquement. * Selon le contrat et le prÃªteur."
    >
      <div className="space-y-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberField
            id="hypo-solde"
            label="Solde dâ€™hypothÃ¨que (approx.)"
            value={solde}
            onChange={setSolde}
            min={0}
            step={1000}
            suffix="$"
            hint="Sert aux deux parties de lâ€™outil"
          />
          <NumberField
            id="hypo-annees"
            label="AnnÃ©es restantes (approx.)"
            value={annees}
            onChange={setAnnees}
            min={1}
            max={40}
            step={1}
            suffix="ans"
          />
          <NumberField
            id="hypo-prime"
            label="Prime mensuelle (si tu lâ€™as)"
            value={primeMensuelle}
            onChange={setPrimeMensuelle}
            min={0}
            step={1}
            suffix="$"
            hint="Optionnel â€” illustration du coÃ»t relatif"
          />
        </div>

        {calc.hasInputs ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white px-4 py-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide">CÃ´tÃ© prÃªteur</p>
              </div>
              <p className="mt-2 font-heading text-lg font-bold text-dark">
                Couverture â‰ˆ {formatCad(calc.balance)} â†’ ~{formatCad(calc.balanceMid)}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">
                Vers lâ€™annÃ©e {calc.midYears}, si le solde a diminuÃ© dâ€™environ moitiÃ©, la couverture
                liÃ©e au prÃªt suit souvent le solde â€” alors que la prime peut rester semblable ou Ãªtre
                revue au renouvellement*.
              </p>
              {calc.ratio != null ? (
                <p className="mt-3 flex items-start gap-2 text-sm font-medium text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  CoÃ»t relatif â‰ˆ Ã—{calc.ratio.toFixed(1)} Ã  mi-parcours
                  {calc.costPer1kStart != null && calc.costPer1kMid != null
                    ? ` (${calc.costPer1kStart.toFixed(1)} â†’ ${calc.costPer1kMid.toFixed(1)} $/an pour 1 000 $)`
                    : ''}
                  .
                </p>
              ) : (
                <p className="mt-3 text-sm text-prestige-taupe">
                  Ajoute une prime mensuelle approximative pour voir le Â« prix Â» relatif monter.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white px-4 py-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <Home className="h-4 w-4 shrink-0" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide">CÃ´tÃ© personnel</p>
              </div>
              <p className="mt-2 font-heading text-lg font-bold text-dark">
                Capital pour la famille
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">
                BÃ©nÃ©ficiaires choisis, montant et durÃ©e que tu contrÃ´les, souvent portable aprÃ¨s le
                prÃªt â€” dâ€™oÃ¹ la flexibilitÃ© Ã  long terme.
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm font-medium text-emerald-900">
                <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                Banque = prÃªt. Personnel = famille + options dans le temps.
              </p>
            </div>
          </div>
        ) : null}

        <div>
          <h3 className="font-heading mb-1 text-base font-semibold text-dark">
            Combien pour la famille ? (au-delÃ  du solde)
          </h3>
          <p className="mb-4 text-sm text-prestige-taupe">
            MÃªme solde â€” on ajoute dettes, revenu de transition et imprÃ©vus pour illustrer un
            montant pensÃ© pour les proches, pas seulement pour le prÃªt.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              id="hypo-dettes"
              label="Autres dettes Ã  rÃ©gler"
              value={autresDettes}
              onChange={setAutresDettes}
              min={0}
              step={500}
              suffix="$"
              hint="Auto, cartes, margeâ€¦"
            />
            <NumberField
              id="hypo-coussin"
              label="Coussin imprÃ©vus"
              value={coussin}
              onChange={setCoussin}
              min={0}
              step={500}
              suffix="$"
            />
            <NumberField
              id="hypo-revenu"
              label="Revenu mensuel Ã  remplacer"
              value={remplacementMensuel}
              onChange={setRemplacementMensuel}
              min={0}
              step={100}
              suffix="$"
            />
            <Field id="hypo-mois" label="Pendant combien de mois" hint="Souvent 12 Ã  36 mois">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2" role="group" aria-label="DurÃ©e suggÃ©rÃ©e">
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
              detail="Logique proche de lâ€™assurance crÃ©ancier : surtout le prÃªt."
            />
            <ResultCard
              label="Montant illustratif pour la famille"
              value={formatCad(calc.capitalFamille)}
              detail="Maison + dettes + revenu + imprÃ©vus â€” illustration seulement."
              tone={calc.auDelaDuPret > 0 ? 'warn' : 'ok'}
              size="lg"
            />
          </div>

          {calc.auDelaDuPret > 0 ? (
            <ToolClimaxReveal
              key={calc.auDelaDuPret}
              className="mt-4"
            >
              <div
                className="space-y-3 rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 px-4 py-5 md:px-6"
                data-testid="hypotheque-gap-banner"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/90">
                  Ã‰cart illustratif au-delÃ  du prÃªt
                </p>
                <p className="font-heading text-3xl font-bold tabular-nums text-dark md:text-4xl lg:text-5xl">
                  +{formatCad(calc.auDelaDuPret)}
                </p>
                <p className="text-sm leading-relaxed text-prestige-taupe">
                  Câ€™est souvent Ã§a quâ€™on clarifie en 15 minutes â€” sans pression.
                </p>
                <div
                  className="h-3 overflow-hidden rounded-full bg-amber-100/90"
                  role="presentation"
                  aria-hidden
                >
                  <div
                    key={calc.auDelaDuPret}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-[width] duration-700 ease-out"
                    style={{ width: `${calc.gapShare}%` }}
                  />
                </div>
              </div>
            </ToolClimaxReveal>
          ) : null}

          <div className="mt-4">
            <ToolSoftClose
              headline={`Ton illustration : ${formatCad(calc.balance)} vs ${formatCad(calc.capitalFamille)}`}
              subline="On clarifie banque vs perso en 15 min."
              rdvPath={rdvPath}
              rdvLabel="Clarifier banque vs famille (15 min)"
              onRdvClick={() =>
                trackRendezVousClick('campagne_hypotheque-assurance-vie_rdv_outil')
              }
              onPdf={handlePdf}
              pdfBusy={busy}
              pdfLabel="TÃ©lÃ©charger mon rÃ©sumÃ© PDF"
              tone={calc.auDelaDuPret > 0 ? 'warn' : 'default'}
            />
          </div>
        </div>

        <details className="group overflow-hidden rounded-2xl border border-prestige-beige bg-white open:shadow-[0_8px_24px_rgba(1,35,63,0.04)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 items-center gap-2">
              <Scale className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="font-heading text-sm font-semibold text-dark md:text-base">
                Approfondir : banque vs protection personnelle
              </span>
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-prestige-taupe transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-prestige-beige/80">
            <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-0 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-prestige-taupe sm:grid">
              <div className="px-3 py-2.5">CritÃ¨re</div>
              <div className="px-3 py-2.5">PrÃªteur / banque</div>
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
        </details>

        <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-prestige-taupe">
          Les contrats dâ€™assurance crÃ©ancier et dâ€™assurance vie personnelle varient. Le solde Ã 
          mi-parcours est une illustration (â‰ˆ moitiÃ©), pas un calendrier dâ€™amortissement exact.
          Cette page ne remplace pas la lecture de ta police ni un conseil personnalisÃ©. Produits
          dâ€™assurance de iA Groupe financier le cas Ã©chÃ©ant â€” analyse au cas par cas.
        </p>
      </div>
    </CampagneToolShell>
  );
}
