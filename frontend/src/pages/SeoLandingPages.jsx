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
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">Prochaine étape</h2>
              <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
                Obtenez une stratégie personnalisée selon votre situation familiale, votre budget et vos objectifs.
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
              <h2 className="font-heading text-2xl font-bold text-dark mb-6 text-center">Questions fréquentes</h2>
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
    title="Conseiller financier a Victoriaville | Pierre-Olivier Caouette"
    description="Conseiller financier a Victoriaville: assurance vie, retraite, REER, CELI et planification financiere personnalisee au Quebec."
    canonicalPath="/conseiller-financier-victoriaville"
    h1="Conseiller financier a Victoriaville"
    intro="Un accompagnement humain et personnalise pour proteger votre famille, optimiser vos placements et preparer votre retraite."
    sections={[
      {
        heading: 'Pourquoi consulter un conseiller financier',
        paragraphs: [
          "Un conseiller financier vous aide a prendre des decisions structurees plutot que reactives. L'objectif est de relier vos priorites de vie a un plan concret: protection, epargne, fiscalite et retraite.",
          "A Victoriaville, plusieurs familles cherchent un accompagnement local, accessible et coherent avec la realite du Quebec. C'est exactement la valeur d'un suivi personnalise."
        ]
      },
      {
        heading: 'Services les plus demandes',
        paragraphs: [
          "Les demandes les plus frequentes concernent l'assurance vie, l'assurance invalidite, l'optimisation REER/CELI et la planification de retraite.",
          "Chaque recommendation est adaptee a votre profil de risque, votre horizon et votre capacite d'epargne mensuelle."
        ]
      },
      {
        heading: 'Approche locale et transparente',
        paragraphs: [
          "La demarche commence par une analyse simple: revenus, depenses, dettes, objectifs et niveau de protection actuel.",
          "Vous obtenez ensuite un plan clair avec des priorites, des montants cibles et des points de suivi pour garder le cap."
        ]
      }
    ]}
  />
);

export const RecommanderConseillerFinancier = () => (
  <SeoPage
    title="Recommander un conseiller financier | Victoriaville"
    description="Pourquoi et comment recommander un conseiller financier a Victoriaville. Conseils pratiques pour bien orienter un proche vers un accompagnement adapte."
    canonicalPath="/recommander-conseiller-financier"
    h1="Recommander un conseiller financier a Victoriaville"
    intro="Quand un proche cherche de l'aide pour ses assurances, son epargne ou sa retraite, une bonne recommandation peut faire une vraie difference."
    sections={[
      {
        heading: 'Pourquoi recommander un conseiller financier',
        paragraphs: [
          "Un accompagnement professionnel aide a eviter des decisions couteuses et a mettre de l'ordre dans les priorites financieres.",
          "Recommander un conseiller, c'est surtout aider un proche a obtenir de la clarte, de la structure et un plan adapte a sa realite."
        ]
      },
      {
        heading: 'Comment choisir le bon conseiller',
        paragraphs: [
          "Verifiez la certification, l'approche pedagogique, la transparence et la capacite a expliquer simplement les options.",
          "Un bon conseiller prend le temps d'ecouter, pose des questions precises et propose des pistes concretes selon les objectifs."
        ]
      },
      {
        heading: 'Avantages pour la personne recommandee',
        paragraphs: [
          "La personne recommandee obtient une analyse personnalisee de sa situation: protection, epargne, fiscalite et retraite.",
          "Elle peut ensuite prendre des decisions eclairees avec une vision long terme, sans improvisation."
        ]
      }
    ]}
    faqItems={[
      {
        question: 'Quand faut-il consulter un conseiller financier?',
        answer: 'Des qu il y a une decision importante: assurance, achat de maison, naissance, optimisation REER/CELI ou preparation de la retraite.'
      },
      {
        question: 'Comment savoir si un conseiller est legitime?',
        answer: 'Validez sa certification, son inscription professionnelle et sa capacite a expliquer clairement les recommandations.'
      },
      {
        question: 'Est-ce qu un conseiller vaut la peine?',
        answer: 'Oui, lorsque vous voulez structurer vos decisions et eviter les erreurs qui coutent cher sur plusieurs annees.'
      }
    ]}
  />
);

