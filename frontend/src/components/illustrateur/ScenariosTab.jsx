import { useMemo, useState } from 'react';
import { ensureProposal, nextLetter, OPTION_LETTERS } from '../../lib/illustrateur/scenarios';
import { formatCad } from '../../lib/illustrateur';
import { TextInput, SectionCard } from './Field';
import { usePlan } from './PlanContext';

export function ScenariosTab() {
  const {
    plan,
    proposalBundle,
    updateProposal,
    saveCurrentAsOption,
    updateOptionMeta,
    setRecommendedOption,
    removeOption,
    loadOptionIntoEditor,
    refreshOptionFromEditor,
    setTab,
    openProposalPresentation,
  } = usePlan();

  const proposal = ensureProposal(plan);
  const availableLetter = nextLetter(proposal.options);
  const [draftName, setDraftName] = useState('');
  const [draftPitch, setDraftPitch] = useState('');
  const [draftLetter, setDraftLetter] = useState(availableLetter || 'A');

  const optionCards = useMemo(() => proposalBundle.options || [], [proposalBundle]);

  const onSave = () => {
    const letter = saveCurrentAsOption({
      letter: draftLetter,
      name: draftName || undefined,
      pitch: draftPitch || undefined,
      openViews: true,
    });
    if (!letter) {
      window.alert('Les 3 options A, B et C sont déjà remplies. Retirez-en une pour en ajouter.');
      return;
    }
    setDraftName('');
    setDraftPitch('');
    const next = nextLetter(
      [...proposal.options.filter((o) => o.letter !== letter), { letter }],
    );
    setDraftLetter(next || letter);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Créer une option de proposition">
        <p className="mb-4 text-sm leading-relaxed text-prestige-taupe">
          Ajuste le dossier (bilan, revenus, planification), puis enregistre-le comme option A, B ou C.
          L’outil ouvre ensuite deux dashboards : une lecture simple pour le client, et le dashboard
          chiffré complet.
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="block text-xs">
            <span className="text-prestige-taupe">Lettre</span>
            <select
              className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
              value={draftLetter}
              onChange={(e) => setDraftLetter(e.target.value)}
            >
              {OPTION_LETTERS.map((l) => (
                <option key={l} value={l}>
                  Option {l}
                  {proposal.options.some((o) => o.letter === l) ? ' (remplacer)' : ''}
                </option>
              ))}
            </select>
          </label>
          <TextInput
            label="Nom court"
            value={draftName}
            onChange={setDraftName}
            className="md:col-span-3"
          />
        </div>
        <label className="mt-3 block text-xs">
          <span className="text-prestige-taupe">Pitch client (1–2 phrases)</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
            rows={3}
            value={draftPitch}
            onChange={(e) => setDraftPitch(e.target.value)}
            placeholder="Ex. : Prioriser la protection familiale et accélérer l’épargne CELI sans toucher à la résidence."
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-dark px-4 py-2 text-sm font-semibold text-white"
          >
            Enregistrer comme option {draftLetter}
          </button>
          {proposal.options.length >= 1 && (
            <>
              <button
                type="button"
                onClick={() => setTab('options')}
                className="rounded-full border border-prestige-beige bg-white px-4 py-2 text-sm font-semibold"
              >
                Voir lecture simple A-B-C
              </button>
              <button
                type="button"
                onClick={() => setTab('dashboard')}
                className="rounded-full border border-prestige-beige bg-white px-4 py-2 text-sm font-semibold"
              >
                Voir dashboard chiffré
              </button>
              <button
                type="button"
                onClick={openProposalPresentation}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Présenter au client
              </button>
            </>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Méta de la proposition">
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput
            label="Titre proposition"
            value={proposal.title}
            onChange={(v) => updateProposal((p) => ({ ...p, title: v }))}
          />
          <TextInput
            label="Libellé situation actuelle"
            value={proposal.baselineLabel}
            onChange={(v) => updateProposal((p) => ({ ...p, baselineLabel: v }))}
          />
        </div>
      </SectionCard>

      <SectionCard title={`Options enregistrées (${proposal.options.length}/3)`}>
        {!proposal.options.length && (
          <p className="text-sm text-prestige-taupe">
            Aucune option encore. Enregistre au moins une trajectoire pour activer les deux dashboards.
          </p>
        )}
        <div className="space-y-4">
          {optionCards.map(({ option, summary }) => (
            <div
              key={option.id}
              className={`rounded-2xl border p-4 ${
                option.recommended ? 'border-primary bg-primary/[0.03]' : 'border-prestige-beige bg-white'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">
                    Option {option.letter}
                    {option.recommended ? ' · recommandée' : ''}
                  </p>
                  <input
                    className="mt-1 w-full max-w-md border-0 bg-transparent p-0 font-heading text-xl text-dark outline-none"
                    value={option.name}
                    onChange={(e) => updateOptionMeta(option.id, { name: e.target.value })}
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-prestige-taupe">VN horizon</p>
                  <p className="font-heading text-xl tabular-nums">{formatCad(summary.netWorthEnd)}</p>
                </div>
              </div>
              <textarea
                className="mt-3 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
                rows={2}
                value={option.pitch || ''}
                onChange={(e) => updateOptionMeta(option.id, { pitch: e.target.value })}
              />
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  className="rounded-full border border-prestige-beige px-3 py-1.5 font-semibold"
                  onClick={() => setRecommendedOption(option.id)}
                >
                  Marquer recommandée
                </button>
                <button
                  type="button"
                  className="rounded-full border border-prestige-beige px-3 py-1.5 font-semibold"
                  onClick={() => loadOptionIntoEditor(option.id)}
                >
                  Charger dans l’éditeur
                </button>
                <button
                  type="button"
                  className="rounded-full border border-prestige-beige px-3 py-1.5 font-semibold"
                  onClick={() => refreshOptionFromEditor(option.id)}
                >
                  Mettre à jour depuis l’éditeur
                </button>
                <button
                  type="button"
                  className="rounded-full border border-red-200 px-3 py-1.5 font-semibold text-red-700"
                  onClick={() => removeOption(option.id)}
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
