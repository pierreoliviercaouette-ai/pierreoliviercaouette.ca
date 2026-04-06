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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const isEmailLogin = identifier.includes('@');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Entrez un courriel ou un numéro de téléphone');
      return;
    }
    setLoading(true);

    try {
      if (isEmailLogin) {
        await login(identifier, password);
        trackEvent('login', { method: 'email_password' });
        toast.success('Connexion réussie!');
        navigate(from, { replace: true });
        return;
      }

      if (!otpSent) {
        await sendPhoneOtp(identifier);
        trackEvent('begin_checkout', { // used as "start verification flow"
          currency: 'CAD',
          value: 0,
          method: 'phone_otp_login'
        });
        setOtpSent(true);
        toast.success('Code OTP envoyé par SMS.');
      } else {
        await verifyPhoneOtp(identifier, otp);
        trackEvent('login', { method: 'phone_otp' });
        toast.success('Connexion réussie!');
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
      trackEvent('login_error', { method: isEmailLogin ? 'email_password' : 'phone_otp' });
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
                placeholder="vous@exemple.com ou 8198061164"
                required
                data-testid="login-email"
              />
            </div>

            {isEmailLogin ? (
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
            ) : otpSent ? (
              <div>
                <Label htmlFor="otp">Code OTP reçu par SMS</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  data-testid="login-otp"
                />
                <button
                  type="button"
                  className="mt-2 text-sm text-primary hover:underline"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await sendPhoneOtp(identifier);
                      toast.success('Nouveau code OTP envoyé.');
                    } catch (error) {
                      toast.error(error.message || 'Erreur lors du renvoi');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Renvoyer le code
                </button>
              </div>
            ) : null}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary"
              data-testid="login-submit"
            >
              {loading
                ? 'Chargement...'
                : isEmailLogin
                  ? 'Se connecter'
                  : otpSent
                    ? 'Vérifier le code'
                    : 'Recevoir un code OTP'}
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
    phone: '',
  });
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      toast.error('Entrez un numéro de téléphone');
      return;
    }

    setLoading(true);

    try {
      await sendPhoneOtp(formData.phone, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim()
      });
      trackEvent('sign_up_start', { method: 'phone_otp' });
      setOtpStep(true);
      toast.success('Code OTP envoyé par SMS.');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Entrez le code OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyPhoneOtp(formData.phone, otp);
      trackEvent('sign_up', { method: 'phone_otp' });
      toast.success('Compte vérifié et connexion réussie!');
      navigate('/');
    } catch (error) {
      trackEvent('sign_up_error', { method: 'phone_otp' });
      toast.error(error.message || 'Code OTP invalide');
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

          {!otpStep ? (
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
                  Inscription par téléphone avec code OTP SMS (sans mot de passe).
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="8198061164"
                  required
                  data-testid="register-phone"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary"
                data-testid="register-submit"
              >
                {loading ? 'Envoi du code...' : 'Recevoir le code OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="rounded-lg bg-light border border-prestige-beige px-3 py-2">
                <p className="text-xs text-prestige-taupe">
                  Un code a été envoyé au <strong>{formData.phone}</strong>.
                </p>
              </div>
              <div>
                <Label htmlFor="otp">Code OTP (6 chiffres)</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  data-testid="register-otp"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOtpStep(false)}
                >
                  Modifier le numéro
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Vérification...' : 'Vérifier le code'}
                </Button>
              </div>
            </form>
          )}

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
