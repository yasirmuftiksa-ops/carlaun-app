'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { StoreProvider } from '@/lib/store'
import { AdminScreen } from '@/components/screens/admin-screen'
import { LanguageSelector } from '@/components/language-selector'

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type Role = 'user' | 'admin'

interface UserAccount {
  name: string
  email: string
  phone: string
  password: string
}

interface AuthSession {
  name: string
  email: string
  phone?: string
  role: Role
}

/*
|--------------------------------------------------------------------------
| STORAGE KEYS
|--------------------------------------------------------------------------
*/

const ACCOUNT_KEY = 'carlaun_accounts'
const SESSION_KEY = 'carlaun_session'

/*
|--------------------------------------------------------------------------
| ADMIN EMAIL LIST
|--------------------------------------------------------------------------
*/

const ADMIN_EMAILS = [
  'admin@carlaun.com',
]

/*
|--------------------------------------------------------------------------
| DEMO ADMIN ACCOUNT
|--------------------------------------------------------------------------
|
| Email: admin@carlaun.com
| Password: admin123
|
*/

const DEFAULT_ADMIN: UserAccount = {
  name: 'NeXa Link Admin',
  email: 'admin@carlaun.com',
  phone: '',
  password: 'admin123',
}

/*
|--------------------------------------------------------------------------
| CHECK ADMIN
|--------------------------------------------------------------------------
*/

function isAdminEmail(email: string) {
  return ADMIN_EMAILS.some(
    (adminEmail) =>
      adminEmail.toLowerCase() === email.trim().toLowerCase(),
  )
}

/*
|--------------------------------------------------------------------------
| MAIN PAGE
|--------------------------------------------------------------------------
*/

