import { ExternalLink, Shield } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import {
  AMF_REGISTRE_URL,
  IA_AUTO_HABITATION_LOGO,
  IA_AUTO_HABITATION_URL,
  IA_GROUPE_FINANCIER_LOGO,
  IA_GROUPE_FINANCIER_URL,
  TUGO_ASSURANCE_VOYAGE_URL,
  TUGO_LOGO_URL,
} from '../../lib/branding';

const PARTNERS = [
  {
    id: 'amf',
    href: AMF_REGISTRE_URL,
    linkText: 'Consulter le registre AMF',
    title: 'Autorité des marchés financiers',
    description: 'Vérification de l’autorisation d’exercer au Québec.',
    isAmf: true,
  },
  {
    id: 'ia-groupe',
    href: IA_GROUPE_FINANCIER_URL,
    linkText: 'Site iA Groupe financier',
    title: 'iA Groupe financier',
    description: 'Réseau de distribution et produits financiers.',
    logo: IA_GROUPE_FINANCIER_LOGO,
    logoAlt: 'iA Groupe financier',
  },
  {
    id: 'iaah',
    href: IA_AUTO_HABITATION_URL,
    linkText: 'iA Auto et Habitation',
    title: 'iA Auto et Habitation',
    description: 'Auto, habitation et petits véhicules.',
    logo: IA_AUTO_HABITATION_LOGO,
    logoAlt: 'iA Auto et Habitation',
  },
  {
    id: 'tugo',
    href: TUGO_ASSURANCE_VOYAGE_URL,
    linkText: 'Tugo Assurance Voyage',
    title: 'Tugo',
    description: 'Assurance voyage partenaire iA.',
    logo: TUGO_LOGO_URL,
    logoAlt: 'Tugo Assurance Voyage',
  },
];

/**
 * Bloc « Partenaires de confiance » : logos + liens explicites vers sites officiels.
 */
export function PartnersTrustSection({ sectionClassName = '' }) {
  return (
    <section className={sectionClassName} data-testid="partners-section">
      <div className="container-max">
        <h2 className="font-heading text-center text-2xl font-bold text-dark md:text-3xl">Partenaires de confiance</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
          Accès directs aux partenaires et au registre officiel — cliquez sur le libellé pour ouvrir le site.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-600">
          Ces liens sont fournis à titre informatif. Les concours et promotions du site sont organisés par Pierre-Olivier Caouette.
        </p>

        <ul className="mx-auto mt-10 grid max-w-5xl list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNERS.map((p) => (
            <li
              key={p.id}
              className="flex flex-col rounded-2xl border border-prestige-beige/90 bg-white p-5 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              {p.isAmf ? (
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Shield className="h-7 w-7" aria-hidden />
                </div>
              ) : (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-auto flex min-h-[48px] max-w-[200px] items-center justify-center grayscale transition-all duration-300 hover:scale-[1.03] hover:grayscale-0"
                  onClick={() =>
                    trackEvent('select_content', { content_type: 'external_link', item_id: `partners_logo_${p.id}` })
                  }
                  aria-label={p.logoAlt}
                >
                  <img src={p.logo} alt="" className="max-h-11 w-auto object-contain" />
                </a>
              )}
              <p className="mt-3 font-heading text-sm font-semibold text-dark">{p.title}</p>
              <p className="mt-1 flex-1 text-xs leading-snug text-slate-600">{p.description}</p>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-dark"
                onClick={() =>
                  trackEvent('select_content', { content_type: 'external_link', item_id: `partners_link_${p.id}` })
                }
              >
                {p.linkText}
                <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
