import { formatCad, newId } from '../../lib/illustrateur';
import { CollectShell } from './CollectShell';
import {
  AddRowButton,
  CollectCard,
  FieldLabel,
  StepFooter,
  StepTitle,
  TextField,
} from './collectUi';
import { usePlan } from './PlanContext';

function getRoutingEvent(plan) {
  return (plan.events || []).find((e) => e.type === 'cashflow_direction');
}

export function FluxTresorerieStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev } = usePlan();
  const event = getRoutingEvent(plan);
  const routing = event?.details?.routingBySource || {};
  const entities = plan.entities || [];
  const assets = plan.assets || [];

  const ensureEvent = (mutator) => {
    setPlan((p) => {
      const events = [...(p.events || [])];
      let idx = events.findIndex((e) => e.type === 'cashflow_direction');
      if (idx < 0) {
        events.push({
          id: newId('evt'),
          name: 'Direction du cashflow',
          type: 'cashflow_direction',
          year: new Date().getFullYear(),
          details: { routingBySource: {} },
        });
        idx = events.length - 1;
      }
      const current = events[idx];
      const nextDetails = mutator(current.details || { routingBySource: {} });
      events[idx] = { ...current, details: nextDetails };
      return { ...p, events };
    });
  };

  const setEntityRouting = (entityId, updates) => {
    ensureEvent((details) => ({
      ...details,
      routingBySource: {
        ...(details.routingBySource || {}),
        [entityId]: {
          dividendTaxMode: 'personnel',
          destinations: [],
          ...(details.routingBySource?.[entityId] || {}),
          ...updates,
        },
      },
    }));
  };

  return (
    <CollectShell title={<StepTitle>Flux / trésorerie</StepTitle>}>
      <p className="mb-4 rounded-lg border border-[#d7dee8] bg-[#eaf2fb] px-3 py-2 text-sm text-[#3d4f66]">
        Orientez le surplus de chaque entité vers des actifs (CELI, REER, liquidités corpo…). Utilise l’événement
        <code className="mx-1">cashflow_direction</code> du moteur de projection.
      </p>

      <CollectCard title="Routage par entité source">
        <div className="space-y-4">
          {entities.map((ent) => {
            const route = routing[ent.id] || { destinations: [], dividendTaxMode: 'personnel' };
            const dests = route.destinations || [];
            const entityAssets = assets.filter((a) => a.entityId === ent.id || a.type !== 'immobilier');
            return (
              <div key={ent.id} className="rounded-xl border border-[#d7dee8] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {ent.name}
                    <span className="ml-2 text-xs font-normal text-[#5a6b7d]">{ent.type}</span>
                  </p>
                  <FieldLabel label="Mode impôt dividende (si corpo→perso)">
                    <select
                      className="rounded-md border border-[#d7dee8] bg-white px-2 py-1.5 text-sm"
                      value={route.dividendTaxMode || 'personnel'}
                      onChange={(e) => setEntityRouting(ent.id, { dividendTaxMode: e.target.value })}
                    >
                      <option value="personnel">Personnel</option>
                      <option value="corporatif">Corporatif</option>
                    </select>
                  </FieldLabel>
                </div>

                <div className="mt-3 space-y-2">
                  {dests.map((d, i) => (
                    <div key={`${ent.id}-d-${i}`} className="grid gap-2 md:grid-cols-[1fr_100px_80px]">
                      <select
                        className="rounded-md border border-[#d7dee8] bg-white px-2 py-2 text-sm"
                        value={d.assetId || ''}
                        onChange={(e) => {
                          const next = [...dests];
                          next[i] = { ...d, assetId: e.target.value };
                          setEntityRouting(ent.id, { destinations: next });
                        }}
                      >
                        <option value="">Choisir un actif</option>
                        {entityAssets.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({formatCad(a.currentBalance)})
                          </option>
                        ))}
                      </select>
                      <TextField
                        type="number"
                        value={d.percent || 0}
                        onChange={(v) => {
                          const next = [...dests];
                          next[i] = { ...d, percent: v };
                          setEntityRouting(ent.id, { destinations: next });
                        }}
                      />
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        onClick={() => {
                          const next = dests.filter((_, j) => j !== i);
                          setEntityRouting(ent.id, { destinations: next });
                        }}
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  <AddRowButton
                    onClick={() =>
                      setEntityRouting(ent.id, {
                        destinations: [...dests, { assetId: entityAssets[0]?.id || '', percent: 100 }],
                      })
                    }
                  >
                    Destination
                  </AddRowButton>
                  <p className="text-[11px] text-[#5a6b7d]">
                    Total % : {dests.reduce((s, d) => s + (parseFloat(d.percent) || 0), 0)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CollectCard>

      {!event && (
        <p className="mt-3 text-xs text-[#5a6b7d]">
          Aucun événement de direction encore — il sera créé dès la première destination.
        </p>
      )}

      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}
