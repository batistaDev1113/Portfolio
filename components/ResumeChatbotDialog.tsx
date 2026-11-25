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

const EXAMPLE_PROMPT = "What's his experience with accessibility?";

const FALLBACK_ERROR =
  'Something went wrong. Please try again or email yuniorbatista1113@gmail.com';

const chatTransport = new DefaultChatTransport({ api: '/api/chat' });

/**
 * The route returns a specific reason (quota vs. unavailable) but the AI SDK
 * surfaces it as an opaque Error. Map the known-safe phrases to plain copy so
 * "try again" is not shown when retrying cannot possibly help.
 */
function describeChatError(error: Error | undefined): string {
  const message = error?.message ?? '';
  if (/daily capacity|too many requests|chat limit for today/i.test(message)) {
    return 'The chat has reached its daily limit. Please try again tomorrow, or email yuniorbatista1113@gmail.com.';
  }
  if (/temporarily unavailable/i.test(message)) {
    return 'The chat model is briefly unavailable. Please try again in a moment.';
  }
  return FALLBACK_ERROR;
}

type ResumeChatbotDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResumeChatbotDialog({
  isOpen,
  onClose,
}: ResumeChatbotDialogProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: chatTransport,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, messages, isLoading]);

  if (!isOpen) {
    return null;
  }

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
    <div
      role='dialog'
      aria-label='Ask about Yunior chat'
      aria-modal='false'
      className='fixed bottom-6 right-6 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-ink-200 bg-light-surface shadow-2xl dark:border-border dark:bg-ink-800'
    >
      {/* Header */}
      <div className='flex items-center justify-between border-b border-ink-200 bg-light-surface px-4 py-3 dark:border-border dark:bg-ink-800'>
        <div className='flex items-center gap-2'>
          <span className='h-2 w-2 rounded-full bg-live' aria-hidden='true' />
          <span className='text-sm font-medium text-ink-900 dark:text-ink-100'>
            Ask about Yunior
          </span>
        </div>
        <button
          type='button'
          onClick={onClose}
          aria-label='Close chat'
          className='cursor-pointer rounded p-1 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700'
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
            <div className='max-w-[85%] self-end rounded-xl bg-primary-50 px-3 py-2 text-[13px] leading-5 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'>
              {EXAMPLE_PROMPT}
            </div>
            <div className='max-w-[85%] self-start rounded-xl bg-ink-100 px-3 py-2 text-[13px] leading-5 text-ink-700 dark:bg-ink-700 dark:text-ink-200'>
              Yunior builds WCAG-minded interfaces with semantic HTML and focus
              management — his portfolio scores 100 on Lighthouse accessibility.
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
                part.type === 'text' ? <span key={i}>{part.text}</span> : null
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className='max-w-[85%] self-start rounded-xl bg-ink-100 px-3 py-2 text-[13px] text-ink-500 dark:bg-ink-700 dark:text-ink-300'>
            <span className='animate-pulse motion-reduce:animate-none'>
              Thinking…
            </span>
          </div>
        )}
        {error && (
          <div
            role='alert'
            className='max-w-[85%] self-start rounded-xl bg-danger-50 px-3 py-2 text-[13px] text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
          >
            {describeChatError(error)}
          </div>
        )}
      </div>

      {/* Suggested chips */}
      <div className='flex flex-wrap gap-1.5 border-t border-ink-200 px-3 py-2 dark:border-border'>
        {SUGGESTED.map((s) => (
          <button
            type='button'
            key={s.label}
            onClick={() => handleSend(s.prompt)}
            disabled={isLoading}
            className='cursor-pointer rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-50 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30'
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className='flex items-center gap-2 border-t border-ink-200 p-3 dark:border-border'
      >
        <input
          ref={inputRef}
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Ask a question'
          aria-label='Ask a question about Yunior'
          maxLength={500}
          className='flex-1 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-border dark:bg-ink-700 dark:text-ink-100'
          disabled={isLoading}
        />
        <button
          type='submit'
          disabled={isLoading || !input.trim()}
          aria-label='Send message'
          className='cursor-pointer rounded-full bg-primary-600 p-2 text-white transition-colors hover:bg-primary-700 disabled:opacity-50 dark:hover:bg-primary-500'
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
  );
}
