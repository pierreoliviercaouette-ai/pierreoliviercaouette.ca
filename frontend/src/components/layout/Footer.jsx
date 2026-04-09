import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, Facebook, Instagram, Linkedin } from 'lucide-react';
import { IA_AUTO_HABITATION_URL } from '../../lib/branding';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const usefulLinks = [
    { name: 'iA Auto et Habitation', url: IA_AUTO_HABITATION_URL },
    { name: 'Tugo Assurance Voyage', url: 'https://shop.tugo.com/store/IAJ19165' },
    { name: 'Ma fiche conseiller iA', url: 'https://ia.ca/fr/fiche-conseiller/conseiller/pierre-olivier-caouette' },
  ];

  const services = [
    { name: 'Assurance vie', path: '/services#assurance-vie' },
    { name: 'Assurance maladie grave', path: '/services#maladie-grave' },
    { name: 'Assurance invalidité', path: '/services#invalidite' },
    { name: 'Épargne et retraite', path: '/services#epargne' },
    { name: 'Planification financière', path: '/services#planification' },
  ];

  const seoGuides = [
    { name: 'Conseiller financier Victoriaville', path: '/conseiller-financier-victoriaville' },
    { name: 'Assurance vie Victoriaville', path: '/assurance-vie-victoriaville' },
    { name: 'Assurance invalidite Quebec', path: '/assurance-invalidite-quebec' },
    { name: 'Planification financiere Quebec', path: '/planification-financiere-quebec' },
    { name: 'Recommander un conseiller financier', path: '/recommander-conseiller-financier' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/profile.php?id=61558509312003' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/caouettepierreolivier/' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/pierre-olivier-caouette-5b9a53302/' },
  ];

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <a
                href={IA_AUTO_HABITATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded"
                aria-label="iA Auto et Habitation — ouvrir le site"
              >
                <img
                  src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/675b3afd2ca280c375862eea.png"
                  alt="iA Auto et Habitation"
                  className="h-12 w-auto"
                />
              </a>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Accompagnement personnalisé pour protéger ce qui compte vraiment. 
              Une approche humaine, claire et adaptée au Québec.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.path}>
                  <Link 
                    to={service.path}
                    className="text-white/70 hover:text-secondary transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.url}>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-secondary transition-colors text-sm flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides SEO */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Guides</h4>
            <ul className="space-y-2">
              {seoGuides.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-white/70 hover:text-secondary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/70">Téléphone</p>
                  <a href="tel:8198061164" className="hover:text-secondary transition-colors">
                    819 806-1164
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/70">Courriel</p>
                  <a href="mailto:p-o.caouette@agc.ia.ca" className="hover:text-secondary transition-colors text-sm">
                    p-o.caouette@agc.ia.ca
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/70">Région</p>
                  <p>Victoriaville, Québec</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-max px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {currentYear} Pierre-Olivier Caouette. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/confidentialite" className="text-white/50 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/conditions" className="text-white/50 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
          
          {/* Compliance Notice */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs text-center max-w-4xl mx-auto">
              Les informations présentées sur ce site sont de nature générale et ne constituent pas des conseils financiers personnalisés. 
              Chaque situation étant unique, il est recommandé de consulter un conseiller qualifié avant de prendre toute décision financière. 
              Les produits d'assurance et de placement comportent des risques et ne conviennent pas à tous les profils d'investisseurs.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
