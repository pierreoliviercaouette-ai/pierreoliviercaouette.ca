import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, Bell, ChevronDown, LogOut, Settings, Briefcase, Gift } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { trackEvent } from '../../lib/analytics';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, notifications, unreadCount, markNotificationRead } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Services', path: '/services' },
    { name: 'Outils', path: '/outils' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-prestige-beige">
      <div className="container-max">
        <div className="flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="navbar-logo">
            <img 
              src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/67658b7c46935167e7514507.webp" 
              alt="iA Groupe financier"
              className="h-10 w-auto object-contain bg-white rounded-md"
            />
            <div className="hidden sm:block">
              <p className="font-heading font-semibold text-dark text-lg leading-tight">Pierre-Olivier</p>
              <p className="text-xs text-prestige-taupe">Conseiller en sécurité financière</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => trackEvent('navigation_click', { location: 'navbar_desktop', destination: link.path })}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                className={`font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-light/50 ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-dark hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Referral CTA - Always visible, special styling */}
            <Link 
              to="/recommandations" 
              onClick={() => trackEvent('navigation_click', { location: 'navbar_desktop', destination: '/recommandations' })}
              className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary/20 to-primary/20 hover:from-secondary/30 hover:to-primary/30 rounded-full transition-all duration-300"
              data-testid="nav-referral-cta"
            >
              <Gift className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary text-sm">Recommandations</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            </Link>

            {user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="relative p-2 rounded-full hover:bg-light transition-colors"
                      data-testid="notifications-button"
                    >
                      <Bell className="w-5 h-5 text-dark" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="px-3 py-2 border-b">
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
                          className={`flex flex-col items-start gap-1 cursor-pointer ${!notif.is_read ? 'bg-light/50' : ''}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <span className="font-medium">{notif.title}</span>
                          <span className="text-sm text-muted-foreground">{notif.message}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-light transition-colors"
                      data-testid="user-menu-button"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.first_name[0]}{user.last_name[0]}
                        </span>
                      </div>
                      <span className="font-medium text-dark">{user.first_name}</span>
                      <ChevronDown className="w-4 h-4 text-dark" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profil" className="flex items-center gap-2" data-testid="profile-link">
                        <User className="w-4 h-4" />
                        Mon profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/outils" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Mes outils
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profil?tab=referrals" className="flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        Mes références
                      </Link>
                    </DropdownMenuItem>
                    {user.is_admin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center gap-2" data-testid="admin-link">
                            <Settings className="w-4 h-4" />
                            Administration
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
                      <LogOut className="w-4 h-4 mr-2" />
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
                  className="font-medium text-dark hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-light/50"
                  data-testid="login-link"
                >
                  Connexion
                </Link>
                <Link 
                  to="/rendez-vous" 
                  onClick={() => trackEvent('navigation_click', { location: 'navbar_desktop', destination: '/rendez-vous' })}
                  className="btn-primary"
                  data-testid="cta-rdv"
                >
                  Prendre rendez-vous
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-button"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-prestige-beige animate-slide-down">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    trackEvent('navigation_click', { location: 'navbar_mobile', destination: link.path });
                    setIsOpen(false);
                  }}
                  className={`block py-2 font-medium ${
                    isActive(link.path) ? 'text-primary' : 'text-dark'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Referral CTA */}
              <Link
                to="/recommandations"
                onClick={() => {
                  trackEvent('navigation_click', { location: 'navbar_mobile', destination: '/recommandations' });
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 py-2 font-medium text-primary"
              >
                <Gift className="w-5 h-5" />
                Recommandations
              </Link>
              
              <div className="pt-4 border-t border-prestige-beige space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/profil"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-2 font-medium text-dark"
                    >
                      <User className="w-5 h-5" />
                      Mon profil
                      {unreadCount > 0 && (
                        <Badge variant="default" className="ml-auto">{unreadCount}</Badge>
                      )}
                    </Link>
                    {user.is_admin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 py-2 font-medium text-dark"
                      >
                        <Settings className="w-5 h-5" />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-2 py-2 font-medium text-red-600 w-full"
                    >
                      <LogOut className="w-5 h-5" />
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
                      className="block py-2 font-medium text-dark"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/rendez-vous"
                      onClick={() => {
                        trackEvent('navigation_click', { location: 'navbar_mobile', destination: '/rendez-vous' });
                        setIsOpen(false);
                      }}
                      className="btn-primary block text-center"
                    >
                      Prendre rendez-vous
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
