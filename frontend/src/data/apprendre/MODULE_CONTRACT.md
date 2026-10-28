# Contrat module Apprendre

Chaque fichier `modules/<id>.js` exporte **un seul objet** `module` (named export).

```js
export const module = {
  id: 'celi', // slug fixe
  audiences: ['particulier'], // et/ou 'prive'
  category: 'epargne' | 'placements' | 'assurance' | 'corpo',
  title: string,
  subtitle: string,
  shortDescription: string, // 1–2 phrases, ton prospect
  readMinutes: number, // 12–18
  keyFacts: [{ label, value }], // 3 faits
  sections: [
    {
      heading: string,
      paragraphs?: string[],
      bullets?: string[],
    },
  ],
  // Obligatoire — exemple chiffré réaliste (règles actuelles, sans inventer de plafonds faux)
  workedExample: {
    title: string,
    intro: string,
    steps: [{ label: string, detail: string }],
    result: string,
  },
  takeaways: string[], // 4–6 points
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: string,
        prompt: string,
        choices: [string, string, string],
        correctIndex: 0 | 1 | 2,
        explanation: string,
      },
    ], // exactement 3, idéalement basées sur l’exemple chiffré
  },
  diagram: {
    title: string,
    type: 'flow' | 'fork',
    // flow:
    nodes?: [{ id, label, hint?, emphasis? }],
    edges?: [{ from, to, label? }],
    // fork:
    source?: { id, label, hint? },
    branches?: [{ id, label, hint?, edgeLabel? }],
  },
  // Schéma de l’exemple chiffré (labels avec montants)
  exampleDiagram: { /* même forme que diagram */ },
  // Ligne du temps + graphique chiffré (Recharts) — montants de l’exemple seulement
  timeline: {
    title: string,
    caption?: string,
    events?: [{ at, title, amount?, note?, emphasis? }],
    chart?: {
      type?: 'line' | 'bar',
      series: [{ key, name, color? }],
      points: [{ at, [key]: number }],
    },
  },
  sources: [{ name: string, url: string }], // AMF, ARC, Revenu Québec, IQPF, ia.ca, etc.
  relatedServiceIds: string[],
  relatedFormationIds: string[],
  seoTitle: string,
  seoDescription: string,
};
```

Ton : éducatif institutionnel, vouvoiement, pas de conseil personnalisé, jargon expliqué.
Ne pas figer un plafond annuel sans le dater (« en 2026 : … ; vérifiez l’ARC »).
