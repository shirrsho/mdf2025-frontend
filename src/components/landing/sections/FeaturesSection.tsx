'use client';
import React from 'react';
import { Card } from 'antd';
import {
  Video,
  MessageSquare,
  FileText,
  Users,
  Calendar,
  Award,
  Search,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: <Video className='h-8 w-8' />,
    title: 'Virtual Interviews',
    description:
      'Attend live video interviews with hiring managers from top companies worldwide.',
  },
  {
    icon: <MessageSquare className='h-8 w-8' />,
    title: 'Real-time Chat',
    description:
      'Connect instantly with recruiters and fellow job seekers through our chat platform.',
  },
  {
    icon: <FileText className='h-8 w-8' />,
    title: 'Digital Resume',
    description:
      'Create and share your professional resume with integrated portfolio showcase.',
  },
  {
    icon: <Users className='h-8 w-8' />,
    title: 'Networking Hub',
    description:
      'Build professional connections and expand your network with industry experts.',
  },
  {
    icon: <Calendar className='h-8 w-8' />,
    title: 'Event Scheduling',
    description:
      'Book interview slots and company presentations that fit your schedule.',
  },
  {
    icon: <Award className='h-8 w-8' />,
    title: 'Skill Verification',
    description:
      'Showcase your verified skills and certifications to potential employers.',
  },
  {
    icon: <Search className='h-8 w-8' />,
    title: 'Smart Matching',
    description:
      'AI-powered job matching based on your skills, experience, and preferences.',
  },
  {
    icon: <Globe className='h-8 w-8' />,
    title: 'Global Reach',
    description:
      'Access opportunities from companies across different countries and industries.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id='features' className='bg-background-100 px-4 py-20'>
      <div className='mx-auto max-w-7xl'>
        {/* Section Header */}
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white lg:text-4xl'>
            Everything You Need to
            <span className='text-primary'> Land Your Dream Job</span>
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-300'>
            Our comprehensive platform provides all the tools and features you
            need to connect with employers and advance your career.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature, index) => (
            <Card
              key={index}
              className='border-background-200 bg-background-200 transition-all duration-300 hover:border-primary/30 hover:shadow-lg'
              styles={{ body: { padding: '24px' } }}
            >
              <div className='text-center'>
                <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                  <div className='text-primary'>{feature.icon}</div>
                </div>
                <h3 className='mb-3 text-lg font-semibold text-white'>
                  {feature.title}
                </h3>
                <p className='text-gray-300'>{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center'>
          <div className='rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-8'>
            <h3 className='mb-4 text-2xl font-bold text-white'>
              Ready to Explore Opportunities?
            </h3>
            <p className='mb-6 text-gray-300'>
              Join thousands of professionals who have already found their dream
              jobs.
            </p>
            <div className='flex justify-center'>
              <button className='rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-400'>
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
