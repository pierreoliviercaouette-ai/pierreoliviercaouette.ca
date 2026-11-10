import { MoneyInput, SelectInput, TextInput } from './Field';
import { parseInsuranceCsv, planHasCorporate } from '../../lib/illustrateur';
import { usePlan } from './PlanContext';

export function ModuleOptionFields({ moduleId, data, onChange }) {
  const { plan } = usePlan();
  const withCorp = planHasCorporate(plan);
  const set = (key, value) => onChange({ ...data, [key]: value });

  const onCsv = async (file) => {
    if (!file) return;
    const text = await file.text();
    const schedule = parseInsuranceCsv(text);
    if (!schedule.length) {
      window.alert('Aucune ligne de barème reconnue.');
      return;
    }
    onChange({
      ...data,
      schedule,
      issueAge: schedule[0]?.age || data.issueAge,
      coverage: schedule[0]?.totalInsurance || data.coverage,
      annualPremium: schedule[0]?.premiumPaid || data.annualPremium,
    });
  };

  switch (moduleId) {
    case 'assurance_vie':
      return (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <SelectInput
              label="Type de produit"
              value={data.productType}
              options={[
                { value: 'temporaire', label: 'Temporaire' },
                { value: 'permanente', label: 'Permanente' },
                { value: 'participative', label: 'Participative' },
                { value: 'universelle', label: 'Universelle' },
              ]}
              onChange={(v) => set('productType', v)}
            />
            <MoneyInput label="Couverture $" value={data.coverage} onChange={(v) => set('coverage', v)} />
            <MoneyInput label="Prime annuelle $" value={data.annualPremium} onChange={(v) => set('annualPremium', v)} />
            {data.productType === 'temporaire' && (
              <MoneyInput label="Terme (ans)" value={data.termYears} onChange={(v) => set('termYears', v)} />
            )}
            <MoneyInput label="Âge d’émission" value={data.issueAge} onChange={(v) => set('issueAge', v)} />
            {withCorp ? (
              <SelectInput
                label="Propriétaire"
                value={data.ownerType}
                options={[
                  { value: 'personnel', label: 'Personnel' },
                  { value: 'corporation', label: 'Corporation' },
                ]}
                onChange={(v) => set('ownerType', v)}
              />
            ) : null}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-end gap-2 text-xs text-prestige-taupe">
              <input
                type="checkbox"
                checked={Boolean(data.includePremiumsInCashflow)}
                onChange={(e) => set('includePremiumsInCashflow', e.target.checked)}
              />
              Inclure primes dans cashflow
            </label>
            <label className="flex items-end gap-2 text-xs text-prestige-taupe">
              <input
                type="checkbox"
                checked={Boolean(data.pfiEnabled)}
                onChange={(e) => set('pfiEnabled', e.target.checked)}
              />
              PFI / collatéral
            </label>
            {data.pfiEnabled && (
              <>
                <MoneyInput
                  label="Avance PFI $/an"
                  value={data.pfiAnnualAdvanceAmount}
                  onChange={(v) => set('pfiAnnualAdvanceAmount', v)}
                />
                <MoneyInput label="Taux PFI %" value={data.pfiInterestRate} onChange={(v) => set('pfiInterestRate', v)} />
                <MoneyInput
                  label="LTV collatéral %"
                  value={data.collateralLtvPercent}
                  onChange={(v) => set('collateralLtvPercent', v)}
                />
              </>
            )}
          </div>
          {(data.productType === 'participative' ||
            data.productType === 'permanente' ||
            data.productType === 'universelle') && (
            <div className="rounded-xl border border-dashed border-prestige-beige px-3 py-3 text-xs text-prestige-taupe">
              <p className="mb-2 font-semibold text-dark">Valeur de rachat dans le temps</p>
              <p className="mb-2">
                Importe un barème CSV (année, âge, VR, capital décès, primes) ou laisse une approximation
                basée sur la prime.
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-prestige-beige px-3 py-1.5">
                Importer barème CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => onCsv(e.target.files?.[0])}
                />
              </label>
              <span className="ml-3">
                {data.schedule?.length
                  ? `${data.schedule.length} lignes importées`
                  : 'Aucun barème — approximation automatique'}
              </span>
            </div>
          )}
        </div>
      );

    case 'invalidite':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput label="Revenu mensuel $" value={data.revenuMensuel} onChange={(v) => set('revenuMensuel', v)} />
          <MoneyInput label="% à remplacer" value={data.remplacementPct} onChange={(v) => set('remplacementPct', v)} />
          <MoneyInput label="% collective" value={data.collectivePct} onChange={(v) => set('collectivePct', v)} />
          <MoneyInput label="Délai (jours)" value={data.delaiJours} onChange={(v) => set('delaiJours', v)} />
          <MoneyInput label="Durée prestations (ans)" value={data.dureeAnnees} onChange={(v) => set('dureeAnnees', v)} />
          <MoneyInput label="Prime annuelle $" value={data.primeAnnuelle} onChange={(v) => set('primeAnnuelle', v)} />
        </div>
      );

    case 'maladie_grave':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput label="Capital $" value={data.capital} onChange={(v) => set('capital', v)} />
          <MoneyInput label="Prime annuelle $" value={data.primeAnnuelle} onChange={(v) => set('primeAnnuelle', v)} />
          <MoneyInput label="Durée (ans)" value={data.dureeAnnees} onChange={(v) => set('dureeAnnees', v)} />
          <label className="flex items-end gap-2 text-xs text-prestige-taupe md:col-span-3">
            <input
              type="checkbox"
              checked={Boolean(data.remboursementPrimes)}
              onChange={(e) => set('remboursementPrimes', e.target.checked)}
            />
            Option remboursement de primes (illustratif)
          </label>
        </div>
      );

    case 'placement':
      return (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-prestige-taupe">REER</p>
          <div className="grid gap-3 md:grid-cols-3">
            <MoneyInput label="Solde $" value={data.reerSolde} onChange={(v) => set('reerSolde', v)} />
            <MoneyInput
              label="Cotisation $/mois"
              value={data.reerCotisationMensuelle}
              onChange={(v) => set('reerCotisationMensuelle', v)}
            />
            <MoneyInput label="Rendement %/an" value={data.reerRendement} onChange={(v) => set('reerRendement', v)} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-prestige-taupe">CELI</p>
          <div className="grid gap-3 md:grid-cols-3">
            <MoneyInput label="Solde $" value={data.celiSolde} onChange={(v) => set('celiSolde', v)} />
            <MoneyInput
              label="Cotisation $/mois"
              value={data.celiCotisationMensuelle}
              onChange={(v) => set('celiCotisationMensuelle', v)}
            />
            <MoneyInput label="Rendement %/an" value={data.celiRendement} onChange={(v) => set('celiRendement', v)} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-prestige-taupe">Non-enregistré</p>
          <div className="grid gap-3 md:grid-cols-3">
            <MoneyInput
              label="Solde $"
              value={data.nonEnregistreSolde}
              onChange={(v) => set('nonEnregistreSolde', v)}
            />
            <MoneyInput
              label="Cotisation $/mois"
              value={data.nonEnregistreCotisationMensuelle}
              onChange={(v) => set('nonEnregistreCotisationMensuelle', v)}
            />
            <MoneyInput
              label="Rendement %/an"
              value={data.nonEnregistreRendement}
              onChange={(v) => set('nonEnregistreRendement', v)}
            />
          </div>
        </div>
      );

    case 'retraite':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput label="Âge retraite" value={data.ageRetraite} onChange={(v) => set('ageRetraite', v)} />
          <MoneyInput
            label="Revenu cible $/mois"
            value={data.revenuCibleMensuel}
            onChange={(v) => set('revenuCibleMensuel', v)}
          />
          <MoneyInput
            label="Année début décaissement"
            value={data.anneeDebutDecaissement}
            onChange={(v) => set('anneeDebutDecaissement', v)}
          />
          <MoneyInput
            label="Retrait REER $/an"
            value={data.retraitReerAnnuel}
            onChange={(v) => set('retraitReerAnnuel', v)}
          />
          <MoneyInput
            label="Retrait CELI $/an"
            value={data.retraitCeliAnnuel}
            onChange={(v) => set('retraitCeliAnnuel', v)}
          />
        </div>
      );

    case 'liquidites':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput label="Solde actuel $" value={data.soldeActuel} onChange={(v) => set('soldeActuel', v)} />
          <MoneyInput
            label="Dépenses essentielles $/mois"
            value={data.depensesEssentiellesMensuelles}
            onChange={(v) => set('depensesEssentiellesMensuelles', v)}
          />
          <MoneyInput label="Mois cible" value={data.moisCible} onChange={(v) => set('moisCible', v)} />
          <MoneyInput
            label="Épargne $/mois"
            value={data.epargneMensuelle}
            onChange={(v) => set('epargneMensuelle', v)}
          />
          <MoneyInput label="Rendement %/an" value={data.rendement} onChange={(v) => set('rendement', v)} />
        </div>
      );

    case 'immobilier':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput
            label="Valeur propriété $"
            value={data.valeurPropriete}
            onChange={(v) => set('valeurPropriete', v)}
          />
          <MoneyInput
            label="Solde hypothèque $"
            value={data.soldeHypotheque}
            onChange={(v) => set('soldeHypotheque', v)}
          />
          <MoneyInput label="Taux %" value={data.tauxHypotheque} onChange={(v) => set('tauxHypotheque', v)} />
          <MoneyInput
            label="Paiement $/mois"
            value={data.paiementMensuel}
            onChange={(v) => set('paiementMensuel', v)}
          />
          <MoneyInput
            label="Amort. restant (ans)"
            value={data.amortissementRestant}
            onChange={(v) => set('amortissementRestant', v)}
          />
          <MoneyInput label="Appréciation %/an" value={data.appreciation} onChange={(v) => set('appreciation', v)} />
        </div>
      );

    case 'reee':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput label="Solde $" value={data.solde} onChange={(v) => set('solde', v)} />
          <MoneyInput
            label="Cotisation $/an"
            value={data.cotisationAnnuelle}
            onChange={(v) => set('cotisationAnnuelle', v)}
          />
          <MoneyInput label="Nb enfants" value={data.nbEnfants} onChange={(v) => set('nbEnfants', v)} />
          <MoneyInput label="Rendement %/an" value={data.rendement} onChange={(v) => set('rendement', v)} />
          <MoneyInput
            label="Années restantes"
            value={data.anneesRestantes}
            onChange={(v) => set('anneesRestantes', v)}
          />
        </div>
      );

    case 'corporatif':
      return (
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput label="Trésorerie Holdco $" value={data.tresorerie} onChange={(v) => set('tresorerie', v)} />
          <MoneyInput label="Rendement %/an" value={data.rendement} onChange={(v) => set('rendement', v)} />
          <MoneyInput
            label="Dividende perso $/mois"
            value={data.dividendeMensuelPersonnel}
            onChange={(v) => set('dividendeMensuelPersonnel', v)}
          />
          <MoneyInput
            label="Vie corpo couverture $"
            value={data.assuranceVieCouverture}
            onChange={(v) => set('assuranceVieCouverture', v)}
          />
          <MoneyInput
            label="Vie corpo prime $/an"
            value={data.assuranceViePrime}
            onChange={(v) => set('assuranceViePrime', v)}
          />
        </div>
      );

    case 'succession':
      return (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <MoneyInput
              label="Capital souhaité (illustratif) $"
              value={data.capitalSouhaite}
              onChange={(v) => set('capitalSouhaite', v)}
            />
            <TextInput
              label="Notes objectifs"
              value={data.notesObjectifs}
              onChange={(v) => set('notesObjectifs', v)}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-prestige-taupe">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(data.testamentAJour)}
                onChange={(e) => set('testamentAJour', e.target.checked)}
              />
              Testament à jour
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(data.procuration)}
                onChange={(e) => set('procuration', e.target.checked)}
              />
              Procuration
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(data.beneficiarieDesigne)}
                onChange={(e) => set('beneficiarieDesigne', e.target.checked)}
              />
              Bénéficiaire désigné
            </label>
          </div>
          <p className="text-xs text-prestige-taupe">
            Pas un simulateur d’impôt au décès public — objectifs et checklist seulement.
          </p>
        </div>
      );

    default:
      return <p className="text-sm text-prestige-taupe">Module inconnu.</p>;
  }
}
