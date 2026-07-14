import { Link } from 'react-router-dom';

export const Privacy = () => {
  return (
    <main className="min-h-screen bg-white" data-testid="privacy-page">
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="font-heading text-4xl font-bold text-dark mb-8">
              Politique de confidentialité
            </h1>
            
            <p className="text-slate-600 mb-6">
              Dernière mise à jour : 2026-05-06
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              1. Collecte des informations
            </h2>
            <p className="text-slate-600 mb-4">
              Nous collectons les informations que vous nous fournissez directement, notamment:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Nom et prénom</li>
              <li>Adresse courriel</li>
              <li>Numéro de téléphone (requis pour les demandes de recommandation)</li>
              <li>Informations saisies dans nos outils financiers</li>
              <li>Messages envoyés via nos formulaires de contact</li>
            </ul>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              2. Utilisation des informations
            </h2>
            <p className="text-slate-600 mb-4">
              Vos informations sont utilisées pour:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Répondre à vos demandes et questions</li>
              <li>Vous fournir nos services de conseil financier</li>
              <li>Sauvegarder l'historique de vos calculs dans les outils</li>
              <li>Gérer le programme de référencement</li>
              <li>Améliorer nos services</li>
            </ul>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              3. Protection des données
            </h2>
            <p className="text-slate-600 mb-6">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos 
              informations personnelles contre tout accès non autorisé, modification, divulgation 
              ou destruction. Vos données sont stockées de manière sécurisée et ne sont accessibles 
              qu'aux personnes autorisées.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              4. Partage des informations
            </h2>
            <p className="text-slate-600 mb-6">
              Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des 
              tiers sans votre consentement, sauf dans les cas requis par la loi ou pour fournir 
              nos services.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              5. Vos droits
            </h2>
            <p className="text-slate-600 mb-4">
              Conformément à la loi québécoise sur la protection des renseignements personnels, 
              vous avez le droit de:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Accéder à vos informations personnelles</li>
              <li>Rectifier vos informations</li>
              <li>Demander la suppression de vos données</li>
              <li>Retirer votre consentement</li>
            </ul>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              6. Contact
            </h2>
            <p className="text-slate-600 mb-6">
              Pour toute question concernant cette politique de confidentialité ou pour exercer 
              vos droits, veuillez nous contacter à:
            </p>
            <p className="text-slate-600 mb-6">
              <strong>Courriel:</strong> po@pierreoliviercaouette.ca<br/>
              <strong>Téléphone:</strong> 819 806-1164
            </p>

            <div className="mt-12">
              <Link to="/" className="text-primary font-medium hover:underline">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export const Terms = () => {
  return (
    <main className="min-h-screen bg-white" data-testid="terms-page">
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="font-heading text-4xl font-bold text-dark mb-8">
              Conditions d'utilisation
            </h1>
            
            <p className="text-slate-600 mb-6">
              Dernière mise à jour : 2026-05-06
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              1. Acceptation des conditions
            </h2>
            <p className="text-slate-600 mb-6">
              En accédant et en utilisant ce site web, vous acceptez d'être lié par les présentes 
              conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas 
              utiliser ce site.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              2. Services offerts
            </h2>
            <p className="text-slate-600 mb-6">
              Ce site présente les services de conseil en sécurité financière offerts par 
              Pierre-Olivier Caouette. Les informations présentées sont à titre informatif 
              et ne constituent pas des conseils financiers personnalisés.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              3. Outils financiers
            </h2>
            <p className="text-slate-600 mb-6">
              Les outils de calcul disponibles sur ce site sont fournis à titre indicatif 
              seulement. Les résultats ne garantissent pas les rendements futurs et ne 
              remplacent pas une consultation professionnelle personnalisée.
            </p>

            <h2 id="reglement-concours" className="font-heading text-2xl font-semibold text-dark mt-8 mb-4 scroll-mt-28">
              4. Programme de référencement
            </h2>
            <p className="text-slate-600 mb-4">
              Le programme de référencement est soumis aux conditions suivantes:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Les points sont accordés après vérification interne des actions admissibles</li>
              <li>Chaque action vérifiée donne 1 point (référence qualifiée, avis Google vérifié, client existant vérifié)</li>
              <li>Aucune obligation d'achat ou de souscription n'est requise de la part du référé</li>
              <li>Les points s'accumulent du 1er janvier au 31 décembre et sont conservés toute l'année</li>
              <li>Le premier tirage du programme est prévu le 1er octobre 2026</li>
              <li>Un participant devient admissible au concours trimestriel à partir de 5 points</li>
              <li>Pour chaque tirage trimestriel, chaque point équivaut à 1 chance de participation</li>
              <li>La valeur du tirage trimestriel est d'environ 750 $</li>
              <li>Pierre-Olivier Caouette se réserve le droit de qualifier ou rejeter une participation non conforme</li>
              <li>Les conditions du programme peuvent être modifiées à tout moment</li>
            </ul>
            <p className="text-slate-600 mb-4">
              <strong>Admissibilité et exclusions :</strong>
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Le participant doit être résident du Québec et majeur au moment de la participation</li>
              <li>Les auto-références et les références fictives, incomplètes ou dupliquées sont refusées</li>
              <li>Une même personne référée ne peut être comptabilisée qu'une seule fois par participant</li>
              <li>Les participations non conformes, frauduleuses ou contraires aux règles peuvent être annulées</li>
              <li>Les exclusions légales applicables aux concours promotionnels au Québec s'appliquent</li>
            </ul>
            <p className="text-slate-600 mb-6">
              Le gagnant du tirage est contacté selon les coordonnées fournies au dossier. Si le gagnant ne peut être joint dans un délai raisonnable
              ou ne respecte pas les conditions d'admissibilité, un nouveau tirage peut être effectué.
            </p>
            <p className="text-slate-600 mb-6">
              Ce concours est organisé et administré exclusivement par Pierre-Olivier Caouette, à titre de promotion indépendante de son programme de
              recommandations. Le concours n'est ni commandité, ni approuvé, ni administré par Industrielle Alliance, et n'y est pas associé.
            </p>
            <p className="text-slate-600 mb-6">
              En cas de divergence entre un contenu promotionnel et le présent règlement, le présent règlement prévaut. Toute contestation est régie par
              les lois applicables du Québec et du Canada, et relève des tribunaux compétents du district judiciaire applicable au Québec.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              5. Limitation de responsabilité
            </h2>
            <p className="text-slate-600 mb-6">
              Les informations présentées sur ce site sont de nature générale. Chaque situation 
              étant unique, il est recommandé de consulter un conseiller qualifié avant de 
              prendre toute décision financière. Les produits d'assurance et de placement 
              comportent des risques et ne conviennent pas à tous les profils.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              5.1 Fonds distincts et illustrations de portefeuilles
            </h2>
            <p className="text-slate-600 mb-4">
              Les fonds distincts sont des produits d&apos;assurance offerts par contrat
              d&apos;assurance (et non des dépôts bancaires ni des fonds communs de placement
              classiques). Tout affichage de rendements, de compositions ou d&apos;illustrations
              de portefeuilles modèles sur ce site, y compris via un outil interne
              d&apos;administration, est fourni à titre indicatif seulement.
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Les rendements passés ne garantissent pas les rendements futurs.</li>
              <li>
                Les garanties contractuelles éventuelles (ex. au décès ou à l&apos;échéance)
                ne s&apos;appliquent pas à la valeur marchande courante, qui fluctue.
              </li>
              <li>
                Les moyennes pondérées ou recalculs internes ne constituent pas un rendement
                officiel de compte ni une publication de l&apos;assureur.
              </li>
              <li>
                Ces contenus ne constituent pas un conseil personnalisé ni une recommandation
                d&apos;achat ; une analyse de la situation est requise avant toute souscription.
              </li>
            </ul>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              6. Propriété intellectuelle
            </h2>
            <p className="text-slate-600 mb-6">
              Le contenu de ce site, incluant les textes, images et outils, est protégé par 
              les lois sur la propriété intellectuelle. Toute reproduction sans autorisation 
              est interdite.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              7. Modifications
            </h2>
            <p className="text-slate-600 mb-6">
              Nous nous réservons le droit de modifier ces conditions à tout moment. 
              Les modifications prennent effet dès leur publication sur ce site.
            </p>

            <h2 className="font-heading text-2xl font-semibold text-dark mt-8 mb-4">
              8. Droit applicable
            </h2>
            <p className="text-slate-600 mb-6">
              Ces conditions sont régies par les lois du Québec, Canada.
            </p>

            <div className="mt-12">
              <Link to="/" className="text-primary font-medium hover:underline">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
