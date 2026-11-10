import { useState } from 'react';
import { formatCad, newId } from '../../lib/illustrateur';
import { ATTAINMENT_DOMAIN_LABELS } from '../../lib/illustrateur/attainment';
import { usePlan } from './PlanContext';
import { AddRowButton, CollectCard, StepFooter, StepTitle } from './collectUi';
import { CollectShell } from './CollectShell';

const TABS = [
  { id: 'death', label: 'Décès' },
  { id: 'disability', label: 'Invalidité' },
  { id: 'criticalIllness', label: 'Maladie grave' },
  { id: 'emergency', label: 'Fonds d’urgence' },
  { id: 'retirement', label: 'Retraite' },
  { id: 'conseils', label: 'Conseils' },
];

export function RecommendationsStep() {
  const { plan, setPlan, attainment, goWorkflowNext, goWorkflowPrev, setWorkflowStep, setPriorities } =
    usePlan();
  const [tab, setTab] = useState('death');
  const att = tab === 'conseils' ? null : attainment?.[tab];
  const recos = (plan.recommendations || []).filter((r) =>
    tab === 'conseils' ? true : r.domain === tab,
  );

  const addReco = () => {
    const text = window.prompt('Texte de recommandation');
    if (!text) return;
    setPlan((p) => ({
      ...p,
      recommendations: [
        ...(p.recommendations || []),
        { id: newId('rec'), domain: tab === 'conseils' ? 'conseils' : tab, text },
      ],
    }));
  };

  const prioritizeFromGaps = () => {
    const map = {
      death: 'assurance_vie',
      disability: 'invalidite',
      criticalIllness: 'maladie_grave',
      emergency: 'liquidites',
      retirement: 'retraite',
    };
    const ordered = Object.entries(attainment || {})
      .filter(([k, v]) => map[k] && v?.shortfall > 0)
      .sort((a, b) => (b[1].shortfall || 0) - (a[1].shortfall || 0))
      .slice(0, 3)
      .map(([k]) => map[k]);
    setPriorities(ordered);
  };

  return (
    <CollectShell title={<StepTitle>Recommandations</StepTitle>}>
      <p className="mb-4 rounded-lg border border-[#d7dee8] bg-[#eaf2fb] px-3 py-2 text-sm text-[#3d4f66]">
        Synthèse des gaps. Ajoutez des recommandations manuelles, puis construisez les options A-B-C pour
        couvrir les priorités.
      </p>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-[#d7dee8] pb-2">
        {TABS.map((t) => {
          const pct = t.id === 'conseils' ? null : attainment?.[t.id]?.pct;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-3 py-2 text-xs font-semibold ${
                tab === t.id ? 'bg-[#0b4ea2] text-white' : 'bg-[#eef2f7] text-[#3d4f66]'
              }`}
            >
              {t.label}
              {pct != null ? ` · ${pct}%` : ''}
            </button>
          );
        })}
      </div>

      {att && (
        <CollectCard title={`Situation actuelle — ${ATTAINMENT_DOMAIN_LABELS[tab] || tab}`}>
          <div className="mb-3 h-3 overflow-hidden rounded-full bg-[#e8eef5]">
            <div
              className={`h-full ${att.pct >= 100 ? 'bg-emerald-600' : att.pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, att.pct)}%` }}
            />
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[#5a6b7d]">Besoins</dt>
              <dd className="font-semibold tabular-nums">{formatCad(att.needs)}</dd>
            </div>
            <div>
              <dt className="text-[#5a6b7d]">Disponibles</dt>
              <dd className="font-semibold tabular-nums">{formatCad(att.available)}</dd>
            </div>
            <div>
              <dt className="text-[#5a6b7d]">Manque à gagner</dt>
              <dd className="font-bold tabular-nums text-red-600">{formatCad(att.shortfall)}</dd>
            </div>
          </dl>
        </CollectCard>
      )}

      <div className="mt-4">
        <CollectCard
          title="Recommandations conseiller"
          action={<AddRowButton onClick={addReco}>Ajouter</AddRowButton>}
        >
          {recos.length === 0 && (
            <p className="text-sm text-[#5a6b7d]">Aucune recommandation pour cet onglet.</p>
          )}
          <div className="space-y-3">
            {recos.map((r) => (
              <div key={r.id} className="rounded-lg border border-[#d7dee8] bg-white p-3">
                <textarea
                  className="w-full rounded-md border border-[#d7dee8] px-3 py-2 text-sm"
                  rows={3}
                  value={r.text}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      recommendations: p.recommendations.map((x) =>
                        x.id === r.id ? { ...x, text: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <p className="mt-1 text-[11px] text-[#5a6b7d]">{(r.text || '').length} / 2000</p>
                <button
                  type="button"
                  className="mt-1 text-xs text-red-600"
                  onClick={() =>
                    setPlan((p) => ({
                      ...p,
                      recommendations: p.recommendations.filter((x) => x.id !== r.id),
                    }))
                  }
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </CollectCard>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={prioritizeFromGaps}
          className="rounded-md border border-[#0b4ea2] px-4 py-2 text-sm font-semibold text-[#0b4ea2]"
        >
          Prioriser les 3 plus gros gaps
        </button>
        <button
          type="button"
          onClick={() => setWorkflowStep('modules')}
          className="rounded-md bg-[#0b4ea2] px-4 py-2 text-sm font-semibold text-white"
        >
          Construire les options A-B-C →
        </button>
      </div>

      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

export function RapportStep() {
  const { plan, attainment, modulesBundle, openProposalPresentation, setWorkflowStep, goWorkflowPrev } =
    usePlan();

  return (
    <CollectShell title={<StepTitle>Rapport</StepTitle>}>
      <div className="space-y-4">
        <CollectCard title="Synthèse des gaps">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(ATTAINMENT_DOMAIN_LABELS).map(([key, label]) => {
              const a = attainment?.[key];
              if (!a) return null;
              return (
                <div key={key} className="rounded-lg border border-[#d7dee8] bg-white p-3 text-sm">
                  <p className="font-semibold text-[#0b4ea2]">{label}</p>
                  <p className="mt-1 tabular-nums">{a.pct} %</p>
                  <p className="text-xs text-red-600">Manque {formatCad(a.shortfall)}</p>
                </div>
              );
            })}
          </div>
        </CollectCard>

        <CollectCard title="Objectifs retenus">
          {(plan.objectives || []).length === 0 ? (
            <p className="text-sm text-[#5a6b7d]">Aucun objectif coché.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {(plan.objectives || []).map((o) => (
                <li key={`${o.categoryId}-${o.objectiveId}`}>{o.customLabel || o.objectiveId}</li>
              ))}
            </ul>
          )}
        </CollectCard>

        <CollectCard title="Proposition assemblée">
          <p className="text-sm text-[#5a6b7d]">
            {modulesBundle?.hasSelections
              ? `${modulesBundle.selectedCount} option(s) sélectionnée(s) · VN horizon ${formatCad(
                  modulesBundle.composed?.summary?.netWorthEnd,
                )}`
              : 'Aucune option A-B-C sélectionnée pour l’instant.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openProposalPresentation}
              className="rounded-md bg-[#0b4ea2] px-4 py-2 text-sm font-semibold text-white"
            >
              Mode présentation client
            </button>
            <button
              type="button"
              onClick={() => setWorkflowStep('modules')}
              className="rounded-md border border-[#d7dee8] px-4 py-2 text-sm font-semibold"
            >
              Options A-B-C
            </button>
          </div>
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={openProposalPresentation} nextLabel="Présenter" />
    </CollectShell>
  );
}
