'use client'

import { motion } from 'framer-motion'
import {
  Bell,
  CheckCheck,
  ChevronDown,
  MapPin,
  Menu,
  Navigation,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Modal } from '@/components/ui/modal'
import { SAVED_LOCATIONS, SERVICES } from '@/lib/data'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'

const NAV = [
  { label: 'Home', target: 'home' as const },
  {
    label: 'Services',
    target: 'home' as const,
    hash: 'services',
  },
  {
    label: 'How It Works',
    target: 'home' as const,
    hash: 'how',
  },
  {
    label: 'Care Partners',
    target: 'home' as const,
    hash: 'partners',
  },
  {
    label: 'Offers',
    target: 'home' as const,
    hash: 'offers',
  },
]

export function Header() {
  const {
    navigate,
    location,
    setLocation,
    totalItems,
    toast,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useStore()

  const [locOpen, setLocOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] =
    useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const goSection = (
    target: 'home',
    hash?: string,
  ) => {
    navigate({ name: target })
    setMenuOpen(false)

    if (hash) {
      setTimeout(() => {
        document
          .getElementById(hash)
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
      }, 120)
    }
  }

  const filtered = SERVICES.filter(
    (service) =>
      service.name
        .toLowerCase()
        .includes(query.toLowerCase()) ||
      service.tagline
        .toLowerCase()
        .includes(query.toLowerCase()),
  )

  const handleNotificationClick = (
    notificationId: string,
    orderId?: string,
  ) => {
    markNotificationRead(notificationId)
    setNotificationOpen(false)

    if (orderId) {
      navigate({
        name: 'tracking',
        orderId,
      })
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Brand */}
          <button
            onClick={() => navigate({ name: 'home' })}
            aria-label="NeXa Link home"
            className="shrink-0 rounded-xl outline-none transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Logo />
          </button>

          {/* Desktop navigation */}
          <nav className="ml-5 hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  goSection(
                    item.target,
                    item.hash,
                  )
                }
                className="group relative rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:bg-primary/[0.06] hover:text-foreground"
              >
                {item.label}

                <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-200 group-hover:scale-x-100" />
              </button>
            ))}

            <button
              onClick={() =>
                navigate({ name: 'orders' })
              }
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:bg-primary/[0.06] hover:text-foreground"
            >
              Track Service
            </button>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Location */}
            <button
              onClick={() => setLocOpen(true)}
              className="group hidden max-w-[190px] items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 text-left shadow-[var(--shadow-card)] transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.03] sm:flex"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                <MapPin className="size-3.5" />
              </span>

              <span className="min-w-0">
                <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Service area
                </span>

                <span className="block truncate text-xs font-bold text-foreground">
                  {location}
                </span>
              </span>

              <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search services"
              className="flex size-10 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-all duration-200 hover:border-border hover:bg-card hover:text-foreground"
            >
              <Search className="size-5" />
            </button>

            {/* Notifications */}
            <div className="relative hidden sm:block">
              <button
                onClick={() =>
                  setNotificationOpen(
                    (value) => !value,
                  )
                }
                aria-label="Notifications"
                className="relative flex size-10 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-all duration-200 hover:border-border hover:bg-card hover:text-foreground"
              >
                <Bell className="size-5" />

                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                    {unreadNotificationCount > 9
                      ? '9+'
                      : unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Desktop notification panel */}
              {notificationOpen && (
                <div className="absolute right-0 top-12 z-[70] w-[360px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Notifications
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {unreadNotificationCount > 0
                          ? `${unreadNotificationCount} unread notification${
                              unreadNotificationCount ===
                              1
                                ? ''
                                : 's'
                            }`
                          : "You're all caught up"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={() =>
                            markAllNotificationsRead()
                          }
                          title="Mark all as read"
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <CheckCheck className="size-4" />
                        </button>
                      )}

                      {notifications.length > 0 && (
                        <button
                          onClick={() =>
                            clearNotifications()
                          }
                          title="Clear notifications"
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Bell className="size-5" />
                        </span>

                        <p className="text-sm font-bold text-foreground">
                          No notifications yet
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Booking updates, payments and
                          service alerts will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {notifications.map(
                          (notification) => (
                            <NotificationRow
                              key={notification.id}
                              notification={
                                notification
                              }
                              onClick={() =>
                                handleNotificationClick(
                                  notification.id,
                                  notification.orderId,
                                )
                              }
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border p-3">
                    <button
                      onClick={() => {
                        setNotificationOpen(false)
                        navigate({
                          name: 'orders',
                        })
                      }}
                      className="w-full rounded-xl bg-muted px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      View My Orders
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bag */}
            <button
              onClick={() =>
                navigate({ name: 'bag' })
              }
              aria-label="Open NeXa Link bag"
              className="relative hidden size-10 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-all duration-200 hover:border-border hover:bg-card hover:text-foreground sm:flex"
            >
              <ShoppingBag className="size-5" />

              {totalItems > 0 && (
                <CartBadge count={totalItems} />
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() =>
                navigate({ name: 'profile' })
              }
              aria-label="Profile"
              className="flex size-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/15 hover:shadow-md"
            >
              <User className="size-5" />
            </button>

            {/* Main CTA */}
            <button
              onClick={() =>
                navigate({ name: 'bag' })
              }
              className="ml-1 hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--shadow-lift)] active:translate-y-0 active:scale-[0.98] lg:inline-flex"
            >
              <Sparkles className="size-4" />
              Find a Service
            </button>

            {/* Mobile menu */}
            <button
              onClick={() =>
                setMenuOpen((value) => !value)
              }
              aria-label={
                menuOpen
                  ? 'Close menu'
                  : 'Open menu'
              }
              className="flex size-10 items-center justify-center rounded-xl border border-transparent text-foreground transition-all duration-200 hover:border-border hover:bg-card lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden border-t border-border/60 bg-card/95 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
              {/* Mobile location */}
              <button
                onClick={() => {
                  setLocOpen(true)
                  setMenuOpen(false)
                }}
                className="mb-2 flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/[0.05] p-4 text-left transition-colors hover:bg-primary/[0.08]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </span>

                <span className="flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Service area
                  </span>

                  <span className="mt-0.5 block text-sm font-bold text-foreground">
                    {location}
                  </span>
                </span>

                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              {NAV.map((item) => (
                <button
                  key={item.label}
                  onClick={() =>
                    goSection(
                      item.target,
                      item.hash,
                    )
                  }
                  className="rounded-xl px-3 py-3.5 text-left text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted"
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => {
                  navigate({ name: 'orders' })
                  setMenuOpen(false)
                }}
                className="rounded-xl px-3 py-3.5 text-left text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted"
              >
                Track Service
              </button>

              <div className="my-2 border-t border-border/70" />

              {/* Mobile notifications */}
              <button
                onClick={() => {
                  setNotificationOpen(true)
                  setMenuOpen(false)
                }}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-left text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted"
              >
                <span className="flex items-center gap-3">
                  <Bell className="size-4 text-primary" />
                  Notifications
                </span>

                {unreadNotificationCount > 0 && (
                  <span className="flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {unreadNotificationCount > 9
                      ? '9+'
                      : unreadNotificationCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  navigate({ name: 'provider' })
                  setMenuOpen(false)
                }}
                className="rounded-xl px-3 py-3.5 text-left text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted"
              >
                Provider Dashboard
              </button>

              <button
                onClick={() => {
                  navigate({ name: 'admin' })
                  setMenuOpen(false)
                }}
                className="rounded-xl px-3 py-3.5 text-left text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted"
              >
                Admin Dashboard
              </button>

              <button
                onClick={() => {
                  navigate({ name: 'bag' })
                  setMenuOpen(false)
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
              >
                <Sparkles className="size-4" />
                Find a Service
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Mobile notification panel */}
      {notificationOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm sm:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-3xl border-t border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-base font-bold text-foreground">
                  Notifications
                </p>

                <p className="text-xs text-muted-foreground">
                  {unreadNotificationCount > 0
                    ? `${unreadNotificationCount} unread`
                    : "You're all caught up"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={() =>
                      markAllNotificationsRead()
                    }
                    className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
                    aria-label="Mark all as read"
                  >
                    <CheckCheck className="size-4" />
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    onClick={() =>
                      clearNotifications()
                    }
                    className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-destructive"
                    aria-label="Clear notifications"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}

                <button
                  onClick={() =>
                    setNotificationOpen(false)
                  }
                  className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
                  aria-label="Close notifications"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Bell className="size-5" />
                  </span>

                  <p className="text-sm font-bold text-foreground">
                    No notifications yet
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your booking and service updates
                    will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map(
                    (notification) => (
                      <NotificationRow
                        key={notification.id}
                        notification={notification}
                        onClick={() =>
                          handleNotificationClick(
                            notification.id,
                            notification.orderId,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <button
                onClick={() => {
                  setNotificationOpen(false)
                  navigate({ name: 'orders' })
                }}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location modal */}
      <Modal
        open={locOpen}
        onClose={() => setLocOpen(false)}
        title="Service area"
      >
        <button
          onClick={() => {
            setLocation('Chennai')
            toast(
              'Service area set to your current area',
            )
            setLocOpen(false)
          }}
          className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] p-4 text-left transition-all duration-200 hover:border-primary/35 hover:bg-primary/[0.08]"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Navigation className="size-5" />
          </span>

          <div>
            <p className="text-sm font-bold text-primary">
              Use current location
            </p>

            <p className="text-xs text-muted-foreground">
              Detect your service area
            </p>
          </div>
        </button>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            placeholder="Search area, street, locality…"
            className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Saved locations
        </p>

        <div className="flex flex-col gap-2">
          {SAVED_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                setLocation('Chennai')
                toast(
                  `Service area set to ${loc.label}`,
                )
                setLocOpen(false)
              }}
              className="flex items-center gap-3 rounded-2xl border border-border p-3 text-left transition-all duration-200 hover:border-primary/30 hover:bg-muted/50"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-primary">
                <MapPin className="size-4" />
              </span>

              <div>
                <p className="text-sm font-bold">
                  {loc.label}
                </p>

                <p className="text-xs text-muted-foreground">
                  {loc.area}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Search modal */}
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Find a service"
      >
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search plumbing, cleaning, electrical…"
            className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {query === '' && (
          <>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Popular services
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() =>
                    setQuery(service.name)
                  }
                  className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.05] hover:text-primary"
                >
                  {service.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          {filtered.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                navigate({
                  name: 'service',
                  serviceId: service.id,
                })
                setSearchOpen(false)
                setQuery('')
              }}
              className="group flex items-center gap-3 rounded-2xl border border-border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-[var(--shadow-card)]"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: service.accent,
                }}
              >
                <Icon
                  name={service.icon}
                  className="size-5"
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {service.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {service.tagline}
                </p>
              </div>

              <span className="shrink-0 text-xs font-bold text-primary">
                From ₹{service.fromPrice}
              </span>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No services match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </Modal>
    </>
  )
}

function NotificationRow({
  notification,
  onClick,
}: {
  notification: {
    id: string
    title: string
    message: string
    createdAt: number
    read: boolean
    type: string
  }
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full gap-3 p-4 text-left transition-colors hover:bg-muted/60 ${
        notification.read
          ? 'bg-card'
          : 'bg-primary/[0.04]'
      }`}
    >
      <NotificationIcon
        type={notification.type}
        read={notification.read}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="flex-1 text-xs font-bold text-foreground">
            {notification.title}
          </p>

          {!notification.read && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {notification.message}
        </p>

        <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground/70">
          {formatNotificationTime(
            notification.createdAt,
          )}
        </p>
      </div>
    </button>
  )
}

function NotificationIcon({
  type,
  read,
}: {
  type: string
  read: boolean
}) {
  let icon = <Bell className="size-4" />

  if (type === 'booking') {
    icon = <ShoppingBag className="size-4" />
  } else if (type === 'emergency') {
    icon = <Navigation className="size-4" />
  } else if (type === 'payment') {
    icon = <CheckCheck className="size-4" />
  } else if (type === 'invoice') {
    icon = <CheckCheck className="size-4" />
  } else if (type === 'status') {
    icon = <Navigation className="size-4" />
  }

  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
        read
          ? 'bg-muted text-muted-foreground'
          : 'bg-primary/10 text-primary'
      }`}
    >
      {icon}
    </span>
  )
}

function formatNotificationTime(
  timestamp: number,
) {
  const diff = Date.now() - timestamp

  if (diff < 60 * 1000) {
    return 'Just now'
  }

  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))} min ago`
  }

  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))} hr ago`
  }

  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`
  }

  return new Date(timestamp).toLocaleDateString()
}

function CartBadge({
  count,
}: {
  count: number
}) {
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4 }}
      animate={{ scale: [1.4, 1] }}
      transition={{ duration: 0.35 }}
      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm"
    >
      {count}
    </motion.span>
  )
}