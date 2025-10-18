"use client";

import { domAnimation, LazyMotion, m } from "framer-motion";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import contactusImage from "/public/contact-us.webp";

const ContactForm = () => {
  const [sending, setSending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    message?: string;
  }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateMessage = (msg: string): string | undefined => {
    if (!msg.trim()) return "Message is required";
    if (msg.trim().length < 10) return "Message must be at least 10 characters";
    return undefined;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
    setMessage("");

    const data = {
      full_name: formData.fullName,
      email: formData.email,
      textarea: formData.message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Message sent successfully! Thank you for contacting me.");
        setFormData({ fullName: "", email: "", message: "" });
        setErrors({});
      } else {
        setMessage(`Error: ${result.error || "Failed to send message"}`);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setMessage("Error: Failed to send message. Please try again.");
    }

    setSending(false);
  };
  return (
    <section
      className='relative z-50 w-full max-w-7xl mx-auto my-16 px-4'
      id='contact'
    >
      <h1 className='text-2xl md:text-5xl font-light text-gray-900 dark:text-white text-center mb-16 tracking-wide'>
        Let&apos;s Connect
      </h1>

      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden'
        >
          {/* Desktop Split Layout */}
          <div className='lg:grid lg:grid-cols-2 lg:min-h-[600px]'>
            {/* Image Section */}
            <section className='relative h-64 lg:h-full bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden'>
              <Image
                src={contactusImage}
                width={800}
                height={600}
                alt='Contact illustration'
                className='absolute inset-0 h-full w-full object-cover opacity-80 hover:opacity-100 transition-all duration-700 ease-out hover:scale-105'
                loading='lazy'
                placeholder='blur'
                blurDataURL='data:image/png'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />

              {/* Floating elements for visual interest */}
              <div className='absolute top-8 left-8 hidden lg:block'>
                <div className='w-3 h-3 bg-white/30 rounded-full animate-pulse' />
              </div>
              <div className='absolute bottom-12 right-12 hidden lg:block'>
                <div className='w-2 h-2 bg-white/50 rounded-full animate-pulse delay-1000' />
              </div>
            </section>

            {/* Form Section */}
            <main
              aria-label='Contact Form'
              className='relative flex items-center justify-center p-8 lg:p-12'
            >
              {/* Mobile Card Overlay Effect */}
              <div className='absolute -top-8 left-8 right-8 lg:hidden bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm rounded-t-2xl h-8' />

              {sending ? (
                <m.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='flex flex-col items-center justify-center w-full text-center'
                >
                  <div className='w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6'>
                    <FaRegPaperPlane className='text-2xl text-white animate-bounce' />
                  </div>
                  <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
                    Message Sent!
                  </h2>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                </m.div>
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
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                      >
                        Full Name
                      </label>
                      <input
                        type='text'
                        id='FullName'
                        name='full_name'
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.fullName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-200 outline-none hover:border-gray-300 dark:hover:border-gray-600`}
                        placeholder='Enter your full name'
                      />
                      {errors.fullName && (
                        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className='group'>
                      <label
                        htmlFor='Email'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                      >
                        Email Address
                      </label>
                      <input
                        type='email'
                        id='Email'
                        name='email'
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-200 outline-none hover:border-gray-300 dark:hover:border-gray-600`}
                        placeholder='your.email@example.com'
                      />
                      {errors.email && (
                        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className='group'>
                      <label
                        htmlFor='Message'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                      >
                        Message
                      </label>
                      <textarea
                        id='Message'
                        name='textarea'
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder='Tell me about your project or just say hello...'
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.message
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-200 outline-none hover:border-gray-300 dark:hover:border-gray-600 resize-none`}
                      />
                      {errors.message && (
                        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type='submit'
                      disabled={sending}
                      className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3'
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
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl text-sm font-medium ${
                          message.includes("Error")
                            ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                            : "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        }`}
                      >
                        {message}
                      </m.div>
                    )}
                  </form>
                </div>
              )}
            </main>
          </div>
        </m.div>
      </LazyMotion>
    </section>
  );
};

export default ContactForm;
