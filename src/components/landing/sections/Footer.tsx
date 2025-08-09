'use client';
import React from 'react';
import { Button } from 'antd';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  jobSeekers: [
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Career Advice', href: '/advice' },
    { name: 'Resume Builder', href: '/resume' },
    { name: 'Interview Tips', href: '/interview-tips' },
    { name: 'Salary Guide', href: '/salary' },
  ],
  employers: [
    { name: 'Post Jobs', href: '/post-job' },
    { name: 'Search Resumes', href: '/resumes' },
    { name: 'Employer Branding', href: '/branding' },
    { name: 'Recruitment Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
  ],
  resources: [
    { name: 'Help Center', href: '/help' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Site Map', href: '/sitemap' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', name: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', name: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', name: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', name: 'Instagram' },
];

export const Footer: React.FC = () => {
  return (
    <footer className='border-t border-background-200 bg-background-300'>
      {/* Newsletter Section */}
      <div className='border-b border-background-200 px-4 py-12'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid items-center gap-8 lg:grid-cols-2'>
            <div>
              <h3 className='text-2xl font-bold text-white'>
                Stay Updated with Latest Job Opportunities
              </h3>
              <p className='mt-2 text-gray-400'>
                Get weekly job alerts, career tips, and industry insights
                delivered to your inbox.
              </p>
            </div>
            <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <div className='flex-1'>
                <input
                  type='email'
                  placeholder='Enter your email address'
                  className='w-full rounded-lg border border-background-100 bg-background-200 px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                />
              </div>
              <Button
                type='primary'
                size='large'
                className='border-primary bg-primary hover:bg-primary-400'
                icon={<ArrowRight className='h-4 w-4' />}
                iconPosition='end'
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='px-4 py-16'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid gap-8 lg:grid-cols-5'>
            {/* Company Info */}
            <div className='lg:col-span-2'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-white'>
                  Digital Job Fair
                </h2>
                <p className='mt-4 text-gray-400'>
                  Connecting talented professionals with their dream careers.
                  Join thousands of job seekers and employers in the digital
                  revolution of recruitment.
                </p>
              </div>

              {/* Contact Info */}
              <div className='space-y-3'>
                <div className='flex items-center space-x-3 text-gray-400'>
                  <MapPin className='h-5 w-5 text-primary' />
                  <span>123 Business District, Digital City, DC 12345</span>
                </div>
                <div className='flex items-center space-x-3 text-gray-400'>
                  <Phone className='h-5 w-5 text-primary' />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className='flex items-center space-x-3 text-gray-400'>
                  <Mail className='h-5 w-5 text-primary' />
                  <span>contact@digitaljobfair.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className='mt-6 flex space-x-4'>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      className='flex h-10 w-10 items-center justify-center rounded-full bg-background-200 text-gray-400 transition-colors hover:bg-primary hover:text-white'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Icon className='h-5 w-5' />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Links */}
            <div>
              <h3 className='mb-4 text-lg font-semibold text-white'>Company</h3>
              <ul className='space-y-2'>
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className='text-gray-400 transition-colors hover:text-primary'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='mb-4 text-lg font-semibold text-white'>
                Job Seekers
              </h3>
              <ul className='space-y-2'>
                {footerLinks.jobSeekers.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className='text-gray-400 transition-colors hover:text-primary'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='mb-4 text-lg font-semibold text-white'>
                Employers
              </h3>
              <ul className='space-y-2'>
                {footerLinks.employers.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className='text-gray-400 transition-colors hover:text-primary'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources Section */}
          <div className='mt-12 border-t border-background-200 pt-8'>
            <div className='grid gap-8 md:grid-cols-2'>
              <div>
                <h3 className='mb-4 text-lg font-semibold text-white'>
                  Resources
                </h3>
                <div className='grid grid-cols-2 gap-2'>
                  {footerLinks.resources.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className='text-gray-400 transition-colors hover:text-primary'
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='mb-4 text-lg font-semibold text-white'>
                  Download Our App
                </h3>
                <div className='flex space-x-4'>
                  <Link
                    href='#'
                    className='flex items-center space-x-2 rounded-lg bg-background-200 px-4 py-2 transition-colors hover:bg-background-100'
                  >
                    <div className='flex h-8 w-8 items-center justify-center rounded bg-white'>
                      📱
                    </div>
                    <div>
                      <div className='text-xs text-gray-400'>
                        Download on the
                      </div>
                      <div className='text-sm font-medium text-white'>
                        App Store
                      </div>
                    </div>
                  </Link>
                  <Link
                    href='#'
                    className='flex items-center space-x-2 rounded-lg bg-background-200 px-4 py-2 transition-colors hover:bg-background-100'
                  >
                    <div className='flex h-8 w-8 items-center justify-center rounded bg-green-500'>
                      ▶️
                    </div>
                    <div>
                      <div className='text-xs text-gray-400'>Get it on</div>
                      <div className='text-sm font-medium text-white'>
                        Google Play
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-background-200 px-4 py-6'>
        <div className='mx-auto max-w-7xl'>
          <div className='flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
            <p className='text-gray-400'>
              © 2025 Digital Job Fair. All rights reserved.
            </p>
            <div className='flex space-x-6 text-sm'>
              <Link href='/terms' className='text-gray-400 hover:text-primary'>
                Terms
              </Link>
              <Link
                href='/privacy'
                className='text-gray-400 hover:text-primary'
              >
                Privacy
              </Link>
              <Link
                href='/cookies'
                className='text-gray-400 hover:text-primary'
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
