"use client";

import { Card } from "flowbite-react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import contactusImage from "/public/contact-us.webp";

const ContactForm = () => {
  const [sending, setSending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

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
        form.reset();
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
      className='z-50 bg-white dark:bg-gray-900 w-4/5 my-10'
      id='contact'
    >
      <h1 className='text-lg md:text-4xl uppercase text-gray-900 dark:text-white opacity-70 text-center my-20 tracking-widest font-semibold md:font-normal'>
        Contact Me
      </h1>
      <Card>
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            className='lg:grid lg:grid-cols-12 lg:min-h-[500px] dark:bg-gray-800 place-items-stretch'
          >
            <section className='relative h-32 lg:h-full bg-transparent lg:col-span-5 xl:col-span-6 overflow-hidden'>
              <Image
                src={contactusImage}
                width={600}
                height={600}
                alt='Night'
                className='absolute inset-0 h-full w-full object-cover opacity-60 backdrop-blur-md hover:opacity-90 duration-500 ease-in-out lg:rounded'
                loading='lazy'
                placeholder='blur'
                blurDataURL='data:image/png'
              />
            </section>

            <main
              aria-label='Main'
              className='flex items-center justify-center py-8 px-2 lg:col-span-7 lg:py-12 xl:col-span-6 col-span-7 w-full md:w-4/5'
            >
              {sending ? (
                <div className='flex flex-col items-center justify-center w-4/5'>
                  <FaRegPaperPlane className='text-6xl text-green-500 animate-spin' />
                  <h1 className='text-2xl text-gray-500'>Message Sent!</h1>
                </div>
              ) : (
                <div className='w-full'>
                  <form
                    method='post'
                    className='mt-8 grid grid-cols-6 gap-6'
                    onSubmit={handleSubmit}
                  >
                    <div className='col-span-6'>
                      <label
                        htmlFor='FullName'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-200'
                      >
                        Full Name
                      </label>

                      <input
                        type='text'
                        id='FullName'
                        name='full_name'
                        className='mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-green-300 outline-none focus:ring-0 focus:border-green-300'
                        required
                      />
                    </div>

                    <div className='col-span-6'>
                      <label
                        htmlFor='Email'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-200'
                      >
                        Email
                      </label>

                      <input
                        type='email'
                        id='Email'
                        name='email'
                        className='mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-green-300 outline-none focus:ring-0 focus:border-green-300'
                        required
                        pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
                        placeholder='user@domain.com'
                      />
                    </div>

                    <div className='col-span-6'>
                      <label
                        htmlFor='Message'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-200'
                      >
                        Message
                      </label>

                      <textarea
                        id='Message'
                        name='textarea'
                        rows={4}
                        placeholder='Type your message here...'
                        className='mt-1 w-full rounded-md border border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-green-300 outline-0 focus:ring-0 focus:border-green-300'
                        required
                      />
                    </div>
                    <div className='col-span-6 sm:flex sm:items-center sm:gap-4'>
                      <button
                        type='submit'
                        disabled={sending}
                        className='inline-flex gap-3 shrink-0 rounded-md border border-green-300 hover:bg-gray-900 px-6 xl:px-12 py-3 text-sm font-medium dark:text-white transition hover:text-white focus:outline-none focus:ring active:text-blue-500 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {sending ? "Sending..." : "Send Away"}
                        <FaRegPaperPlane
                          className={`self-center ${sending ? "animate-pulse" : ""}`}
                        />
                      </button>
                    </div>
                    {message && (
                      <div
                        className={`col-span-6 p-3 rounded-md text-sm ${
                          message.includes("Error")
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        }`}
                      >
                        {message}
                      </div>
                    )}
                  </form>
                </div>
              )}
            </main>
          </m.div>
        </LazyMotion>
      </Card>
    </section>
  );
};

export default ContactForm;
