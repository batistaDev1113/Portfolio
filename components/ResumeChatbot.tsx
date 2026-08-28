'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';

const SUGGESTED = [
  { label: 'Frameworks?', prompt: 'What frameworks does Yunior use most?' },
  {
    label: 'Kanban project↗',
    prompt: 'Tell me about the Kanban board project',
  },
];

const ACCESSIBLE_PROMPTS = [
  "What's his experience with accessibility?",
  'What is his current role and where does he work?',
];

export default function ResumeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <>
      {/* Collapsed launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label='Open resume chat'
          aria-expanded={false}
          className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary-600 to-violet-a text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-primary-500 focus-visible:outline-offset-2'
        >
          {/* message circle icon */}
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            aria-hidden='true'
          >
            <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
          </svg>
        </button>
      )}

      {/* Expanded window - 320px per mockup */}
      {isOpen && (
        <div
          role='dialog'
          aria-label='Ask about Yunior chat'
          aria-modal='false'
          className='fixed bottom-6 right-6 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-light-surface shadow-2xl dark:border-ink-700 dark:bg-ink-800'
        >
          {/* Header */}
          <div className='flex items-center justify-between border-b border-border bg-light-surface px-4 py-3 dark:border-ink-700 dark:bg-ink-800'>
            <div className='flex items-center gap-2'>
              <span
                className='h-2 w-2 rounded-full bg-emerald-500'
                aria-hidden='true'
              />
              <span className='text-sm font-medium text-ink-900 dark:text-ink-100'>
                Ask about Yunior
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label='Close chat'
              className='rounded p-1 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700'
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                aria-hidden='true'
              >
                <path d='M18 6L6 18M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Messages - max-height 220 per mockup, scroll */}
          <div
            ref={scrollRef}
            className='flex max-h-55 flex-col gap-3 overflow-y-auto p-4'
          >
            {messages.length === 0 ? (
              <>
                <div className='max-w-[85%] self-start rounded-xl bg-ink-100 px-3 py-2 text-[13px] leading-5 text-ink-700 dark:bg-ink-700 dark:text-ink-200'>
                  Hi, I can answer questions about Yunior&apos;s experience and
                  projects. What would you like to know?
                </div>
                {/* Example from mockup for empty state */}
                <div className='max-w-[85%] self-end rounded-xl bg-primary-50 px-3 py-2 text-[13px] leading-5 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'>
                  {ACCESSIBLE_PROMPTS[0]}
                </div>
                <div className='max-w-[85%] self-start rounded-xl bg-ink-100 px-3 py-2 text-[13px] leading-5 text-ink-700 dark:bg-ink-700 dark:text-ink-200'>
                  Yunior builds WCAG-minded interfaces with semantic HTML and
                  focus management — his portfolio scores 100 on Lighthouse
                  accessibility.
                </div>
              </>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-5 ${
                    m.role === 'user'
                      ? 'self-end bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'
                      : 'self-start bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-200'
                  }`}
                >
                  {m.parts.map((part, i) =>
                    part.type === 'text' ? (
                      <span key={i}>{part.text}</span>
                    ) : null
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className='max-w-[85%] self-start rounded-xl bg-ink-100 px-3 py-2 text-[13px] text-ink-500 dark:bg-ink-700 dark:text-ink-300'>
                <span className='animate-pulse'>Thinking…</span>
              </div>
            )}
            {error && (
              <div className='max-w-[85%] self-start rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700 dark:bg-red-900/20 dark:text-red-300'>
                Something went wrong. Please try again or email
                yuniorbatista1113@gmail.com
              </div>
            )}
          </div>

          {/* Suggested chips */}
          <div className='flex flex-wrap gap-1.5 border-t border-border px-3 py-2 dark:border-ink-700'>
            {SUGGESTED.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSend(s.prompt)}
                disabled={isLoading}
                className='rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 disabled:opacity-50 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300'
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className='flex items-center gap-2 border-t border-border p-3 dark:border-ink-700'
          >
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ask a question'
              aria-label='Ask a question about Yunior'
              maxLength={500}
              className='flex-1 rounded-full border border-border bg-white px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100'
              disabled={isLoading}
            />
            <button
              type='submit'
              disabled={isLoading || !input.trim()}
              aria-label='Send message'
              className='rounded-full bg-primary-600 p-2 text-white hover:bg-primary-700 disabled:opacity-50'
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                aria-hidden='true'
              >
                <path d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
