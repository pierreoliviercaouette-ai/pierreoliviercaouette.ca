import { ArrowDown, ArrowRight } from 'lucide-react';
import {
  getFormationDiagram,
  getFormationExampleDiagram,
} from '../../data/formationDiagrams';

function NodeCard({ node, compact = false }) {
  const emphasis = Boolean(node.emphasis);
  return (
    <div
      className={`flex h-full w-full flex-col justify-center border px-3 py-3 text-center sm:px-4 ${
        compact ? 'min-h-[72px]' : 'min-h-[80px] sm:min-h-[88px]'
      } ${
        emphasis
          ? 'border-dark bg-dark text-white'
          : 'border-prestige-beige bg-white text-dark'
      }`}
    >
      <p
        className={`font-heading font-semibold leading-snug [overflow-wrap:anywhere] ${
          compact ? 'text-sm' : 'text-sm sm:text-base'
        }`}
      >
        {node.label}
      </p>
      {node.hint ? (
        <p
          className={`mt-1 leading-snug [overflow-wrap:anywhere] ${compact ? 'text-[11px]' : 'text-xs'} ${
            emphasis ? 'text-white/65' : 'text-slate-500'
          }`}
        >
          {node.hint}
        </p>
      ) : null}
    </div>
  );
}

function EdgeLabel({ label, vertical = false }) {
  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-1 py-2">
        <ArrowDown className="h-4 w-4 shrink-0 text-prestige-taupe" />
        {label ? (
          <p className="max-w-[min(100%,20rem)] px-2 text-center text-[11px] font-medium leading-snug text-prestige-taupe">
            {label}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-10 shrink-0 flex-col items-center justify-center gap-1 px-0.5 sm:w-12">
      {label ? (
        <p className="max-w-[4.5rem] text-center text-[9px] font-medium leading-tight text-prestige-taupe sm:text-[10px]">
          {label}
        </p>
      ) : null}
      <ArrowRight className="h-4 w-4 shrink-0 text-prestige-taupe" />
    </div>
  );
}

function FlowSteps({ nodes, edgeByFrom, compact, orientation }) {
  const vertical = orientation === 'vertical';

  return (
    <div
      className={
        vertical
          ? 'flex flex-col'
          : 'flex min-w-max items-stretch'
      }
    >
      {nodes.map((node, i) => {
        const edge = edgeByFrom[node.id];
        return (
          <div
            key={node.id}
            className={
              vertical
                ? undefined
                : 'flex items-stretch'
            }
          >
            <div
              className={
                vertical
                  ? undefined
                  : 'w-[11.5rem] shrink-0 sm:w-[12.5rem]'
              }
            >
              <NodeCard node={node} compact={compact} />
            </div>
            {i < nodes.length - 1 ? (
              vertical ? (
                <EdgeLabel label={edge?.label} vertical />
              ) : (
                <div className="flex items-center">
                  <EdgeLabel label={edge?.label} />
                </div>
              )
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function FlowDiagram({ diagram, compact }) {
  const { nodes, edges } = diagram;
  const edgeByFrom = Object.fromEntries((edges || []).map((e) => [e.from, e]));
  /** Au-delà de 3 étapes, le horizontal force trop l’écrasement sur une colonne de contenu. */
  const preferVertical = nodes.length > 3;

  if (preferVertical) {
    return (
      <FlowSteps
        nodes={nodes}
        edgeByFrom={edgeByFrom}
        compact={compact}
        orientation="vertical"
      />
    );
  }

  return (
    <>
      <div className="lg:hidden">
        <FlowSteps
          nodes={nodes}
          edgeByFrom={edgeByFrom}
          compact={compact}
          orientation="vertical"
        />
      </div>
      <div className="hidden overflow-x-auto pb-1 lg:block [-ms-overflow-style:none] [scrollbar-width:thin]">
        <FlowSteps
          nodes={nodes}
          edgeByFrom={edgeByFrom}
          compact={compact}
          orientation="horizontal"
        />
      </div>
    </>
  );
}

const FORK_COUNT_LABELS = {
  2: 'Deux voies',
  3: 'Trois voies',
  4: 'Quatre voies',
};

function forkSplitLabel(count) {
  return FORK_COUNT_LABELS[count] || `${count} voies`;
}

function forkGridClass(count) {
  if (count <= 2) return 'sm:grid-cols-2';
  if (count === 3) return 'sm:grid-cols-3';
  if (count === 4) return 'sm:grid-cols-2 lg:grid-cols-4';
  return 'sm:grid-cols-2 lg:grid-cols-3';
}

function ForkDiagram({ diagram, compact }) {
  const { source, branches } = diagram;
  const count = branches.length;
  return (
    <div className="flex flex-col items-stretch gap-0">
      <div className="mx-auto w-full max-w-md">
        <NodeCard node={source} compact={compact} />
      </div>

      <div className="flex justify-center py-2 md:py-3">
        <div className="flex flex-col items-center gap-1">
          <ArrowDown className="h-4 w-4 text-prestige-taupe" />
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-prestige-taupe">
            {forkSplitLabel(count)}
          </span>
        </div>
      </div>

      <div className={`grid gap-3 sm:gap-4 ${forkGridClass(count)}`}>
        {branches.map((branch) => (
          <div key={branch.id} className="flex flex-col">
            {branch.edgeLabel ? (
              <p className="mb-2 text-center text-[11px] font-medium text-prestige-taupe">
                {branch.edgeLabel}
              </p>
            ) : null}
            <NodeCard node={branch} compact={compact} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Schéma conceptuel d’une mini-formation (flux ou fourche).
 * variant: 'hero' | 'inline' | 'thumb'
 */
export function FormationConceptDiagram({
  formationId,
  diagram: diagramProp,
  /** 'concept' | 'example' — example utilise exampleDiagram si dispo */
  mode = 'concept',
  variant = 'hero',
  className = '',
}) {
  const diagram =
    diagramProp ||
    (mode === 'example'
      ? getFormationExampleDiagram(formationId) || getFormationDiagram(formationId)
      : getFormationDiagram(formationId));
  if (!diagram) return null;

  const compact = variant === 'thumb' || variant === 'inline';
  const pad = variant === 'hero' ? 'p-5 md:p-7' : variant === 'inline' ? 'p-5 md:p-6' : 'p-3';

  return (
    <figure
      className={`border border-prestige-beige/90 bg-zinc-50/80 ${pad} ${className}`}
      data-testid={`formation-diagram-${formationId || 'x'}`}
    >
      {variant !== 'thumb' ? (
        <figcaption className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">
          {diagram.title}
        </figcaption>
      ) : null}

      {diagram.type === 'fork' ? (
        <ForkDiagram diagram={diagram} compact={compact} />
      ) : (
        <FlowDiagram diagram={diagram} compact={compact} />
      )}
    </figure>
  );
}
