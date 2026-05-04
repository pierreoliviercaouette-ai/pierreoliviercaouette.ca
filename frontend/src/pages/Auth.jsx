import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { trackEvent } from '../lib/analytics';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Entrez votre courriel');
      return;
    }
    if (!trimmed.includes('@')) {
      toast.error('Entrez une adresse courriel valide');
      return;
    }
    setLoading(true);

    try {
      await login(trimmed, password);
      trackEvent('login', { method: 'email_password' });
      toast.success('Connexion réussie!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      trackEvent('login_error', { method: 'email_password' });
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-light" data-testid="login-page">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-ia p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-white font-heading font-bold text-2xl">PO</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-dark">
              Connexion
            </h1>
            <p className="text-prestige-taupe mt-2">
              Accédez à votre espace personnel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Courriel</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                data-testid="login-email"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-prestige-taupe hover:text-dark"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
              data-testid="login-submit"
            >
              {loading ? 'Chargement...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-prestige-taupe">
              Pas encore de compte?{' '}
              <Link
                to="/inscription"
                className="text-primary font-medium hover:underline"
                data-testid="register-link"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-prestige-taupe text-sm mb-2">
            Vous préférez parler à quelqu'un?
          </p>
          <Link
            to="/rendez-vous"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Prendre rendez-vous <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      });
      trackEvent('sign_up', { method: 'email_password' });
      toast.success('Compte créé. Vous pouvez maintenant vous connecter.');
      navigate('/connexion');
    } catch (error) {
      trackEvent('sign_up_error', { method: 'email_password' });
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-light py-12" data-testid="register-page">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-ia p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-white font-heading font-bold text-2xl">PO</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-dark">
              Créer un compte
            </h1>
            <p className="text-prestige-taupe mt-2">
              Accédez aux outils et suivez vos résultats
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                  data-testid="register-firstname"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Tremblay"
                  required
                  data-testid="register-lastname"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Courriel</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                required
                data-testid="register-email"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Au moins 6 caractères"
                required
                data-testid="register-password"
              />
            </div>

            <div>
              <Label htmlFor="password_confirm">Confirmer le mot de passe</Label>
              <Input
                id="password_confirm"
                name="password_confirm"
                type="password"
                autoComplete="new-password"
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                required
                data-testid="register-password-confirm"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full btn-primary" data-testid="register-submit">
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-prestige-taupe">
              Déjà un compte?{' '}
              <Link to="/connexion" className="text-primary font-medium hover:underline" data-testid="login-link">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
