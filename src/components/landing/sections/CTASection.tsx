'use client';
import React from 'react';
import { Button } from 'antd';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  'Access to 1,200+ companies',
  'Virtual interview scheduling',
  'Real-time chat with recruiters',
  'AI-powered job matching',
  'Professional networking opportunities',
  'Career development resources'
];

export const CTASection: React.FC = () => {
  return (
    <section className='bg-background px-4 py-20'>
      <div className='mx-auto max-w-7xl'>
        <div className='rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 p-8 md:p-16'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            {/* Content */}
            <div className='space-y-8'>
              <div className='space-y-4'>
                <h2 className='text-3xl font-bold text-white lg:text-4xl'>
                  Ready to Take the Next Step in Your
                  <span className='text-primary'> Career Journey?</span>
                </h2>
                <p className='text-lg text-gray-300'>
                  Join the Digital Job Fair 2025 and connect with your future employer. 
                  Registration is free and takes less than 2 minutes.
                </p>
              </div>

              {/* Benefits List */}
              <div className='space-y-3'>
                {benefits.map((benefit, index) => (
                  <div key={index} className='flex items-center space-x-3'>
                    <CheckCircle className='h-5 w-5 flex-shrink-0 text-primary' />
                    <span className='text-gray-300'>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
                <Link href='/signup'>
                  <Button 
                    type='primary' 
                    size='large' 
                    className='bg-primary border-primary hover:bg-primary-400 w-full sm:w-auto'
                    icon={<ArrowRight className='h-4 w-4' />}
                    iconPosition='end'
                  >
                    Register for Free
                  </Button>
                </Link>
                <Link href='/signin'>
                  <Button 
                    size='large' 
                    className='border-white text-white hover:bg-white hover:text-background w-full sm:w-auto'
                  >
                    Already Have Account?
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className='flex items-center space-x-8 pt-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-primary'>4.9/5</div>
                  <div className='text-sm text-gray-400'>User Rating</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-primary'>99.9%</div>
                  <div className='text-sm text-gray-400'>Uptime</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-primary'>24/7</div>
                  <div className='text-sm text-gray-400'>Support</div>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className='relative'>
              <div className='rounded-2xl bg-background-200 p-8'>
                <div className='space-y-6'>
                  {/* Mock Interface */}
                  <div className='rounded-lg bg-background-300 p-4'>
                    <div className='mb-3 flex items-center space-x-3'>
                      <div className='h-8 w-8 rounded-full bg-primary'></div>
                      <div className='flex-1'>
                        <div className='h-2 w-24 rounded bg-gray-600'></div>
                        <div className='mt-1 h-2 w-16 rounded bg-gray-700'></div>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='h-2 w-full rounded bg-gray-600'></div>
                      <div className='h-2 w-3/4 rounded bg-gray-700'></div>
                    </div>
                  </div>
                  
                  <div className='rounded-lg bg-background-300 p-4'>
                    <div className='mb-3 flex items-center space-x-3'>
                      <div className='h-8 w-8 rounded-full bg-green-500'></div>
                      <div className='flex-1'>
                        <div className='h-2 w-20 rounded bg-gray-600'></div>
                        <div className='mt-1 h-2 w-12 rounded bg-gray-700'></div>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='h-2 w-full rounded bg-gray-600'></div>
                      <div className='h-2 w-2/3 rounded bg-gray-700'></div>
                    </div>
                  </div>

                  <div className='rounded-lg bg-primary/10 p-4 text-center'>
                    <div className='text-lg font-semibold text-primary'>
                      Interview Scheduled!
                    </div>
                    <div className='text-sm text-gray-300'>
                      Tomorrow at 2:00 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className='absolute -right-4 -top-4 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow-lg'>
                ✨ New Match
              </div>
              <div className='absolute -bottom-4 -left-4 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white shadow-lg'>
                📩 Interview Invite
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