export const AssuranceVieVictoriaville = () => (
  <SeoPage
    title="Assurance vie a Victoriaville | Conseiller en securite financiere"
    description="Assurance vie a Victoriaville: comparez les options temporaire et permanente pour proteger votre famille et vos obligations financieres."
    canonicalPath="/assurance-vie-victoriaville"
    h1="Assurance vie a Victoriaville"
    intro="Proteger vos proches avec une couverture adaptee a votre hypothèque, vos enfants et vos objectifs successoraux."
    sections={[
      {
        heading: 'Assurance vie temporaire ou permanente',
        paragraphs: [
          "L'assurance temporaire est souvent privilegiee pour couvrir une periode precise: hypotheque, enfants a charge, obligations financieres.",
          "L'assurance permanente peut convenir a la planification successorale ou a une protection a long terme."
        ]
      },
      {
        heading: 'Comment determiner le bon montant',
        paragraphs: [
          "Le montant depend de vos dettes, du revenu a remplacer, des etudes des enfants et des actifs deja disponibles.",
          "Un calcul detaille permet d'eviter autant la sous-protection que la sur-assurance."
        ]
      },
      {
        heading: 'Planifier sans complexite inutile',
        paragraphs: [
          "Un bon plan d'assurance vie reste comprehensible: objectifs, budget, montant, duree et revue periodique.",
          "Avec une revision annuelle, votre couverture evolue au rythme de votre vie."
        ]
      }
    ]}
  />
);

export const AssuranceInvaliditeQuebec = () => (
  <SeoPage
    title="Assurance invalidite au Quebec | Protection du revenu"
    description="Assurance invalidite au Quebec: protegez votre revenu en cas de maladie ou accident et maintenez votre stabilite financiere."
    canonicalPath="/assurance-invalidite-quebec"
    h1="Assurance invalidite au Quebec"
    intro="Votre revenu est votre actif principal. L'assurance invalidite protege votre budget si vous ne pouvez plus travailler temporairement ou durablement."
    sections={[
      {
        heading: 'Pourquoi cette protection est essentielle',
        paragraphs: [
          "Une incapacite de travail peut survenir plus souvent qu'on le croit. Sans filet adequat, les paiements courants deviennent rapidement une pression.",
          "La protection du revenu permet de garder une stabilite pendant la convalescence."
        ]
      },
      {
        heading: 'Elements a verifier dans un contrat',
        paragraphs: [
          "Les points cles sont le delai de carence, le pourcentage de revenu couvert, la duree des prestations et les exclusions.",
          "Une analyse personnalisee aide a choisir une protection realiste selon votre profession et vos obligations."
        ]
      },
      {
        heading: 'Travailleurs autonomes et professionnels',
        paragraphs: [
          "Les travailleurs autonomes sont souvent plus exposes, car ils n'ont pas toujours de regime collectif complet.",
          "Une strategie mixte peut inclure fonds d'urgence, assurance invalidite et ajustements budgetaires."
        ]
      }
    ]}
  />
);

export const PlanificationFinanciereQuebec = () => (
  <SeoPage
    title="Planification financiere au Quebec | Strategie personnalisee"
    description="Planification financiere au Quebec: structurez vos objectifs de retraite, protection et epargne avec un plan clair et evolutif."
    canonicalPath="/planification-financiere-quebec"
    h1="Planification financiere au Quebec"
    intro="Un plan financier concret pour transformer vos objectifs en actions mesurables: protection, epargne et retraite."
    sections={[
      {
        heading: 'Une vision complete de vos finances',
        paragraphs: [
          "La planification financiere ne se limite pas aux placements. Elle relie votre cash flow, vos protections, votre fiscalite et vos projets de vie.",
          "Le but est de prendre des decisions coherentes entre court, moyen et long terme."
        ]
      },
      {
        heading: 'REER, CELI et priorites d epargne',
        paragraphs: [
          "Selon votre revenu et votre horizon, la repartition REER/CELI peut changer significativement vos resultats nets.",
          "Une strategie efficace tient compte du taux marginal actuel, de la retraite ciblee et de la flexibilite souhaitée."
        ]
      },
      {
        heading: 'Suivi et ajustements',
        paragraphs: [
          "Un plan utile est un plan vivant: il doit etre revise quand votre revenu, votre famille ou vos priorites changent.",
          "Les ajustements periodiques sont souvent la difference entre une bonne intention et un resultat concret."
        ]
      }
    ]}
  />
);
