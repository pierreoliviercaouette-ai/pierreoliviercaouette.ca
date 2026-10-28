import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAudienceMode, AUDIENCE_PARTICULIER, AUDIENCE_PRIVE } from '../../context/AudienceModeContext';
import { Menu, X, User, Bell, ChevronDown, LogOut, Settings, Briefcase, Gift, Calendar, Landmark, ArrowLeftRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { trackEvent } from '../../lib/analytics';
import { IA_GROUPE_FINANCIER_LOGO } from '../../lib/branding';

const PARTICULIER_LINKS = [
  { name: 'Accueil', path: '/' },
  { name: 'À propos', path: '/a-propos' },
  { name: 'Services', path: '/services' },
  { name: 'Apprendre', path: '/apprendre' },
  { name: 'Outils', path: '/outils' },
];

const PRIVE_LINKS = [
  { name: 'Accueil', path: '/patrimoine' },
  { name: 'Patrimoine', path: '/services/patrimoine' },
  { name: 'Fiscalité', path: '/services/optimisation-fiscale' },
  { name: 'Corporatif', path: '/services/entreprise' },
  { name: 'Employés', path: '/services/assurances-employes' },
  { name: 'Apprendre', path: '/apprendre' },
  { name: 'À propos', path: '/a-propos' },
  { name: 'Outils', path: '/outils' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, notifications, unreadCount, markNotificationRead } = useAuth();
  const location = useLocation();
  const { isPrive, homePath, setAudience } = useAudienceMode();

  const navLinks = isPrive ? PRIVE_LINKS : PARTICULIER_LINKS;

  const isActive = (path) => {
    if (path === '/' || path === '/patrimoine') return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const switchAudience = () => {
    if (isPrive) {
      setAudience(AUDIENCE_PARTICULIER);
      trackEvent('navigation_click', { location: 'navbar_audience_switch', destination: '/' });
    } else {
      setAudience(AUDIENCE_PRIVE);
      trackEvent('navigation_click', { location: 'navbar_audience_switch', destination: '/patrimoine' });
    }
  };

  const audienceSwitchPath = isPrive ? '/' : '/patrimoine';
  const audienceSwitchLabel = isPrive ? 'Particuliers' : 'Clientèle privée';

  return (
    <nav className={`sticky top-0 z-50 border-b bg-white ${isPrive ? 'border-zinc-200' : 'border-prestige-beige/80'}`}>
      {/* Encoche centrée en haut de page : bascule de mode */}
      <div className="flex justify-center">
        <Link
          to={audienceSwitchPath}
          onClick={switchAudience}
          className={`inline-flex items-center gap-1.5 rounded-b-2xl border border-t-0 px-4 py-1.5 text-xs font-semibold tracking-wide shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:gap-2 sm:px-5 sm:py-2 sm:text-sm ${
            isPrive
              ? 'border-zinc-300 bg-dark text-white hover:bg-zinc-800'
              : 'border-prestige-beige bg-light text-dark hover:bg-prestige-beige/40'
          }`}
          data-testid="audience-switch"
          aria-label={`Basculer vers ${audienceSwitchLabel}`}
        >
          <ArrowLeftRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span className="whitespace-nowrap">{audienceSwitchLabel}</span>
        </Link>
      </div>

      <div className="container-max">
          <div className="flex h-20 w-full min-w-0 items-center gap-3 px-4 md:px-8">
            <Link
              to={homePath}
              className="z-10 flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3"
              data-testid="navbar-logo"
            >
              <span className={`inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-white px-2 py-1 ring-1 ${isPrive ? 'ring-zinc-200' : 'ring-prestige-beige/40'}`}>
                <img
                  src={IA_GROUPE_FINANCIER_LOGO}
                  alt="iA Groupe financier"
                  className="block h-[30px] w-auto max-w-[min(132px,32vw)] object-contain object-center"
                  width={132}
                  height={30}
                />
              </span>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate font-heading text-base font-semibold leading-tight text-dark lg:text-lg">
                  Pierre-Olivier
                </p>
                <p className={`hidden text-xs md:block ${isPrive ? 'text-zinc-500' : 'text-prestige-taupe'}`}>
                  Conseiller en sécurité financière
                </p>
              </div>
            </Link>

            <nav
              className="hidden min-w-max flex-1 items-center justify-center gap-3 overflow-x-auto px-2 lg:flex xl:gap-4"
              aria-label="Navigation principale"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => trackEvent('navigation_click', { location: 'navbar_desktop', destination: link.path })}
                  data-testid={`nav-link-${link.path.replace(/\//g, '-') || 'home'}`}
                  className={`inline-flex shrink-0 min-h-[44px] items-center justify-center whitespace-nowrap rounded-lg px-2.5 text-sm font-medium transition-colors duration-200 hover:bg-light/50 ${
                    isActive(link.path) ? 'text-primary' : 'text-dark hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
              <Link
                to="/rendez-vous"
                onClick={() => trackEvent('navigation_click', { location: 'navbar_desktop', destination: '/rendez-vous' })}
                className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 xl:px-5 ${
                  isPrive ? 'rounded-none bg-dark hover:bg-zinc-800' : 'rounded-full bg-dark ring-2 ring-dark/10 hover:bg-dark/90'
                }`}
                data-testid="cta-rdv"
              >
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Prendre rendez-vous</span>
              </Link>

              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 transition-colors hover:bg-light"
                        data-testid="notifications-button"
                      >
                        <Bell className="h-5 w-5 text-dark" />
                        {unreadCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="border-b px-3 py-2">
                        <p className="font-semibold">Notifications</p>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-3 py-4 text-center text-muted-foreground">
                          Aucune notification
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <DropdownMenuItem
                            key={notif.id}
                            className={`flex cursor-pointer flex-col items-start gap-1 ${!notif.is_read ? 'bg-light/50' : ''}`}
                            onClick={() => markNotificationRead(notif.id)}
                          >
                            <span className="font-medium">{notif.title}</span>
                            <span className="text-sm text-muted-foreground">{notif.message}</span>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex min-h-[44px] items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-light"
                        data-testid="user-menu-button"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-medium text-white">
                            {user.first_name[0]}{user.last_name[0]}
                          </span>
                        </div>
                        <span className="font-medium text-dark">{user.first_name}</span>
                        <ChevronDown className="h-4 w-4 text-dark" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="border-b px-3 py-2">
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to="/profil" className="flex items-center gap-2" data-testid="profile-link">
                          <User className="h-4 w-4" />
                          Mon profil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/outils" className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Mes outils
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/recommandations" className="flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          Mes références
                        </Link>
                      </DropdownMenuItem>
                      {user.is_admin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="flex items-center gap-2" data-testid="admin-link">
                              <Settings className="h-4 w-4" />
                              Administration
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/admin/assurance-vie-actif" className="flex items-center gap-2">
                              <Landmark className="h-4 w-4" />
                              Classe d’actif
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="text-red-600 focus:text-red-600"
                        data-testid="logout-button"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    onClick={() => trackEvent('navigation_click', { location: 'navbar_desktop', destination: '/connexion' })}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-3 font-medium text-dark transition-colors hover:bg-light/50 hover:text-primary"
                    data-testid="login-link"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => trackEvent('navigation_click', { location: 'navbar_desktop', destination: '/contact' })}
                    className={`hidden text-sm lg:inline-flex ${isPrive ? 'inline-flex min-h-[44px] items-center justify-center border-2 border-dark px-5 py-2.5 font-semibold text-dark hover:bg-dark hover:text-white' : 'btn-secondary'}`}
                    data-testid="cta-demande"
                  >
                    Faire une demande
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="relative z-10 ml-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 hover:bg-light/80 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-button"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isOpen && (
            <div className={`animate-slide-down border-t lg:hidden ${isPrive ? 'border-zinc-200' : 'border-prestige-beige'}`}>
              <div className="space-y-4 px-4 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      trackEvent('navigation_click', { location: 'navbar_mobile', destination: link.path });
                      setIsOpen(false);
                    }}
                    className={`flex min-h-[44px] items-center rounded-lg py-2 font-medium ${
                      isActive(link.path) ? 'text-primary' : 'text-dark'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  to="/rendez-vous"
                  onClick={() => {
                    trackEvent('navigation_click', { location: 'navbar_mobile', destination: '/rendez-vous' });
                    setIsOpen(false);
                  }}
                  className="flex min-h-[44px] items-center gap-2 py-2 font-medium text-primary"
                  data-testid="cta-rdv-mobile"
                >
                  <Calendar className="h-5 w-5" />
                  Prendre rendez-vous
                </Link>

                <div className={`space-y-3 border-t pt-4 ${isPrive ? 'border-zinc-200' : 'border-prestige-beige'}`}>
                  {user ? (
                    <>
                      <Link
                        to="/profil"
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-[44px] items-center gap-2 py-2 font-medium text-dark"
                      >
                        <User className="h-5 w-5" />
                        Mon profil
                        {unreadCount > 0 && (
                          <Badge variant="default" className="ml-auto">{unreadCount}</Badge>
                        )}
                      </Link>
                      {user.is_admin && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex min-h-[44px] items-center gap-2 py-2 font-medium text-dark"
                          >
                            <Settings className="h-5 w-5" />
                            Administration
                          </Link>
                          <Link
                            to="/admin/assurance-vie-actif"
                            onClick={() => setIsOpen(false)}
                            className="flex min-h-[44px] items-center gap-2 py-2 font-medium text-dark"
                          >
                            <Landmark className="h-5 w-5" />
                            Classe d’actif
                          </Link>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="flex min-h-[44px] w-full items-center gap-2 py-2 font-medium text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/connexion"
                        onClick={() => {
                          trackEvent('navigation_click', { location: 'navbar_mobile', destination: '/connexion' });
                          setIsOpen(false);
                        }}
                        className="flex min-h-[44px] items-center py-2 font-medium text-dark"
                      >
                        Connexion
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => {
                          trackEvent('navigation_click', { location: 'navbar_mobile', destination: '/contact' });
                          setIsOpen(false);
                        }}
                        className={`flex min-h-[44px] items-center justify-center text-center ${isPrive ? 'border-2 border-dark font-semibold text-dark' : 'btn-secondary'}`}
                        data-testid="cta-demande-mobile"
                      >
                        Faire une demande
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
    </nav>
  );
};
