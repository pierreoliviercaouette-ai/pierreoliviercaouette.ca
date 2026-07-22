import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { useFaqSchema, useSeoMeta } from '../lib/seo';

function SeoPage({ title, description, canonicalPath, h1, intro, sections, faqItems = [] }) {
  useSeoMeta({ title, description, canonicalPath });
  useFaqSchema(faqItems);

  return (
    <main className="min-h-screen bg-white" data-testid="seo-landing-page">
      <PageHero
        badge="Guide"
        title={h1}
        description={intro}
        minHeightClass="min-h-[50vh] md:min-h-[58vh]"
      />

      <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />

        <article className="container-max max-w-4xl relative space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-prestige-beige hover:shadow-xl transition-shadow duration-300">
                <h2 className="font-heading text-2xl font-bold text-dark mb-4">{s.heading}</h2>
                {s.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-prestige-taupe leading-relaxed mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
            <div className="relative px-6 py-10 md:px-10 md:py-12 text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                Prochaine étape
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
                Obtenez une stratégie personnalisée selon votre situation familiale, votre budget
                et vos objectifs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/rendez-vous"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-primary rounded-full px-8 py-3 font-semibold shadow-lg hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center border-2 border-white/35 text-white rounded-full px-8 py-3 font-semibold hover:bg-white/10 transition-colors"
                >
                  Voir tous les services
                </Link>
              </div>
            </div>
          </div>

          {faqItems.length > 0 && (
            <section className="pt-2">
              <h2 className="font-heading text-2xl font-bold text-dark mb-6 text-center">
                Questions fréquentes
              </h2>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="bg-white rounded-xl p-5 md:p-6 shadow-md border border-prestige-beige"
                  >
                    <h3 className="font-heading font-semibold text-dark mb-2">{item.question}</h3>
                    <p className="text-prestige-taupe leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </section>
    </main>
  );
}

export const ConseillerFinancierVictoriaville = () => (
  <SeoPage
    title="Conseiller en sécurité financière à Victoriaville | Pierre-Olivier Caouette"
    description="Conseiller en sécurité financière à Victoriaville : assurance vie, retraite, REER, CELI et planification financière personnalisée au Québec."
    canonicalPath="/conseiller-financier-victoriaville"
    h1="Conseiller en sécurité financière à Victoriaville"
    intro="Accompagnement humain et personnalisé pour protéger votre famille, optimiser vos placements et préparer votre retraite. Titre autorisé : conseiller en sécurité financière (registre AMF)."
    sections={[
      {
        heading: 'Pourquoi consulter un conseiller en sécurité financière',
        paragraphs: [
          "Un conseiller en sécurité financière vous aide à prendre des décisions structurées plutôt que réactives. L'objectif est de relier vos priorités de vie à un plan concret : protection, épargne, fiscalité et retraite.",
          "À Victoriaville, plusieurs familles cherchent un accompagnement local, accessible et cohérent avec la réalité du Québec. C'est exactement la valeur d'un suivi personnalisé.",
        ],
      },
      {
        heading: 'Services les plus demandés',
        paragraphs: [
          "Les demandes les plus fréquentes concernent l'assurance vie, l'assurance invalidité, l'optimisation REER/CELI et la planification de retraite.",
          "Chaque recommandation est adaptée à votre profil de risque, votre horizon et votre capacité d'épargne mensuelle.",
        ],
      },
      {
        heading: 'Approche locale et transparente',
        paragraphs: [
          "La démarche commence par une analyse simple : revenus, dépenses, dettes, objectifs et niveau de protection actuel.",
          'Vous obtenez ensuite un plan clair avec des priorités, des montants cibles et des points de suivi pour garder le cap.',
        ],
      },
    ]}
  />
);

export const RecommanderConseillerFinancier = () => (
  <SeoPage
    title="Recommander un conseiller en sécurité financière | Victoriaville"
    description="Pourquoi et comment recommander un conseiller en sécurité financière à Victoriaville. Conseils pratiques pour bien orienter un proche vers un accompagnement adapté."
    canonicalPath="/recommander-conseiller-financier"
    h1="Recommander un conseiller en sécurité financière à Victoriaville"
    intro="Quand un proche cherche de l'aide pour ses assurances, son épargne ou sa retraite, une bonne recommandation peut faire une vraie différence."
    sections={[
      {
        heading: 'Pourquoi recommander un professionnel inscrit',
        paragraphs: [
          "Un accompagnement professionnel aide à éviter des décisions coûteuses et à mettre de l'ordre dans les priorités financières.",
          "Recommander un conseiller en sécurité financière, c'est surtout aider un proche à obtenir de la clarté, de la structure et un plan adapté à sa réalité.",
        ],
      },
      {
        heading: 'Comment choisir le bon conseiller',
        paragraphs: [
          "Vérifiez l'inscription au registre de l'AMF, l'approche pédagogique, la transparence et la capacité à expliquer simplement les options.",
          "Un bon conseiller prend le temps d'écouter, pose des questions précises et propose des pistes concrètes selon les objectifs.",
        ],
      },
      {
        heading: 'Avantages pour la personne recommandée',
        paragraphs: [
          'La personne recommandée obtient une analyse personnalisée de sa situation : protection, épargne, fiscalité et retraite.',
          'Elle peut ensuite prendre des décisions éclairées avec une vision long terme, sans improvisation.',
        ],
      },
    ]}
    faqItems={[
      {
        question: 'Quand faut-il consulter un conseiller en sécurité financière?',
        answer:
          "Dès qu'il y a une décision importante : assurance, achat de maison, naissance, optimisation REER/CELI ou préparation de la retraite.",
      },
      {
        question: 'Comment savoir si un conseiller est légitime?',
        answer:
          "Validez son inscription au registre de l'AMF, son titre autorisé et sa capacité à expliquer clairement les recommandations.",
      },
      {
        question: "Est-ce qu'un conseiller vaut la peine?",
        answer:
          'Oui, lorsque vous voulez structurer vos décisions et éviter les erreurs qui coûtent cher sur plusieurs années.',
      },
    ]}
  />
);

export const AssuranceVieVictoriaville = () => (
  <SeoPage
    title="Assurance vie à Victoriaville | Conseiller en sécurité financière"
    description="Assurance vie à Victoriaville : comparez les options temporaire et permanente pour protéger votre famille et vos obligations financières."
    canonicalPath="/assurance-vie-victoriaville"
    h1="Assurance vie à Victoriaville"
    intro="Protéger vos proches avec une couverture adaptée à votre hypothèque, vos enfants et vos objectifs successoraux."
    sections={[
      {
        heading: 'Assurance vie temporaire ou permanente',
        paragraphs: [
          "L'assurance temporaire est souvent privilégiée pour couvrir une période précise : hypothèque, enfants à charge, obligations financières.",
          "L'assurance permanente peut convenir à la planification successorale ou à une protection à long terme.",
        ],
      },
      {
        heading: 'Comment déterminer le bon montant',
        paragraphs: [
          'Le montant dépend de vos dettes, du revenu à remplacer, des études des enfants et des actifs déjà disponibles.',
          "Un calcul détaillé permet d'éviter autant la sous-protection que la sur-assurance.",
        ],
      },
      {
        heading: 'Planifier sans complexité inutile',
        paragraphs: [
          "Un bon plan d'assurance vie reste compréhensible : objectifs, budget, montant, durée et revue périodique.",
          'Avec une révision annuelle, votre couverture évolue au rythme de votre vie.',
        ],
      },
    ]}
  />
);

export const AssuranceInvaliditeQuebec = () => (
  <SeoPage
    title="Assurance invalidité au Québec | Protection du revenu"
    description="Assurance invalidité au Québec : protégez votre revenu en cas de maladie ou d'accident et maintenez votre stabilité financière."
    canonicalPath="/assurance-invalidite-quebec"
    h1="Assurance invalidité au Québec"
    intro="Votre revenu est votre actif principal. L'assurance invalidité protège votre budget si vous ne pouvez plus travailler temporairement ou durablement."
    sections={[
      {
        heading: 'Pourquoi cette protection est essentielle',
        paragraphs: [
          "Une incapacité de travail peut survenir plus souvent qu'on le croit. Sans filet adéquat, les paiements courants deviennent rapidement une pression.",
          'La protection du revenu permet de garder une stabilité pendant la convalescence.',
        ],
      },
      {
        heading: 'Éléments à vérifier dans un contrat',
        paragraphs: [
          'Les points clés sont le délai de carence, le pourcentage de revenu couvert, la durée des prestations et les exclusions.',
          'Une analyse personnalisée aide à choisir une protection réaliste selon votre profession et vos obligations.',
        ],
      },
      {
        heading: 'Travailleurs autonomes et professionnels',
        paragraphs: [
          "Les travailleurs autonomes sont souvent plus exposés, car ils n'ont pas toujours de régime collectif complet.",
          "Une stratégie mixte peut inclure fonds d'urgence, assurance invalidité et ajustements budgétaires.",
        ],
      },
    ]}
  />
);

export const PlanificationFinanciereQuebec = () => (
  <SeoPage
    title="Planification financière au Québec | Stratégie personnalisée"
    description="Planification financière au Québec : structurez vos objectifs de retraite, protection et épargne avec un plan clair et évolutif."
    canonicalPath="/planification-financiere-quebec"
    h1="Planification financière au Québec"
    intro="Un plan financier concret pour transformer vos objectifs en actions mesurables : protection, épargne et retraite."
    sections={[
      {
        heading: 'Une vision complète de vos finances',
        paragraphs: [
          'La planification financière ne se limite pas aux placements. Elle relie votre cash flow, vos protections, votre fiscalité et vos projets de vie.',
          'Le but est de prendre des décisions cohérentes entre court, moyen et long terme.',
        ],
      },
      {
        heading: "REER, CELI et priorités d'épargne",
        paragraphs: [
          'Selon votre revenu et votre horizon, la répartition REER/CELI peut changer significativement vos résultats nets.',
          'Une stratégie efficace tient compte du taux marginal actuel, de la retraite ciblée et de la flexibilité souhaitée.',
        ],
      },
      {
        heading: 'Suivi et ajustements',
        paragraphs: [
          'Un plan utile est un plan vivant : il doit être révisé quand votre revenu, votre famille ou vos priorités changent.',
          'Les ajustements périodiques sont souvent la différence entre une bonne intention et un résultat concret.',
        ],
      },
    ]}
  />
);
