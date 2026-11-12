import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import {
  CampagneToolShell,
  ToolClimaxReveal,
  ToolDownloadPdf,
  ToolSoftClose,
} from '../CampagneToolShell';
import {
  useCampagneWizard,
  WizardProgress,
  WizardBackButton,
  WizardChoiceList,
  WizardContinueButton,
  WizardStep,
  WizardStepHeading,
} from '../CampagneWizard';

function toNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function clampScore(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

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

function NumberField({ id, label, value, onChange, min, max, step, suffix, hint, suffixWidth = 'pr-8' }) {
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
          className={`${inputClass} ${suffix ? suffixWidth : ''}`}
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

function YesNo({ id, label, value, onChange, hint }) {
  return (
    <div>
      <p id={id} className={labelClass}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
        {[
          { v: 'non', label: 'Non' },
          { v: 'oui', label: 'Oui' },
        ].map((opt) => {
          const active = value === opt.v;
          return (
            <button
              key={opt.v}
              type="button"
              onClick={() => onChange(opt.v)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-primary text-white'
                  : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)] hover:text-dark'
              }`}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">{hint}</p> : null}
    </div>
  );
}

function Block({ step, title, subtitle, children, done }) {
  return (
    <div className="relative pl-11">
      <div
        className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
          done
            ? 'bg-primary text-white'
            : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
        }`}
        aria-hidden
      >
        {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step}
      </div>
      <div className="mb-3">
        <h3 className="font-heading text-base font-semibold text-dark">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-sm text-prestige-taupe">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function BreakdownRow({ label, value, muted, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className={strong ? 'font-medium text-dark' : muted ? 'text-prestige-taupe' : 'text-dark'}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          strong ? 'font-semibold text-dark' : muted ? 'font-medium text-prestige-taupe' : 'font-medium text-dark'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function BreakdownGroup({ title, children }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">{title}</p>
      {children}
    </div>
  );
}

/**
 * Score illustratif â€” besoin actuel ET besoins futurs dÃ©jÃ  connus
 * (hypothÃ¨que prÃ©vue, famille prÃ©vue), pas seulement Â« aujourdâ€™hui Â».
 */
const TROP_JEUNE_STEP_IDS = ['present', 'projets', 'result'];

export function TropJeuneTool({ immersive = false } = {}) {
  const location = useLocation();
  const [age, setAge] = useState('28');
  const [soldeMaison, setSoldeMaison] = useState('0');
  const [enfants, setEnfants] = useState('0');
  const [conjointDepend, setConjointDepend] = useState('non');
  const [autresDettes, setAutresDettes] = useState('5000');
  const [revenuMensuel, setRevenuMensuel] = useState('4200');
  // Anti-spoiler : futur en non au load (score ~dettes, pas 455 k$)
  const [projetHypotheque, setProjetHypotheque] = useState('non');
  const [anneesHypotheque, setAnneesHypotheque] = useState('3');
  const [montantHypothequePrevue, setMontantHypothequePrevue] = useState('350000');
  const [projetFamille, setProjetFamille] = useState('non');
  const [anneesFamille, setAnneesFamille] = useState('5');
  const futurToggleTracked = useRef(false);
  const dualRevealTracked = useRef(false);
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_trop-jeune-assurance_pdf');
  const {
    stepIndex, currentStepId, isResult, questionCount, progress: wizardProgress,
    selectAndAdvance, advanceFrom, goBack,
  } = useCampagneWizard(TROP_JEUNE_STEP_IDS, {
    onReachResult: () => trackEvent('select_content', { content_type: 'tool_result', item_id: 'campagne_trop-jeune-assurance_result' }),
  });
  const rdvPath = buildCampagneRdvPath('trop-jeune-assurance', location.search);

  const maisonActuelle = toNum(soldeMaison);
  const nbEnfants = Math.floor(toNum(enfants));
  const dettes = toNum(autresDettes);
  const revenu = toNum(revenuMensuel);
  const conjointOui = conjointDepend === 'oui';
  const ageN = toNum(age);

  const hypoFutureOui = projetHypotheque === 'oui';
  const familleFutureOui = projetFamille === 'oui';
  const anneesHypo = toNum(anneesHypotheque);
  const montantHypoPrevue = toNum(montantHypothequePrevue);
  const anneesFam = toNum(anneesFamille);

  // Besoin actuel
  const ptsMaison = Math.min(25, (maisonActuelle / 400000) * 25);
  const ptsEnfants = nbEnfants <= 0 ? 0 : Math.min(20, 12 + (nbEnfants - 1) * 8);
  const ptsConjoint = conjointOui ? 20 : 0;
  const ptsDettes = Math.min(8, (dettes / 50000) * 8);

  // Besoins futurs dÃ©jÃ  connus (pondÃ©rÃ©s â€” plus proche = plus de poids)
  const poidsHypoFuture =
    hypoFutureOui && montantHypoPrevue > 0
      ? Math.min(22, (montantHypoPrevue / 450000) * 22 * (anneesHypo <= 5 ? 1 : 0.7))
      : 0;
  const poidsFamilleFuture = familleFutureOui ? (anneesFam <= 7 ? 15 : 10) : 0;

  const score = clampScore(
    ptsMaison + ptsEnfants + ptsConjoint + ptsDettes + poidsHypoFuture + poidsFamilleFuture
  );

  const capitalEnfants = nbEnfants > 0 ? 100000 : 0;
  const capitalConjoint = conjointOui ? 24 * revenu : 0;
  const capitalFutureHypo = hypoFutureOui ? montantHypoPrevue : 0;
  const capitalFutureFamille = familleFutureOui ? 100000 : 0;
  const capitalAujourdhui = maisonActuelle + dettes + capitalEnfants + capitalConjoint;
  const capitalProjets = capitalFutureHypo + capitalFutureFamille;
  const capital = capitalAujourdhui + capitalProjets;

  const aDuFutur = hypoFutureOui || familleFutureOui;
  const aDuPresent = maisonActuelle > 0 || nbEnfants > 0 || conjointOui || dettes > 0;
  const scoreEleve = score >= 40;
  const scoreMoyen = score >= 15;
  const projetsPlusLourds = capitalProjets > capitalAujourdhui;

  useEffect(() => {
    if (!aDuFutur || dualRevealTracked.current) return;
    dualRevealTracked.current = true;
    trackEvent('select_content', {
      content_type: 'tool',
      item_id: 'campagne_trop-jeune-assurance_dual_reveal',
    });
  }, [aDuFutur]);

  const lectureScore = scoreEleve
    ? aDuFutur && !aDuPresent
      ? 'MÃªme sans gros besoin aujourdâ€™hui, tes projets connus (maison, famille) changent dÃ©jÃ  la donne.'
      : 'Â« Trop jeune Â» tient pas vraiment â€” entre le prÃ©sent et ce qui sâ€™en vient.'
    : scoreMoyen
      ? 'Yâ€™a dÃ©jÃ  des raisons de regarder â€” aujourdâ€™hui ou dans les prochaines annÃ©es.'
      : 'Besoin plus lÃ©ger pour lâ€™instant. Ajoute tes projets connus (hypothÃ¨que, famille) si tu les as en tÃªte.';

  const softCloseCopy = scoreEleve
    ? {
        headline: `Score ${score}/100 Â· ~${formatCad(capital)} illustratifs`,
        subline:
          capitalProjets > capitalAujourdhui
            ? 'Surtout tes projets connus. 15 min pour lire Ã§a ensemble â€” clarifier ? acheter.'
            : 'PrÃ©sent + projets connus. 15 min pour lire Ã§a ensemble â€” clarifier ? acheter.',
        rdvLabel: 'Lire mon score en 15 min',
      }
    : scoreMoyen
      ? {
          headline: `Score ${score}/100 Â· yâ€™a dÃ©jÃ  de quoi regarder`,
          subline: '15 min pour clarifier prÃ©sent + projets â€” sans pression.',
          rdvLabel: 'Clarifier mon score Â· 15 min',
        }
      : {
          headline: 'Besoin plus lÃ©ger pour lâ€™instant',
          subline: 'Garde le PDF â€” ou 15 min si tu veux valider que tâ€™oublies rien.',
          rdvLabel: 'Ou 15 min avec un conseiller',
        };

  const milestones = useMemo(
    () => [
      {
        id: 'present',
        done: Boolean(String(age).trim()) && (conjointDepend === 'oui' || conjointDepend === 'non'),
      },
      {
        id: 'futur',
        done: projetHypotheque === 'oui' || projetFamille === 'oui',
      },
      { id: 'lecture', done: scoreMoyen || aDuFutur || aDuPresent },
    ],
    [age, conjointDepend, projetHypotheque, projetFamille, scoreMoyen, aDuFutur, aDuPresent]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const totalSteps = milestones.length;

  const contribs = [
    { id: 'maison', label: 'Maison actuelle', pts: Math.round(ptsMaison), color: 'bg-primary' },
    { id: 'enfants', label: 'Enfants', pts: Math.round(ptsEnfants), color: 'bg-secondary' },
    { id: 'conjoint', label: 'Proche dÃ©pend de toi', pts: Math.round(ptsConjoint), color: 'bg-amber-500' },
    { id: 'dettes', label: 'Dettes', pts: Math.round(ptsDettes), color: 'bg-prestige-taupe' },
    { id: 'hypo-futur', label: 'HypothÃ¨que prÃ©vue', pts: Math.round(poidsHypoFuture), color: 'bg-primary/70' },
    { id: 'famille-futur', label: 'Famille prÃ©vue', pts: Math.round(poidsFamilleFuture), color: 'bg-secondary/70' },
  ].filter((c) => c.pts > 0);

  const statusDetail = scoreEleve
    ? 'Apporte ce rÃ©sumÃ© en RDV â€” on le lit ensemble.'
    : 'Ajuste tes projets (maison, famille) â€” souvent câ€™est Ã§a qui change le portrait.';

  const trackFuturToggle = (nextValue) => {
    if (nextValue === 'oui' && !futurToggleTracked.current) {
      futurToggleTracked.current = true;
      trackEvent('select_content', {
        content_type: 'tool',
        item_id: 'campagne_trop-jeune-assurance_toggle_futur',
      });
    }
  };

  const handleProjetHypotheque = (value) => {
    trackFuturToggle(value);
    setProjetHypotheque(value);
  };

  const handleProjetFamille = (value) => {
    trackFuturToggle(value);
    setProjetFamille(value);
  };

  const handleRdvOutil = () => trackRendezVousClick('campagne_trop-jeune-assurance_rdv_outil');

  const handleDownload = () =>
    downloadPdf({
      title: 'RÃ©sumÃ© â€” trop jeune pour sâ€™assurer ?',
      filename: 'resume-trop-jeune-assurance.pdf',
      sections: [
        {
          heading: 'Aujourdâ€™hui',
          rows: [
            { label: 'Ã‚ge (contexte)', value: `${ageN} ans` },
            { label: 'Solde maison actuel', value: formatCad(maisonActuelle) },
            { label: 'Enfants', value: String(nbEnfants) },
            {
              label: 'Quelquâ€™un compte sur ton salaire',
              value: conjointOui ? 'Oui' : 'Non',
            },
            { label: 'Autres dettes', value: formatCad(dettes) },
            { label: 'Paye mensuelle nette', value: formatCad(revenu) },
          ],
        },
        {
          heading: 'Besoins futurs dÃ©jÃ  connus',
          rows: [
            {
              label: 'HypothÃ¨que prÃ©vue',
              value: hypoFutureOui
                ? `Oui â€” dans ~${anneesHypo} an(s), ~${formatCad(montantHypoPrevue)}`
                : 'Non',
            },
            {
              label: 'Famille / enfants prÃ©vus',
              value: familleFutureOui ? `Oui â€” dâ€™ici ~${anneesFam} an(s)` : 'Non',
            },
          ],
        },
        {
          heading: 'RÃ©sultats',
          rows: [
            { label: 'Score (prÃ©sent + futur)', value: `${score} / 100` },
            { label: 'Aujourdâ€™hui (illustratif)', value: formatCad(capitalAujourdhui) },
            { label: 'Projets connus (illustratif)', value: formatCad(capitalProjets) },
            { label: 'Montant illustratif Ã  viser', value: formatCad(capital) },
          ],
        },
      ],
      notes: [
        lectureScore,
        'On regarde aussi les besoins futurs dÃ©jÃ  connus â€” pas seulement aujourdâ€™hui.',
        'Apporte ce PDF â€” 15 min pour le lire ensemble.',
        'Illustration Ã©ducative seulement â€” pas une soumission ni un conseil personnalisÃ©.',
      ],
    });


  /* immersive-wizard */
  if (immersive) {
    return (
      <div data-testid="tool-trop-jeune">
        <CampagneToolShell immersive titleAs="h1" eyebrow="Assurance vie" title="Trop jeune pour tâ€™assurer ?" intro="Une question Ã  la fois. Ã€ la fin, on lit ton score en 15 minutes." disclaimer="Illustration Ã©ducative seulement." footer={null}>
          <WizardProgress stepIndex={stepIndex} questionCount={questionCount} isResult={isResult} resultLabel="Ton score" progress={wizardProgress} />
          {!isResult && stepIndex > 0 ? <WizardBackButton onClick={goBack} /> : null}
          {currentStepId === 'present' ? (
            <WizardStep id="present">
              <WizardStepHeading title="Aujourdâ€™hui" hint="Maison, proches, dettes." />
              <Field id="tj-wiz-age" label="Ton Ã¢ge">
                <input id="tj-wiz-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} />
              </Field>
              <Field id="tj-wiz-solde" label="Solde hypothÃ¨que (0 si aucune)">
                <input id="tj-wiz-solde" type="number" value={soldeMaison} onChange={(e) => setSoldeMaison(e.target.value)} className={inputClass} />
              </Field>
              <Field id="tj-wiz-enfants" label="Nombre dâ€™enfants">
                <input id="tj-wiz-enfants" type="number" value={enfants} onChange={(e) => setEnfants(e.target.value)} className={inputClass} />
              </Field>
              <WizardChoiceList
                name="conjoint"
                value={conjointDepend}
                options={[{ value: 'oui', label: 'Conjoint qui dÃ©pend de mon revenu' }, { value: 'non', label: 'Non' }]}
                onSelect={(v) => setConjointDepend(v)}
              />
              <Field id="tj-wiz-dettes" label="Autres dettes">
                <input id="tj-wiz-dettes" type="number" value={autresDettes} onChange={(e) => setAutresDettes(e.target.value)} className={inputClass} />
              </Field>
              <Field id="tj-wiz-revenu" label="Revenu mensuel net">
                <input id="tj-wiz-revenu" type="number" value={revenuMensuel} onChange={(e) => setRevenuMensuel(e.target.value)} className={inputClass} />
              </Field>
              <WizardContinueButton onClick={() => advanceFrom('present')} />
            </WizardStep>
          ) : null}
          {currentStepId === 'projets' ? (
            <WizardStep id="projets">
              <WizardStepHeading title="Ce qui sâ€™en vient" hint="HypothÃ¨que ou famille prÃ©vues." />
              <WizardChoiceList
                name="hypo"
                value={projetHypotheque}
                options={[{ value: 'oui', label: 'HypothÃ¨que prÃ©vue' }, { value: 'non', label: 'Pas dâ€™hypothÃ¨que prÃ©vue' }]}
                onSelect={(v) => handleProjetHypotheque(v)}
              />
              <WizardChoiceList
                name="famille"
                value={projetFamille}
                options={[{ value: 'oui', label: 'Projet famille prÃ©vu' }, { value: 'non', label: 'Pas de projet famille' }]}
                onSelect={(v) => handleProjetFamille(v)}
              />
              <WizardContinueButton onClick={() => advanceFrom('projets')} />
            </WizardStep>
          ) : null}
          {isResult ? (
            <WizardStep id="result">
              <p className="font-heading text-3xl font-bold text-dark">{score}/100</p>
              <p className="mt-2 text-sm text-prestige-taupe">{lectureScore}</p>
              <div className="mt-5">
                <ToolSoftClose
                  headline={softCloseCopy.headline}
                  subline={softCloseCopy.subline}
                  rdvPath={rdvPath}
                  rdvLabel={softCloseCopy.rdvLabel}
                  onRdvClick={handleRdvOutil}
                  onPdf={handleDownload}
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
    <div data-testid="tool-trop-jeune">
      <CampagneToolShell
        title="Trop jeune pour tâ€™assurer ?"
        intro="Pas juste Â« aujourdâ€™hui Â». Si tu sais dÃ©jÃ  quâ€™une hypothÃ¨que ou une famille sâ€™en vient, Ã§a compte dans le score â€” lâ€™Ã¢ge seul, non."
        disclaimer="Illustration Ã©ducative seulement â€” pas une soumission ni un conseil personnalisÃ©."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            {scoreMoyen ? (
              <ToolDownloadPdf
                busy={busy}
                onClick={handleDownload}
                label="Garder mon rÃ©sumÃ© PDF"
                variant="ghost"
              />
            ) : (
              <ToolDownloadPdf busy={busy} onClick={handleDownload} label="TÃ©lÃ©charger mon rÃ©sumÃ© PDF" />
            )}
          </div>
        }
      >
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Ton score</p>
              <p className="font-heading mt-1 text-3xl font-bold tabular-nums text-dark">
                {score}
                <span className="text-base font-medium text-prestige-taupe"> / 100</span>
              </p>
            </div>
            <p className="text-right text-sm text-prestige-taupe">
              {ageN > 0 ? (
                <>
                  {ageN} ans
                  <span className="block text-xs">contexte seulement</span>
                </>
              ) : (
                `${doneCount}/${totalSteps}`
              )}
            </p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-prestige-beige/70" aria-hidden>
            {contribs.length > 0 ? (
              <div className="flex h-full w-full">
                {contribs.map((c) => (
                  <div
                    key={c.id}
                    className={`h-full transition-all duration-500 ease-out ${c.color}`}
                    style={{ width: `${Math.min(100, c.pts)}%` }}
                    title={`${c.label} : ${c.pts} pts`}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full w-0 rounded-full bg-primary" />
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-prestige-taupe">{lectureScore}</p>
          {contribs.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Composition du score">
              {contribs.map((c) => (
                <li
                  key={c.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)]"
                >
                  <span className={`h-2 w-2 rounded-full ${c.color}`} aria-hidden />
                  {c.label} Â· {c.pts}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Aujourdâ€™hui"
            subtitle="Ce qui existe dÃ©jÃ  â€” maison, proches, dettes."
            done={milestones[0].done}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                id="tj-age"
                label="Quel Ã¢ge as-tu ?"
                value={age}
                onChange={setAge}
                min={18}
                max={65}
                step="1"
                hint="Contexte seulement â€” nâ€™entre pas dans le score."
              />
              <NumberField
                id="tj-enfants"
                label="Combien dâ€™enfants ?"
                value={enfants}
                onChange={setEnfants}
                min={0}
                max={12}
                step="1"
              />
              <div className="sm:col-span-2">
                <YesNo
                  id="tj-conjoint"
                  label="Quelquâ€™un compte dÃ©jÃ  sur ton salaire ?"
                  value={conjointDepend}
                  onChange={setConjointDepend}
                />
              </div>
              {conjointOui ? (
                <div className="sm:col-span-2">
                  <NumberField
                    id="tj-revenu"
                    label="Ta paye nette par mois ?"
                    value={revenuMensuel}
                    onChange={setRevenuMensuel}
                    min={0}
                    step="100"
                    suffix="$"
                  />
                </div>
              ) : null}
              <NumberField
                id="tj-hypotheque"
                label="Combien reste Ã  payer sur ta maison ?"
                value={soldeMaison}
                onChange={setSoldeMaison}
                min={0}
                step="1000"
                suffix="$"
                hint="0 $ si tu loues ou si tu nâ€™as pas encore de maison."
              />
              <NumberField
                id="tj-dettes"
                label="Autres dettes (auto, carte, prÃªtâ€¦) ?"
                value={autresDettes}
                onChange={setAutresDettes}
                min={0}
                step="500"
                suffix="$"
              />
            </div>
          </Block>

          <Block
            step={2}
            title="Ce qui sâ€™en vient (dÃ©jÃ  connu)"
            subtitle="HypothÃ¨que ou famille prÃ©vues â€” mÃªme si ce nâ€™est pas encore arrivÃ©."
            done={milestones[1].done}
          >
            <p className="mb-4 rounded-xl bg-secondary/[0.08] px-3.5 py-2.5 text-sm leading-relaxed text-dark">
              Coche tes projets connus â€” câ€™est souvent Ã§a qui fait bouger le score.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <YesNo
                  id="tj-projet-hypo"
                  label="Tu prÃ©vois une hypothÃ¨que / un achat dans les prochaines annÃ©es ?"
                  value={projetHypotheque}
                  onChange={handleProjetHypotheque}
                  hint="MÃªme si tu nâ€™as pas encore achetÃ© â€” un projet clair compte."
                />
              </div>
              {hypoFutureOui ? (
                <>
                  <NumberField
                    id="tj-annees-hypo"
                    label="Dans environ combien dâ€™annÃ©es ?"
                    value={anneesHypotheque}
                    onChange={setAnneesHypotheque}
                    min={1}
                    max={20}
                    step="1"
                    suffix="ans"
                    suffixWidth="pr-12"
                  />
                  <NumberField
                    id="tj-montant-hypo"
                    label="Montant dâ€™hypothÃ¨que prÃ©vu (ordre de grandeur)"
                    value={montantHypothequePrevue}
                    onChange={setMontantHypothequePrevue}
                    min={0}
                    step="10000"
                    suffix="$"
                  />
                </>
              ) : null}
              <div className="sm:col-span-2">
                <YesNo
                  id="tj-projet-famille"
                  label="Tu prÃ©vois fonder / agrandir une famille dâ€™ici quelques annÃ©es ?"
                  value={projetFamille}
                  onChange={handleProjetFamille}
                />
              </div>
              {familleFutureOui ? (
                <NumberField
                  id="tj-annees-famille"
                  label="Dâ€™ici environ combien dâ€™annÃ©es ?"
                  value={anneesFamille}
                  onChange={setAnneesFamille}
                  min={1}
                  max={20}
                  step="1"
                  suffix="ans"
                  suffixWidth="pr-12"
                />
              ) : null}
            </div>
          </Block>

          <Block
            step={3}
            title="Lecture"
            subtitle="Score prÃ©sent + futur â€” montant illustratif, pas une soumission."
            done={milestones[2].done}
          >
            <ToolClimaxReveal key={aDuFutur ? 'futur-on' : 'futur-off'}>
              <div
                className="grid gap-3 sm:grid-cols-2"
                data-testid="trop-jeune-dual-capital"
              >
                <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] to-white px-4 py-3.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">
                    Aujourdâ€™hui
                  </p>
                  <p className="font-heading mt-1.5 text-3xl font-bold tabular-nums text-dark md:text-4xl">
                    {formatCad(capitalAujourdhui)}
                  </p>
                </div>
                <div
                  className={`rounded-2xl border px-4 py-3.5 ${
                    projetsPlusLourds
                      ? 'border-secondary/30 bg-gradient-to-br from-secondary/[0.08] to-white'
                      : 'border-primary/15 bg-gradient-to-br from-primary/[0.04] to-white'
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">
                    Projets connus
                  </p>
                  <p
                    className={`font-heading mt-1.5 text-3xl font-bold tabular-nums md:text-4xl ${
                      projetsPlusLourds ? 'text-secondary' : 'text-dark'
                    }`}
                  >
                    {formatCad(capitalProjets)}
                  </p>
                  {projetsPlusLourds ? (
                    <p className="mt-1.5 text-xs text-prestige-taupe">
                      Câ€™est souvent ici que le mythe tombe.
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-center">
                <span className="text-xs uppercase tracking-wide text-prestige-taupe">
                  Total illustratif
                </span>
                <span className="font-heading mt-0.5 block text-xl font-semibold tabular-nums text-dark md:text-2xl">
                  {formatCad(capital)}
                </span>
              </p>
            </ToolClimaxReveal>

            <div className="mt-3 rounded-2xl bg-prestige-beige/25 px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                Dâ€™oÃ¹ vient le montant
              </p>
              <div className="mt-2.5 space-y-3.5">
                <BreakdownGroup title="PrÃ©sent">
                  <BreakdownRow label="Maison actuelle" value={formatCad(maisonActuelle)} muted />
                  <BreakdownRow label="Autres dettes" value={formatCad(dettes)} muted />
                  {capitalEnfants > 0 ? (
                    <BreakdownRow label="Enfants (aujourdâ€™hui)" value={formatCad(capitalEnfants)} muted />
                  ) : null}
                  {capitalConjoint > 0 ? (
                    <BreakdownRow
                      label={`24 mois Ã— ${formatCad(revenu)}`}
                      value={formatCad(capitalConjoint)}
                      muted
                    />
                  ) : null}
                  <BreakdownRow label="Sous-total aujourdâ€™hui" value={formatCad(capitalAujourdhui)} />
                </BreakdownGroup>
                <BreakdownGroup title="Projets connus">
                  {capitalFutureHypo > 0 ? (
                    <BreakdownRow
                      label={`HypothÃ¨que prÃ©vue (~${anneesHypo} an${anneesHypo > 1 ? 's' : ''})`}
                      value={formatCad(capitalFutureHypo)}
                      muted
                    />
                  ) : (
                    <BreakdownRow label="HypothÃ¨que prÃ©vue" value={formatCad(0)} muted />
                  )}
                  {capitalFutureFamille > 0 ? (
                    <BreakdownRow
                      label="Famille prÃ©vue (ordre de grandeur)"
                      value={formatCad(capitalFutureFamille)}
                      muted
                    />
                  ) : (
                    <BreakdownRow label="Famille prÃ©vue" value={formatCad(0)} muted />
                  )}
                  <BreakdownRow label="Sous-total projets" value={formatCad(capitalProjets)} />
                </BreakdownGroup>
                <div className="border-t border-prestige-beige/80 pt-2">
                  <BreakdownRow label="Total illustratif" value={formatCad(capital)} strong />
                </div>
              </div>
            </div>

            <div className="mt-4">
              {scoreMoyen ? (
                <ToolSoftClose
                  headline={softCloseCopy.headline}
                  subline={softCloseCopy.subline}
                  rdvPath={rdvPath}
                  rdvLabel={softCloseCopy.rdvLabel}
                  onRdvClick={handleRdvOutil}
                  onPdf={handleDownload}
                  pdfBusy={busy}
                  pdfLabel="Garder mon rÃ©sumÃ© PDF"
                />
              ) : (
                <div
                  className="space-y-4 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] to-secondary/[0.05] px-4 py-4 md:px-5"
                  data-testid="campagne-tool-soft-close"
                >
                  <p className="font-heading text-base font-semibold text-dark md:text-lg">
                    {softCloseCopy.headline}
                  </p>
                  <p className="text-sm leading-relaxed text-prestige-taupe">{softCloseCopy.subline}</p>
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                    <ToolDownloadPdf
                      onClick={handleDownload}
                      busy={busy}
                      label="TÃ©lÃ©charger mon rÃ©sumÃ© PDF"
                    />
                    <Link
                      to={rdvPath}
                      onClick={handleRdvOutil}
                      className="inline-flex w-full items-center justify-center text-sm font-medium text-primary hover:underline sm:w-auto"
                      data-testid="campagne-tool-cta-rdv"
                    >
                      {softCloseCopy.rdvLabel}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Block>
        </div>
      </CampagneToolShell>
    </div>
  );
}
