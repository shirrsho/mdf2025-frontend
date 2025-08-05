'use client';
import React from 'react';
import { TrendingUp, Users, Briefcase, Award } from 'lucide-react';

const stats = [
  {
    icon: <Users className='h-8 w-8' />,
    number: '50,000+',
    label: 'Job Seekers Registered',
    description: 'Active professionals looking for opportunities'
  },
  {
    icon: <Briefcase className='h-8 w-8' />,
    number: '1,200+',
    label: 'Companies Participating',
    description: 'From startups to Fortune 500 companies'
  },
  {
    icon: <TrendingUp className='h-8 w-8' />,
    number: '85%',
    label: 'Success Rate',
    description: 'Participants who found job opportunities'
  },
  {
    icon: <Award className='h-8 w-8' />,
    number: '25,000+',
    label: 'Jobs Posted',
    description: 'Active job openings across all industries'
  }
];

export const StatsSection: React.FC = () => {
  return (
    <section className='bg-background px-4 py-20'>
      <div className='mx-auto max-w-7xl'>
        {/* Section Header */}
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white lg:text-4xl'>
            Trusted by Professionals 
            <span className='text-primary'> Worldwide</span>
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-300'>
            Join the largest digital job fair platform and be part of our success story.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='group text-center transition-transform duration-300 hover:scale-105'
            >
              <div className='mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20'>
                <div className='text-primary'>{stat.icon}</div>
              </div>
              <div className='mb-2 text-4xl font-bold text-primary lg:text-5xl'>
                {stat.number}
              </div>
              <h3 className='mb-2 text-xl font-semibold text-white'>
                {stat.label}
              </h3>
              <p className='text-gray-300'>
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Achievement Banner */}
        <div className='mt-20 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 text-center'>
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary'>
            <Award className='h-8 w-8 text-white' />
          </div>
          <h3 className='mb-4 text-2xl font-bold text-white'>
            Award-Winning Platform
          </h3>
          <p className='mx-auto max-w-2xl text-gray-300'>
            Recognized as the &quot;Best Digital Recruitment Platform 2024&quot; by TechRecruitment Awards
            and featured in Forbes as a game-changer in the hiring industry.
          </p>
        </div>
      </div>
    </section>
  );
};
