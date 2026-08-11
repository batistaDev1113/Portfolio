'use client';

import { FormEvent, memo, useCallback, useState } from 'react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';

const LINKEDIN_URL = 'https://www.linkedin.com/in/yunior-profile/';
const GITHUB_URL = 'https://github.com/batistaDev1113';

const ContactForm = memo(() => {
  const [sending, setSending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    message?: string;
  }>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  const fullNameErrorId = 'full-name-error';
  const emailErrorId = 'email-error';
  const messageErrorId = 'message-error';

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateMessage = (msg: string): string | undefined => {
    if (!msg.trim()) return 'Message is required';
    if (msg.trim().length < 10) return 'Message must be at least 10 characters';
    return undefined;
  };

  // Handle input changes (memoized for performance)
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[field as keyof typeof prev]) {
        return { ...prev, [field]: undefined };
      }
      return prev;
    });
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const messageError = validateMessage(formData.message);

    if (fullNameError) newErrors.fullName = fullNameError;
    if (emailError) newErrors.email = emailError;
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setSending(true);
    setMessage('');

    const data = {
      full_name: formData.fullName,
      email: formData.email,
      textarea: formData.message,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Message sent successfully! Thank you for contacting me.');
        setFormData({ fullName: '', email: '', message: '' });
        setErrors({});
      } else {
        setMessage(`Error: ${result.error || 'Failed to send message'}`);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage('Error: Failed to send message. Please try again.');
    }

    setSending(false);
  };
  return (
    <section
      className='relative z-50 w-full max-w-7xl mx-auto my-16 px-4 scroll-mt-20'
      id='contact'
    >
      <div className='flex flex-col items-center mb-16'>
        <p className='eyebrow'>// 03 · Contact</p>
        <h2 className='fluid-title text-ink-900 dark:text-white mt-4 text-center'>
          Let&apos;s Connect
        </h2>
        <p className='mt-4 max-w-2xl text-center text-ink-600 dark:text-ink-400 text-sm sm:text-base leading-6'>
          Have a project in mind, a role to discuss, or just want to say hi? The
          form goes straight to my inbox.
        </p>
      </div>

      <div className='relative bg-white dark:bg-surface rounded-2xl shadow-2xl overflow-hidden section-reveal'>
        {/* Desktop Split Layout */}
        <div className='lg:grid lg:grid-cols-2 lg:min-h-150'>
          {/* Contact Info Panel */}
          <section className='relative p-8 lg:p-12 bg-linear-to-br from-primary-800 via-primary-700 to-violet-a dark:from-surface dark:via-raised dark:to-surface overflow-hidden flex flex-col justify-center gap-6 natural'>
            {/* Ambient glow */}
            <div className='absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-a/25 blur-3xl pointer-events-none' />
            <div className='absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl pointer-events-none' />

            <div className='relative'>
              <p className='text-xs font-mono uppercase tracking-[0.18em] text-primary-200 dark:text-violet-a'>
                Get in touch
              </p>
              <h3 className='fluid-subtitle text-2xl font-semibold mt-3 text-white leading-snug'>
                Let&apos;s build something
                <br />
                worth talking about.
              </h3>
              <p className='mt-4 text-sm text-white/70 leading-6 max-w-sm'>
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>

              <div className='mt-8 flex flex-wrap gap-3'>
                <a
                  href={GITHUB_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='GitHub profile'
                  className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20'
                >
                  <BsGithub className='w-4 h-4' />
                  GitHub
                </a>
                <a
                  href={LINKEDIN_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='LinkedIn profile'
                  className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20'
                >
                  <BsLinkedin className='w-4 h-4' />
                  LinkedIn
                </a>
              </div>
            </div>
          </section>

          {/* Form Section */}
          <main
            aria-label='Contact Form'
            className='relative flex items-center justify-center p-8 lg:p-12'
          >
            {sending ? (
              <div className='flex flex-col items-center justify-center w-full text-center pop-in'>
                <div className='w-20 h-20 bg-linear-to-r from-success-400 to-info-500 rounded-full flex items-center justify-center mb-6'>
                  <FaRegPaperPlane className='text-2xl text-white animate-bounce' />
                </div>
                <h2 className='text-2xl font-semibold text-ink-900 dark:text-white mb-2'>
                  Message Sent!
                </h2>
                <p className='text-ink-600 dark:text-ink-400'>
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <div className='w-full max-w-lg'>
                <form
                  method='post'
                  className='space-y-6'
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Full Name Field */}
                  <div className='group'>
                    <label
                      htmlFor='FullName'
                      className='block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2'
                    >
                      Full Name
                    </label>
                    <input
                      type='text'
                      id='FullName'
                      name='full_name'
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={
                        errors.fullName ? fullNameErrorId : undefined
                      }
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.fullName
                          ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                          : 'border-ink-200 dark:border-border focus:border-primary-400 focus:ring-primary-400/20'
                      } bg-white dark:bg-surface text-ink-900 dark:text-ink-100 placeholder-ink-500 dark:placeholder-ink-400 focus:ring-2 transition-all duration-200 outline-none hover:border-ink-300 dark:hover:border-border`}
                      placeholder='Enter your full name'
                    />
                    {errors.fullName && (
                      <p
                        id={fullNameErrorId}
                        role='alert'
                        className='mt-1 text-sm text-danger-600 dark:text-danger-400'
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className='group'>
                    <label
                      htmlFor='Email'
                      className='block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2'
                    >
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='Email'
                      name='email'
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? emailErrorId : undefined}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email
                          ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                          : 'border-ink-200 dark:border-border focus:border-primary-400 focus:ring-primary-400/20'
                      } bg-white dark:bg-surface text-ink-900 dark:text-ink-100 placeholder-ink-500 dark:placeholder-ink-400 focus:ring-2 transition-all duration-200 outline-none hover:border-ink-300 dark:hover:border-border`}
                      placeholder='your.email@example.com'
                    />
                    {errors.email && (
                      <p
                        id={emailErrorId}
                        role='alert'
                        className='mt-1 text-sm text-danger-600 dark:text-danger-400'
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className='group'>
                    <label
                      htmlFor='Message'
                      className='block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2'
                    >
                      Message
                    </label>
                    <textarea
                      id='Message'
                      name='textarea'
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange('message', e.target.value)
                      }
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? messageErrorId : undefined
                      }
                      placeholder='Tell me about your project or just say hello...'
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.message
                          ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                          : 'border-ink-200 dark:border-border focus:border-primary-400 focus:ring-primary-400/20'
                      } bg-white dark:bg-surface text-ink-900 dark:text-ink-100 placeholder-ink-500 dark:placeholder-ink-400 focus:ring-2 transition-all duration-200 outline-none hover:border-ink-300 dark:hover:border-border resize-none`}
                    />
                    {errors.message && (
                      <p
                        id={messageErrorId}
                        role='alert'
                        className='mt-1 text-sm text-danger-600 dark:text-danger-400'
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type='submit'
                    disabled={sending}
                    className='w-full bg-linear-to-r from-primary-600 to-violet-a hover:from-primary-500 hover:to-violet-b hover:cursor-pointer text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3'
                  >
                    {sending ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaRegPaperPlane className='transform group-hover:translate-x-1 transition-transform duration-200' />
                      </>
                    )}
                  </button>

                  {/* Status Message */}
                  {message && (
                    <div
                      role={message.includes('Error') ? 'alert' : 'status'}
                      aria-live={
                        message.includes('Error') ? 'assertive' : 'polite'
                      }
                      className={`p-4 rounded-xl text-sm font-medium slide-in ${
                        message.includes('Error')
                          ? 'bg-danger-50 text-danger-700 border border-danger-200 dark:bg-danger-900/20 dark:text-danger-400 dark:border-danger-800'
                          : 'bg-success-50 text-success-700 border border-success-200 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800'
                      }`}
                    >
                      {message}
                    </div>
                  )}
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;
