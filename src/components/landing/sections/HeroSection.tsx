'use client';
import React from 'react';
import { Button } from 'antd';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <section className='relative min-h-screen bg-gradient-to-br from-background via-background-100 to-background-200 px-4 py-20'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-[url("/pattern.svg")] opacity-5'></div>

      {/* Content */}
      <div className='relative mx-auto max-w-7xl'>
        {/* Navigation */}
        {/* <nav className='mb-16 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <img src='/logo-white.png' alt='Logo' className='h-10 w-auto' />
            <span className='text-xl font-bold text-white'>DigitalJobFair</span>
          </div>
          <div className='hidden space-x-8 md:flex'>
            <Link href='#features' className='text-white hover:text-primary'>
              Features
            </Link>
            <Link href='#companies' className='text-white hover:text-primary'>
              Companies
            </Link>
            <Link href='#about' className='text-white hover:text-primary'>
              About
            </Link>
            <Link href='#contact' className='text-white hover:text-primary'>
              Contact
            </Link>
          </div>
          <div className='flex space-x-4'>
            <Link href='/signin'>
              <Button type='text' className='text-white border-white hover:bg-white hover:text-background'>
                Sign In
              </Button>
            </Link>
            <Link href='/signup'>
              <Button type='primary' className='bg-primary border-primary'>
                Get Started
              </Button>
            </Link>
          </div>
        </nav> */}

        {/* Hero Content */}
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='space-y-8'>
            {/* Badge */}
            <div className='inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2'>
              <Calendar className='mr-2 h-4 w-4 text-primary' />
              <span className='text-sm font-medium text-primary'>
                Digital Job Fair 2025
              </span>
            </div>

            {/* Heading */}
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold leading-tight text-white lg:text-6xl'>
                Connect with Your
                <span className='text-primary'> Dream Career</span>
              </h1>
              <p className='text-lg text-gray-300 lg:text-xl'>
                Join thousands of job seekers and top companies in the biggest
                digital job fair of 2025. Discover opportunities, network with
                professionals, and land your dream job.
              </p>
            </div>

            {/* Stats */}
            <div className='flex flex-wrap gap-8'>
              <div className='flex items-center space-x-2'>
                <Users className='h-5 w-5 text-primary' />
                <span className='text-white'>
                  <span className='font-bold text-primary'>10,000+</span> Job
                  Seekers
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <MapPin className='h-5 w-5 text-primary' />
                <span className='text-white'>
                  <span className='font-bold text-primary'>500+</span> Companies
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Link href='/signup'>
                <Button
                  type='primary'
                  size='large'
                  className='w-full border-primary bg-primary hover:bg-primary-400 sm:w-auto'
                  icon={<ArrowRight className='h-4 w-4' />}
                  iconPosition='end'
                >
                  Join Job Fair
                </Button>
              </Link>
              <Link href='#companies'>
                <Button
                  size='large'
                  className='w-full border-white text-white hover:bg-white hover:text-background sm:w-auto'
                >
                  View Companies
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className='relative'>
            <div className='relative rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8'>
              <div className='aspect-square rounded-xl bg-gradient-to-br from-background-200 to-background-300 p-8'>
                <div className='flex h-full items-center justify-center'>
                  <div className='text-center'>
                    <div className='mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary'>
                      <Users className='h-10 w-10 text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-white'>
                      Digital Networking
                    </h3>
                    <p className='text-gray-300'>
                      Connect virtually with industry leaders
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className='absolute -right-4 -top-4 rounded-lg bg-background-100 p-4 shadow-xl'>
              <div className='flex items-center space-x-3'>
                <div className='h-8 w-8 rounded-full bg-primary'></div>
                <div>
                  <p className='text-sm font-medium text-white'>
                    Live Interview
                  </p>
                  <p className='text-xs text-gray-400'>Starting in 5 min</p>
                </div>
              </div>
            </div>

            <div className='absolute -bottom-4 -left-4 rounded-lg bg-background-100 p-4 shadow-xl'>
              <div className='flex items-center space-x-3'>
                <div className='h-8 w-8 rounded-full bg-green-500'></div>
                <div>
                  <p className='text-sm font-medium text-white'>New Match</p>
                  <p className='text-xs text-gray-400'>Tech Company Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
