import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/api/store/authStore';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import { useUIStore } from '@/store/uiStore';
import { getApiOrigin } from '@/lib/api-base';
import rweLogoNoText from '@/assets/rwe-logo-notext.svg';

type Step = 'email' | 'password' | 'createPassword' | 'success';

const API_BASE = getApiOrigin();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type AccountStatusResponse = {
  exists: boolean;
  can_set_password: boolean;
};

async function apiAccountStatus(email: string): Promise<AccountStatusResponse> {
  const encodedEmail = encodeURIComponent(email.trim());
  const res = await fetch(`${API_BASE}/api/auth/account-status?email=${encodedEmail}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return {
    exists: Boolean(data.exists),
    can_set_password: Boolean(data.can_set_password),
  };
}

async function apiRegister(
  email: string,
  password: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  /** Where to go after a successful login. Default is admin; `/dashboard` in routes also redirects to `/admin`. */
  const from: string =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/admin';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearErrors = () => {
    setError('');
    setFieldErrors({});
  };

  // ── Step 1: Email → Continue ───
  async function handleEmailContinue() {
    if (!isValidEmail(email)) {
      setFieldErrors({ email: 'Enter a valid email address.' });
      return;
    }
    clearErrors();
    setLoading(true);
    try {
      const status = await apiAccountStatus(email);
      setStep(status.exists ? 'password' : 'createPassword');
    } catch {
      setError('Unable to verify account right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Login ─────
  async function handleLogin() {
    if (!password) {
      setFieldErrors({ password: 'Password is required.' });
      return;
    }
    clearErrors();
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('401') || message.toLowerCase().includes('invalid') || message.toLowerCase().includes('login failed')) {
        setError('Invalid credentials.');
      } else {
        setError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Step 3: Claim / Register ───────────────────────────────────────────────
  async function handleRegister() {
    const errs: Record<string, string> = {};
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (password !== confirmPw) errs.confirmPw = 'Passwords do not match.';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    clearErrors();
    setLoading(true);
    try {
      await apiRegister(email, password);
      await login(email, password);
      setStep('success');
      setTimeout(() => navigate('/admin', { replace: true }), 1200);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 403) setError('Email not invited. Contact Admin.');
      else if (status === 400) setError('Account already exists.');
      else setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary px-4">
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm hover:bg-muted transition-colors cursor-pointer"
        aria-label="Toggle theme"
        title="Toggle light/dark mode"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <ImageWithLoader
          src={rweLogoNoText}
          alt="RWE Logo"
          wrapperClassName="h-20 w-auto"
          className="h-20 w-auto"
          loading="eager"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-background-secondary rounded-xl border border-background-tertiary shadow-sm p-10">

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-text-secondary/20 border border-text-secondary/40">
              <svg className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-xl text-text-primary">Account activated!</h2>
              <p className="mt-1 text-sm text-foreground-secondary">Redirecting you to the dashboard…</p>
            </div>
          </div>
        )}

        {/* ── STEP 1: EMAIL ── */}
        {step === 'email' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl text-text-primary">Sign in</h2>
              <p className="mt-1 text-sm text-foreground-secondary">Enter your email to continue.</p>
            </div>

            {error && <ErrorBanner message={error} />}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground-secondary text-xs uppercase tracking-wide">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@rwehub.org"
                  value={email}
                  autoFocus
                  autoComplete="email"
                  className={fieldErrors.email ? 'border-destructive focus-visible:ring-destructive/30' : ''}
                  onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
                />
                {fieldErrors.email && <FieldError message={fieldErrors.email} />}
              </div>

              <Button className="w-full" onClick={handleEmailContinue}>
                {loading ? <Spinner /> : 'Continue'}
              </Button>
            </div>
          </>
        )}

        {/* ── STEP 2: PASSWORD (LOGIN) ── */}
        {step === 'password' && (
          <>
            <BackButton onClick={() => { setStep('email'); clearErrors(); setPassword(''); }} />

            <div className="mb-4">
              <h2 className="text-xl text-text-primary">Welcome back</h2>
              <p className="mt-1 text-sm text-foreground-secondary">Enter your password to sign in.</p>
            </div>

            <EmailChip email={email} />

            {error && <ErrorBanner message={error} />}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground-secondary text-xs uppercase tracking-wide">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    autoFocus
                    autoComplete="current-password"
                    className={`pr-10 ${fieldErrors.password ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                    onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-foreground-tertiary hover:text-foreground-secondary cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <FieldError message={fieldErrors.password} />}
              </div>

              <Button className="w-full" disabled={loading} onClick={handleLogin}>
                {loading ? <Spinner /> : 'Login'}
              </Button>

            </div>
          </>
        )}

        {/* ── STEP 3: CREATE PASSWORD (REGISTER) ── */}
        {step === 'createPassword' && (
          <>
            <BackButton onClick={() => { setStep('email'); clearErrors(); setPassword(''); setConfirmPw(''); }} />

            <div className="mb-4">
              <h2 className="text-xl text-text-primary">Create your account</h2>
              <p className="mt-1 text-sm text-foreground-secondary">
                Set a password to activate your account.
              </p>
            </div>

            <EmailChip email={email} />

            {error && <ErrorBanner message={error} />}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-foreground-secondary text-xs uppercase tracking-wide">
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    autoFocus
                    autoComplete="new-password"
                    className={`pr-10 ${fieldErrors.password ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                    onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-foreground-tertiary hover:text-foreground-secondary cursor-pointer"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    title={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <FieldError message={fieldErrors.password} />}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-foreground-secondary text-xs uppercase tracking-wide">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPw}
                    autoComplete="new-password"
                    className={`pr-10 ${fieldErrors.confirmPw ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                    onChange={(e) => { setConfirmPw(e.target.value); clearErrors(); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-foreground-tertiary hover:text-foreground-secondary cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPw && <FieldError message={fieldErrors.confirmPw} />}
              </div>

              <Button className="w-full" disabled={loading} onClick={handleRegister}>
                {loading ? <Spinner /> : 'Activate account'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Small sub-components 

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      {message}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

function EmailChip({ email }: { email: string }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-background-tertiary bg-background-primary px-3 py-1 text-xs text-foreground-secondary">
      <span className="h-1.5 w-1.5 rounded-full bg-text-secondary" />
      {email}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="mb-5 flex items-center gap-1.5 text-xs text-foreground-tertiary hover:text-foreground-secondary transition-colors"
      onClick={onClick}
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}

function Spinner() {
  return (
    <span className="flex items-center gap-2">
      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Loading…
    </span>
  );
}