export default function Page() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  /*
  |--------------------------------------------------------------------------
  | LOAD EXISTING SESSION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY)

      if (savedSession) {
        const parsed = JSON.parse(savedSession)

        if (
          parsed &&
          typeof parsed.name === 'string' &&
          typeof parsed.email === 'string'
        ) {
          /*
          | Always detect role from email.
          | This prevents a normal user from becoming admin
          | just because of a stored role value.
          */

          const detectedRole: Role = isAdminEmail(parsed.email)
            ? 'admin'
            : 'user'

          const correctedSession: AuthSession = {
            name: parsed.name,
            email: parsed.email,
            phone: parsed.phone || '',
            role: detectedRole,
          }

          setSession(correctedSession)

          /*
          | Update stored session with the correct role.
          */

          localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(correctedSession),
          )
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleLogin = (account: UserAccount) => {
    /*
    | IMPORTANT:
    | Role is automatically determined from the email.
    */

    const role: Role = isAdminEmail(account.email)
      ? 'admin'
      : 'user'

    const newSession: AuthSession = {
      name: account.name,
      email: account.email,
      phone: account.phone,
      role,
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(newSession),
    )

    /*
    | Save user information for the rest of NeXa Link.
    */

    localStorage.setItem(
      'carlaun_user_name',
      account.name,
    )

    localStorage.setItem(
      'carlaun_user_email',
      account.email,
    )

    localStorage.setItem(
      'carlaun_user_role',
      role,
    )

    localStorage.setItem(
      'carlaun_user_phone',
      account.phone,
    )

    window.dispatchEvent(
      new CustomEvent('carlaun-auth-changed', {
        detail: newSession,
      }),
    )

    setSession(newSession)
  }

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)

    localStorage.removeItem('carlaun_user_name')
    localStorage.removeItem('carlaun_user_email')
    localStorage.removeItem('carlaun_user_role')
    localStorage.removeItem('carlaun_user_phone')

    window.dispatchEvent(
      new CustomEvent('carlaun-auth-changed'),
    )

    setSession(null)
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Sparkles className="size-7" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Loading NeXa Link...
          </p>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN
  |--------------------------------------------------------------------------
  */

  if (!session) {
    return <AuthScreen onLogin={handleLogin} />
  }

  /*
  |--------------------------------------------------------------------------
  | ADMIN
  |--------------------------------------------------------------------------
  */

  if (session.role === 'admin') {
    return (
      <StoreProvider>
        <div className="relative min-h-dvh">
          <AdminScreen />

          <AdminAccountBar
            name={session.name}
            onLogout={handleLogout}
          />
        </div>
      </StoreProvider>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL USER
  |--------------------------------------------------------------------------
  */

  return (
    <StoreProvider>
      <AuthenticatedUserApp
        session={session}
        onLogout={handleLogout}
      />
    </StoreProvider>
  )
}

/*
|--------------------------------------------------------------------------
| NORMAL USER APP
|--------------------------------------------------------------------------
*/

function AuthenticatedUserApp({
  session,
  onLogout,
}: {
  session: AuthSession
  onLogout: () => void
}) {
  useEffect(() => {
    localStorage.setItem(
      'carlaun_user_name',
      session.name,
    )

    localStorage.setItem(
      'carlaun_user_email',
      session.email,
    )

    localStorage.setItem(
      'carlaun_user_role',
      'user',
    )

    if (session.phone) {
      localStorage.setItem(
        'carlaun_user_phone',
        session.phone,
      )
    }

    window.dispatchEvent(
      new CustomEvent('carlaun-auth-changed', {
        detail: session,
      }),
    )
  }, [session])

  return (
    <div className="relative min-h-dvh">
      <AppShell />

      <LogoutButton
        name={session.name}
        onLogout={onLogout}
      />
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| AUTH SCREEN
|--------------------------------------------------------------------------
*/

function AuthScreen({
  onLogin,
}: {
  onLogin: (account: UserAccount) => void
}) {
  const [mode, setMode] =
    useState<'signin' | 'signup'>('signin')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [error, setError] = useState('')

  /*
  |--------------------------------------------------------------------------
  | GET ACCOUNTS
  |--------------------------------------------------------------------------
  */

  const getAccounts = (): UserAccount[] => {
    try {
      const saved = localStorage.getItem(ACCOUNT_KEY)

      if (!saved) {
        return [DEFAULT_ADMIN]
      }

      const accounts = JSON.parse(saved)

      if (!Array.isArray(accounts)) {
        return [DEFAULT_ADMIN]
      }

      /*
      | Always keep the demo admin account available.
      */

      const adminExists = accounts.some(
        (account: UserAccount) =>
          account.email.toLowerCase() ===
          DEFAULT_ADMIN.email.toLowerCase(),
      )

      if (!adminExists) {
        return [
          ...accounts,
          DEFAULT_ADMIN,
        ]
      }

      return accounts
    } catch {
      return [DEFAULT_ADMIN]
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE ACCOUNTS
  |--------------------------------------------------------------------------
  */

  const saveAccounts = (
    accounts: UserAccount[],
  ) => {
    localStorage.setItem(
      ACCOUNT_KEY,
      JSON.stringify(accounts),
    )
  }

  /*
  |--------------------------------------------------------------------------
  | SIGN UP
  |--------------------------------------------------------------------------
  */

  const handleSignUp = () => {
    setError('')

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.trim()

    if (!cleanName) {
      setError('Please enter your name.')
      return
    }

    if (!cleanEmail) {
      setError('Please enter your email.')
      return
    }

    if (!cleanEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (!cleanPhone) {
      setError('Please enter your phone number.')
      return
    }

    if (!password) {
      setError('Please create a password.')
      return
    }

    if (password.length < 6) {
      setError(
        'Password must contain at least 6 characters.',
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const accounts = getAccounts()

    const existingAccount = accounts.find(
      (account) =>
        account.email.toLowerCase() === cleanEmail,
    )

    if (existingAccount) {
      setError(
        'An account with this email already exists.',
      )
      return
    }

    /*
    | IMPORTANT:
    | Signup does NOT allow someone to choose admin.
    | Admin status is determined only by ADMIN_EMAILS.
    */

    const newAccount: UserAccount = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
    }

    saveAccounts([
      ...accounts,
      newAccount,
    ])

    onLogin(newAccount)
  }

  /*
  |--------------------------------------------------------------------------
  | SIGN IN
  |--------------------------------------------------------------------------
  */

  const handleSignIn = () => {
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError('Please enter your email.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    const accounts = getAccounts()

    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() === cleanEmail &&
        item.password === password,
    )

    if (!account) {
      setError('Invalid email or password.')
      return
    }

    /*
    | Role is automatically detected here.
    */

    onLogin(account)
  }

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = () => {
    if (mode === 'signin') {
      handleSignIn()
    } else {
      handleSignUp()
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SWITCH MODE
  |--------------------------------------------------------------------------
  */

  const switchMode = (
    nextMode: 'signin' | 'signup',
  ) => {
    setMode(nextMode)
    setError('')

    setPassword('')
    setConfirmPassword('')

    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  /*
  |--------------------------------------------------------------------------
  | AUTH UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Language Selector */}

      <div className="absolute right-4 top-4 z-20">
        <LanguageSelector />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}

        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)]">
            <Sparkles className="size-8" />
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            NeXa Link
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            One Platform. Every Garment Care Need.
          </p>
        </div>

        {/* Card */}

        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
          {/* Sign in / Sign up */}

          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-muted p-1">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}

          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {mode === 'signin'
                ? 'Welcome back'
                : 'Create your account'}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {mode === 'signin'
                ? 'Sign in to continue to NeXa Link.'
                : 'Join NeXa Link and manage your garment care.'}
            </p>
          </div>

          {/* SIGN UP */}

          {mode === 'signup' && (
            <div className="space-y-4">
              <InputField
                icon={<User className="size-4" />}
                label="Your name"
                placeholder="Enter your name"
                value={name}
                onChange={setName}
              />

              <InputField
                icon={<Mail className="size-4" />}
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={setEmail}
              />

              <InputField
                icon={<UserPlus className="size-4" />}
                label="Phone number"
                placeholder="+91 98765 43210"
                type="tel"
                value={phone}
                onChange={setPhone}
              />

              <PasswordField
                label="Create password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={setPassword}
                visible={showPassword}
                setVisible={setShowPassword}
              />

              <PasswordField
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirmPassword}
                setVisible={setShowConfirmPassword}
              />
            </div>
          )}

          {/* SIGN IN */}

          {mode === 'signin' && (
            <div className="space-y-4">
              <InputField
                icon={<Mail className="size-4" />}
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={setEmail}
              />

              <PasswordField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                visible={showPassword}
                setVisible={setShowPassword}
              />
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="button"
            onClick={handleSubmit}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {mode === 'signin'
              ? 'Sign In'
              : 'Create Account'}

            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* SWITCH */}

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === 'signin'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}

            <button
              type="button"
              onClick={() =>
                switchMode(
                  mode === 'signin'
                    ? 'signup'
                    : 'signin',
                )
              }
              className="font-semibold text-primary hover:underline"
            >
              {mode === 'signin'
                ? 'Sign Up'
                : 'Sign In'}
            </button>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NeXa Link
        </p>
      </div>
    </main>
  )
}

/*
|--------------------------------------------------------------------------
| INPUT FIELD
|--------------------------------------------------------------------------
*/

function InputField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  icon: ReactNode
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| PASSWORD FIELD
|--------------------------------------------------------------------------
*/

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  visible,
  setVisible,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  visible: boolean
  setVisible: (value: boolean) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>

      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        <button
          type="button"
          onClick={() =>
            setVisible(!visible)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={
            visible
              ? 'Hide password'
              : 'Show password'
          }
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| USER LOGOUT BUTTON
|--------------------------------------------------------------------------
*/

function LogoutButton({
  name,
  onLogout,
}: {
  name: string
  onLogout: () => void
}) {
  return (
    <div className="fixed bottom-24 right-4 z-[60]">
      <button
        type="button"
        onClick={onLogout}
        className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-lg transition-colors hover:border-destructive/40 hover:text-destructive"
      >
        Sign out · {name}
      </button>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| ADMIN ACCOUNT BAR
|--------------------------------------------------------------------------
*/

function AdminAccountBar({
  name,
  onLogout,
}: {
  name: string
  onLogout: () => void
}) {
  return (
    <div className="fixed bottom-6 right-4 z-[60] flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-lg">
      <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="size-4" />
      </div>

      <span className="text-xs font-semibold text-foreground">
        Admin · {name}
      </span>

      <button
        type="button"
        onClick={onLogout}
        className="ml-1 rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
      >
        Sign out
      </button>
    </div>
  )
}