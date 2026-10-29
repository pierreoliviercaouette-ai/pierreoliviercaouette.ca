import { useMemo, useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

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

function ResultCard({ label, value, detail, tone = 'default' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white'
      : tone === 'ok'
        ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white'
        : 'border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05]';

  const icon =
    tone === 'warn' ? (
      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={2.25} aria-hidden />
    ) : tone === 'ok' ? (
      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
    ) : null;

  return (
    <div className={`rounded-2xl border px-4 py-3.5 ${toneClass}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">{label}</p>
      </div>
      <p className="font-heading mt-1.5 text-2xl font-bold tabular-nums text-dark">{value}</p>
      {detail ? <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

function BreakdownRow({ label, value, muted }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className={muted ? 'text-prestige-taupe' : 'text-dark'}>{label}</span>
      <span className={`font-medium tabular-nums ${muted ? 'text-prestige-taupe' : 'text-dark'}`}>
        {value}
      </span>
    </div>
  );
}

/**
 * Score illustratif — besoin actuel ET besoins futurs déjà connus
 * (hypothèque prévue, famille prévue), pas seulement « aujourd’hui ».
 */
export function TropJeuneTool() {
  const [age, setAge] = useState('28');
  const [soldeMaison, setSoldeMaison] = useState('0');
  const [enfants, setEnfants] = useState('0');
  const [conjointDepend, setConjointDepend] = useState('non');
  const [autresDettes, setAutresDettes] = useState('5000');
  const [revenuMensuel, setRevenuMensuel] = useState('4200');
  const [projetHypotheque, setProjetHypotheque] = useState('oui');
  const [anneesHypotheque, setAnneesHypotheque] = useState('3');
  const [montantHypothequePrevue, setMontantHypothequePrevue] = useState('350000');
  const [projetFamille, setProjetFamille] = useState('oui');
  const [anneesFamille, setAnneesFamille] = useState('5');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_trop-jeune-assurance_pdf');

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

  // Besoins futurs déjà connus (pondérés — plus proche = plus de poids)
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
  const capital =
    maisonActuelle + dettes + capitalEnfants + capitalConjoint + capitalFutureHypo + capitalFutureFamille;

  const aDuFutur = hypoFutureOui || familleFutureOui;
  const aDuPresent = maisonActuelle > 0 || nbEnfants > 0 || conjointOui || dettes > 0;
  const scoreEleve = score >= 40;
  const scoreMoyen = score >= 15;
  const tone = scoreEleve ? 'warn' : scoreMoyen ? 'default' : 'ok';

  const lectureScore = scoreEleve
    ? aDuFutur && !aDuPresent
      ? 'Même sans gros besoin aujourd’hui, tes projets connus (maison, famille) changent déjà la donne.'
      : '« Trop jeune » tient pas vraiment — entre le présent et ce qui s’en vient.'
    : scoreMoyen
      ? 'Y’a déjà des raisons de regarder — aujourd’hui ou dans les prochaines années.'
      : 'Besoin plus léger pour l’instant. Ajoute tes projets connus (hypothèque, famille) si tu les as en tête.';

  const milestones = useMemo(
    () => [
      {
        id: 'present',
        done: Boolean(String(age).trim()) && (conjointDepend === 'oui' || conjointDepend === 'non'),
      },
      {
        id: 'futur',
        done: projetHypotheque === 'oui' || projetHypotheque === 'non' || projetFamille === 'oui' || projetFamille === 'non',
      },
      { id: 'lecture', done: score >= 0 },
    ],
    [age, conjointDepend, projetHypotheque, projetFamille, score]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const totalSteps = milestones.length;

  const contribs = [
    { id: 'maison', label: 'Maison actuelle', pts: Math.round(ptsMaison), color: 'bg-primary' },
    { id: 'enfants', label: 'Enfants', pts: Math.round(ptsEnfants), color: 'bg-secondary' },
    { id: 'conjoint', label: 'Salaire', pts: Math.round(ptsConjoint), color: 'bg-amber-500' },
    { id: 'dettes', label: 'Dettes', pts: Math.round(ptsDettes), color: 'bg-prestige-taupe' },
    { id: 'hypo-futur', label: 'Hypothèque prévue', pts: Math.round(poidsHypoFuture), color: 'bg-primary/70' },
    { id: 'famille-futur', label: 'Famille prévue', pts: Math.round(poidsFamilleFuture), color: 'bg-secondary/70' },
  ].filter((c) => c.pts > 0);

  const statusDetail = scoreEleve
    ? 'Le score tient compte du présent et du futur déjà connu. Garde le PDF.'
    : 'Ajuste tes projets (maison, famille) — souvent c’est ça qui change le portrait.';

  const handleDownload = () =>
    downloadPdf({
      title: 'Resume — trop jeune pour s’assurer ?',
      filename: 'resume-trop-jeune-assurance.pdf',
      sections: [
        {
          heading: 'Aujourd’hui',
          rows: [
            { label: 'Age (contexte)', value: `${ageN} ans` },
            { label: 'Solde maison actuel', value: formatCad(maisonActuelle) },
            { label: 'Enfants', value: String(nbEnfants) },
            {
              label: 'Quelqu’un compte sur ton salaire',
              value: conjointOui ? 'Oui' : 'Non',
            },
            { label: 'Autres dettes', value: formatCad(dettes) },
            { label: 'Paye mensuelle nette', value: formatCad(revenu) },
          ],
        },
        {
          heading: 'Besoins futurs deja connus',
          rows: [
            {
              label: 'Hypotheque prevue',
              value: hypoFutureOui
                ? `Oui — dans ~${anneesHypo} an(s), ~${formatCad(montantHypoPrevue)}`
                : 'Non',
            },
            {
              label: 'Famille / enfants prevus',
              value: familleFutureOui ? `Oui — d’ici ~${anneesFam} an(s)` : 'Non',
            },
          ],
        },
        {
          heading: 'Resultats',
          rows: [
            { label: 'Score (present + futur)', value: `${score} / 100` },
            { label: 'Montant illustratif a viser', value: formatCad(capital) },
          ],
        },
      ],
      notes: [
        lectureScore,
        'On regarde aussi les besoins futurs deja connus — pas seulement aujourd’hui.',
        'Illustration educative seulement — pas une soumission ni un conseil personnalise.',
      ],
    });

  return (
    <div data-testid="tool-trop-jeune">
      <CampagneToolShell
        title="Trop jeune pour t’assurer ?"
        intro="Pas juste « aujourd’hui ». Si tu sais déjà qu’une hypothèque ou une famille s’en vient, ça compte dans le score — l’âge seul, non."
        disclaimer="Illustration éducative seulement — pas une soumission ni un conseil personnalisé."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            <ToolDownloadPdf busy={busy} onClick={handleDownload} label="Télécharger mon résumé PDF" />
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
                  {c.label} · {c.pts}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Aujourd’hui"
            subtitle="Ce qui existe déjà — maison, proches, dettes."
            done={milestones[0].done}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                id="tj-age"
                label="Quel âge as-tu ?"
                value={age}
                onChange={setAge}
                min={18}
                max={65}
                step="1"
                hint="Contexte seulement — n’entre pas dans le score."
              />
              <NumberField
                id="tj-enfants"
                label="Combien d’enfants ?"
                value={enfants}
                onChange={setEnfants}
                min={0}
                max={12}
                step="1"
              />
              <div className="sm:col-span-2">
                <YesNo
                  id="tj-conjoint"
                  label="Quelqu’un compte déjà sur ton salaire ?"
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
                label="Combien reste à payer sur ta maison ?"
                value={soldeMaison}
                onChange={setSoldeMaison}
                min={0}
                step="1000"
                suffix="$"
                hint="0 $ si tu loues ou si tu n’as pas encore de maison."
              />
              <NumberField
                id="tj-dettes"
                label="Autres dettes (auto, carte, prêt…) ?"
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
            title="Ce qui s’en vient (déjà connu)"
            subtitle="Hypothèque ou famille prévues — même si ce n’est pas encore arrivé."
            done={milestones[1].done}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <YesNo
                  id="tj-projet-hypo"
                  label="Tu prévois une hypothèque / un achat dans les prochaines années ?"
                  value={projetHypotheque}
                  onChange={setProjetHypotheque}
                  hint="Même si tu n’as pas encore acheté — un projet clair compte."
                />
              </div>
              {hypoFutureOui ? (
                <>
                  <NumberField
                    id="tj-annees-hypo"
                    label="Dans environ combien d’années ?"
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
                    label="Montant d’hypothèque prévu (ordre de grandeur)"
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
                  label="Tu prévois fonder / agrandir une famille d’ici quelques années ?"
                  value={projetFamille}
                  onChange={setProjetFamille}
                />
              </div>
              {familleFutureOui ? (
                <NumberField
                  id="tj-annees-famille"
                  label="D’ici environ combien d’années ?"
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
            subtitle="Score présent + futur — montant illustratif, pas une soumission."
            done={milestones[2].done}
          >
            <ResultCard
              label="Montant à viser (illustration)"
              value={formatCad(capital)}
              detail="Inclut aujourd’hui et les projets déjà connus (hypothèque prévue, famille prévue)."
              tone={tone}
            />
            <div className="mt-3 rounded-2xl bg-prestige-beige/25 px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                D’où vient le montant
              </p>
              <div className="mt-2.5 space-y-1.5">
                <BreakdownRow label="Maison actuelle" value={formatCad(maisonActuelle)} muted />
                <BreakdownRow label="Autres dettes" value={formatCad(dettes)} muted />
                {capitalEnfants > 0 ? (
                  <BreakdownRow label="Enfants (aujourd’hui)" value={formatCad(capitalEnfants)} muted />
                ) : null}
                {capitalConjoint > 0 ? (
                  <BreakdownRow
                    label={`24 mois × ${formatCad(revenu)}`}
                    value={formatCad(capitalConjoint)}
                    muted
                  />
                ) : null}
                {capitalFutureHypo > 0 ? (
                  <BreakdownRow
                    label={`Hypothèque prévue (~${anneesHypo} an${anneesHypo > 1 ? 's' : ''})`}
                    value={formatCad(capitalFutureHypo)}
                    muted
                  />
                ) : null}
                {capitalFutureFamille > 0 ? (
                  <BreakdownRow label="Famille prévue (ordre de grandeur)" value={formatCad(capitalFutureFamille)} muted />
                ) : null}
                <div className="border-t border-prestige-beige/80 pt-2">
                  <BreakdownRow label="Total illustratif" value={formatCad(capital)} />
                </div>
              </div>
            </div>
          </Block>
        </div>
      </CampagneToolShell>
    </div>
  );
}
