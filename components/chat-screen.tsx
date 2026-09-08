'use client'

import {
  ArrowLeft,
  CheckCheck,
  MoreVertical,
  Phone,
  Send,
  Trash2,
  User,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type ChatRole = 'customer' | 'provider'

interface ChatMessage {
  id: string
  text: string
  sender: ChatRole
  createdAt: number
  read: boolean
}

interface ChatScreenProps {
  orderId?: string
  providerName?: string
  providerId?: string
  serviceName?: string
  onBack?: () => void
}

const CHAT_STORAGE_KEY = 'nexa_link_chats'

function getChatKey(
  orderId?: string,
  providerId?: string,
) {
  return `${orderId || 'general'}_${providerId || 'provider'}`
}

function getInitialMessages(
  providerName: string,
): ChatMessage[] {
  return [
    {
      id: 'welcome-1',
      text: `Hello! I'm ${providerName}. How can I help you with your service?`,
      sender: 'provider',
      createdAt: Date.now() - 1000 * 60 * 8,
      read: true,
    },
  ]
}

export function ChatScreen({
  orderId,
  providerName = 'NeXa Link Provider',
  providerId = 'provider-1',
  serviceName = 'Service',
  onBack,
}: ChatScreenProps) {
  const chatKey = useMemo(
    () => getChatKey(orderId, providerId),
    [orderId, providerId],
  )

  const [messages, setMessages] = useState<
    ChatMessage[]
  >([])

  const [message, setMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        CHAT_STORAGE_KEY,
      )

      if (stored) {
        const chats = JSON.parse(stored) as Record<
          string,
          ChatMessage[]
        >

        if (chats[chatKey]) {
          setMessages(chats[chatKey])
        } else {
          setMessages(
            getInitialMessages(providerName),
          )
        }
      } else {
        setMessages(
          getInitialMessages(providerName),
        )
      }
    } catch {
      setMessages(
        getInitialMessages(providerName),
      )
    }

    setLoaded(true)
  }, [chatKey, providerName])

  useEffect(() => {
    if (!loaded) {
      return
    }

    try {
      const stored = localStorage.getItem(
        CHAT_STORAGE_KEY,
      )

      const chats = stored
        ? (JSON.parse(stored) as Record<
            string,
            ChatMessage[]
          >)
        : {}

      chats[chatKey] = messages

      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(chats),
      )
    } catch {
      // Ignore localStorage errors.
    }
  }, [messages, chatKey, loaded])

  const sendMessage = () => {
    const text = message.trim()

    if (!text) {
      return
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
      text,
      sender: 'customer',
      createdAt: Date.now(),
      read: true,
    }

    setMessages((current) => [
      ...current,
      newMessage,
    ])

    setMessage('')

    /*
     * Demo provider reply.
     * Later this will be replaced with real-time
     * Supabase messaging.
     */
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `reply-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
        text: getDemoReply(text),
        sender: 'provider',
        createdAt: Date.now(),
        read: true,
      }

      setMessages((current) => [
        ...current,
        reply,
      ])
    }, 900)
  }

  const clearChat = () => {
    const confirmed = window.confirm(
      'Clear this conversation?',
    )

    if (!confirmed) {
      return
    }

    setMessages([])
    setMenuOpen(false)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-background">
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-4xl flex-col">
        {/* Chat header */}
        <div className="sticky top-[4.5rem] z-30 flex items-center gap-3 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div className="relative">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-5" />
            </span>

            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">
              {providerName}
            </p>

            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500" />

              <p className="truncate text-xs text-muted-foreground">
                Online · {serviceName}
              </p>
            </div>
          </div>

          <button
            aria-label="Call provider"
            onClick={() =>
              window.alert(
                'Calling provider is available in the full mobile app.',
              )
            }
            className="hidden size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground sm:flex"
          >
            <Phone className="size-4" />
          </button>

          <div className="relative">
            <button
              aria-label="Chat options"
              onClick={() =>
                setMenuOpen((value) => !value)
              }
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <MoreVertical className="size-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl">
                <button
                  onClick={clearChat}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                  Clear chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Service information */}
        <div className="border-b border-border/60 bg-primary/[0.03] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Service conversation
              </p>

              <p className="mt-0.5 text-xs font-bold text-foreground">
                {serviceName}
              </p>
            </div>

            {orderId && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                Order #{orderId.slice(-6)}
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
              <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Send className="size-6" />
              </span>

              <h2 className="text-base font-bold text-foreground">
                Start the conversation
              </h2>

              <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                Ask the provider about arrival time,
                service details or anything you need
                help with.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="my-2 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />

                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Today
                </span>

                <span className="h-px flex-1 bg-border" />
              </div>

              {messages.map((item) => {
                const isCustomer =
                  item.sender === 'customer'

                return (
                  <div
                    key={item.id}
                    className={`flex ${
                      isCustomer
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[82%] sm:max-w-[70%] ${
                        isCustomer
                          ? 'items-end'
                          : 'items-start'
                      } flex flex-col`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-5 ${
                          isCustomer
                            ? 'rounded-br-md bg-primary text-primary-foreground'
                            : 'rounded-bl-md border border-border bg-card text-foreground shadow-sm'
                        }`}
                      >
                        {item.text}
                      </div>

                      <div
                        className={`mt-1 flex items-center gap-1.5 px-1 ${
                          isCustomer
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(
                            item.createdAt,
                          )}
                        </span>

                        {isCustomer && (
                          <CheckCheck className="size-3 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Message composer */}
        <div className="sticky bottom-0 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-card)] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
            <input
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              aria-label="Send message"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Messages are securely stored for this demo
            conversation.
          </p>
        </div>
      </div>
    </main>
  )
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString(
    [],
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  )
}

function getDemoReply(message: string) {
  const text = message.toLowerCase()

  if (
    text.includes('where') ||
    text.includes('location') ||
    text.includes('coming')
  ) {
    return 'I am on the way. I will reach your location shortly.'
  }

  if (
    text.includes('when') ||
    text.includes('time') ||
    text.includes('arrive')
  ) {
    return 'I will keep you updated about my arrival time.'
  }

  if (
    text.includes('price') ||
    text.includes('cost')
  ) {
    return 'The service price shown in your booking is the confirmed amount.'
  }

  if (
    text.includes('thank') ||
    text.includes('thanks')
  ) {
    return 'You are welcome! I am happy to help.'
  }

  return 'Thanks for your message. I have received it and will help you with your service.'
}