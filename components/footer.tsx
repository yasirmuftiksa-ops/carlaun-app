'use client'

import { Logo } from '@/components/logo'
import { useStore } from '@/lib/store'

export function Footer() {
  const { navigate } = useStore()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A hyperlocal garment-care marketplace. One pickup, every service, one delivery.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              CARE + LAUNDRY — a demo prototype.
            </p>
          </div>

          <FooterCol
            title="Services"
            links={['Laundry', 'Ironing', 'Dry Cleaning', 'Shoe Cleaning', 'Saree Pleating']}
          />
          <FooterCol
            title="Company"
            links={['How It Works', 'Care Partners', 'Offers', 'Sustainability']}
          />
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">For Partners</h4>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => navigate({ name: 'provider' })}
                className="text-left text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Provider Dashboard
              </button>
              <button
                onClick={() => navigate({ name: 'admin' })}
                className="text-left text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CARLAUN. Prototype for demonstration only.
          </p>
          <p className="text-xs text-muted-foreground">Book. Relax. We Care.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold text-foreground">{title}</h4>
      <div className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <span key={l} className="text-sm text-muted-foreground">
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
