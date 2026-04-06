import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(identifier, password);
      toast.success('Connexion réussie!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center bg-light" data-testid="login-page">
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
              <Label htmlFor="identifier">Courriel ou numéro de téléphone</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="vous@exemple.com ou +1 514 123-4567"
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
              {loading ? 'Connexion...' : 'Se connecter'}
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

        {/* CTA */}
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
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const hasEmail = !!formData.email.trim();
    const hasPhone = !!formData.phone.trim();
    if (!hasEmail && !hasPhone) {
      toast.error('Entrez au moins un courriel ou un numéro de téléphone');
      return;
    }

    setLoading(true);

    try {
      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        password: formData.password
      });
      toast.success('Compte créé avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center bg-light py-12" data-testid="register-page">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-ia p-8">
          <div className="text-center mb-8">
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

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="rounded-lg bg-light border border-prestige-beige px-3 py-2">
              <p className="text-xs text-prestige-taupe">
                Choisissez votre mode d&apos;inscription: <strong>courriel</strong> ou <strong>téléphone</strong>.
                <br />
                <strong>Au moins un des deux</strong> est requis.
              </p>
            </div>

            <div>
              <Label htmlFor="email">Adresse courriel (optionnel)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                data-testid="register-email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Numéro de téléphone (optionnel)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 514 123-4567"
                data-testid="register-phone"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 caractères"
                  required
                  data-testid="register-password"
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

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                data-testid="register-confirm-password"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary"
              data-testid="register-submit"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-prestige-taupe">
              Déjà un compte?{' '}
              <Link 
                to="/connexion" 
                className="text-primary font-medium hover:underline"
                data-testid="login-link"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
