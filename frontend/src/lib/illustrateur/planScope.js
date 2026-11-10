/** Portée du dossier : active/masque onglets et questions associées. */

export function emptyScope() {
  return {
    conjoint: false,
    corporatif: false,
  };
}

export function emptySpouse() {
  return {
    firstName: '',
    lastName: '',
    birthYear: '',
    sex: 'F',
  };
}

/** Migre person.planType → scope.conjoint si scope absent. */
export function ensureScope(plan) {
  const base = emptyScope();
  const incoming = plan?.scope;
  if (incoming && typeof incoming === 'object') {
    return {
      conjoint: Boolean(incoming.conjoint),
      corporatif: Boolean(incoming.corporatif),
    };
  }
  return {
    ...base,
    conjoint: plan?.person?.planType === 'conjoint',
  };
}

export function planHasConjoint(plan) {
  return ensureScope(plan).conjoint;
}

export function planHasCorporate(plan) {
  return ensureScope(plan).corporatif;
}

export function scopeMatchesRequires(scope, requires) {
  if (!requires || requires.length === 0) return true;
  return requires.every((key) => Boolean(scope?.[key]));
}
