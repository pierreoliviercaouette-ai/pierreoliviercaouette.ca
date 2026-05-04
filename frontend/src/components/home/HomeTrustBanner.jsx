import { Shield } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import {
  AMF_REGISTRE_URL,
  IA_AUTO_HABITATION_LOGO,
  IA_AUTO_HABITATION_URL,
  IA_FICHE_CONSEILLER_URL,
  IA_GROUPE_FINANCIER_LOGO,
  TUGO_ASSURANCE_VOYAGE_URL,
} from '../../lib/branding';

/**
 * Bandeau de réassurance sous le hero : AMF + logos partenaires (gris → couleur au survol).
 */
export function HomeTrustBanner() {
  return (
    <section
      className="border-b border-prestige-beige/80 bg-white/95 py-8 md:py-10"
      aria-label="Certifications et partenaires"
    >
      <div className="container-max px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-10">
          <a
            href={AMF_REGISTRE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('select_content', { content_type: 'external_link', item_id: 'home_trust_amf' })}
            className="group inline-flex min-h-[44px] max-w-md items-center gap-3 rounded-xl border border-prestige-beige/80 bg-light/40 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-light/70"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Shield className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-left text-sm leading-snug text-slate-600 transition-colors group-hover:text-slate-800">
              <span className="font-heading font-semibold text-dark">Inscrit au registre AMF</span>
              <span className="mt-0.5 block text-xs text-slate-600">Conseiller en sécurité financière autorisé au Québec</span>
            </span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end md:gap-8">
            <a
              href={IA_FICHE_CONSEILLER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2 py-2 transition-transform duration-300 hover:scale-[1.02]"
              aria-label="iA Groupe financier"
              onClick={() => trackEvent('select_content', { content_type: 'external_link', item_id: 'home_trust_ia_groupe' })}
            >
              <img
                src={IA_GROUPE_FINANCIER_LOGO}
                alt=""
                className="h-9 w-auto max-w-[140px] object-contain grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 md:h-10"
                width={140}
                height={36}
              />
            </a>
            <a
              href={IA_AUTO_HABITATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2 py-2 transition-transform duration-300 hover:scale-[1.02]"
              aria-label="iA Auto et Habitation"
              onClick={() => trackEvent('select_content', { content_type: 'external_link', item_id: 'home_trust_iaah' })}
            >
              <img
                src={IA_AUTO_HABITATION_LOGO}
                alt=""
                className="h-10 w-auto max-w-[160px] object-contain grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 md:h-11"
              />
            </a>
            <a
              href={TUGO_ASSURANCE_VOYAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-prestige-beige bg-white px-5 py-2 text-sm font-heading font-semibold tracking-wide text-slate-500 grayscale transition-all duration-300 hover:border-secondary/40 hover:text-primary group-hover:grayscale-0"
              onClick={() => trackEvent('select_content', { content_type: 'external_link', item_id: 'home_trust_tugo' })}
            >
              Tugo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
