"use client";

import { useState } from "react";
import Image from "next/image";
import { FaRegPaperPlane } from "react-icons/fa";
import { m, domAnimation, LazyMotion } from "framer-motion";
import { Card } from "flowbite-react";
import { FormEvent } from "react";
import contactusImage from "/public/contact-us.webp";

const ContactForm = () => {
  const [sending, setSending] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const formEntries = Object.fromEntries(formData);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formEntries),
      });
      formElement.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSending(false);
    }
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
            className='lg:grid lg:grid-cols-12 dark:bg-gray-800 place-items-center'
          >
            <section className='relative flex h-32 items-center bg-transparent lg:col-span-5 lg:h-auto xl:col-span-6'>
              <Image
                src={contactusImage}
                width={600}
                height={100}
                alt='Night'
                className='inset-0 h-full w-full object-cover xl:object-contain opacity-60 backdrop-blur-md hover:opacity-90 duration-500 ease-in-out rounded-md'
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
                      <button className='inline-flex gap-3 shrink-0 rounded-md border border-green-300 hover:bg-gray-900 px-6 xl:px-12 py-3 text-sm font-medium dark:text-white transition hover:text-white focus:outline-none focus:ring active:text-blue-500 text-gray-500'>
                        Send Away
                        <FaRegPaperPlane className='self-center' />
                      </button>
                    </div>
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
