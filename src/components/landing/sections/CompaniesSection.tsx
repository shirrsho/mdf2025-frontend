'use client';
import React from 'react';
import { Card, Tag } from 'antd';
import { MapPin, Users, Briefcase } from 'lucide-react';

const companies = [
  {
    name: 'TechCorp Solutions',
    logo: '🚀',
    industry: 'Technology',
    location: 'San Francisco, CA',
    employees: '1,000-5,000',
    openPositions: 45,
    description: 'Leading software development company specializing in AI and machine learning solutions.',
    tags: ['Remote Work', 'Flexible Hours', 'Stock Options']
  },
  {
    name: 'Global Finance Inc',
    logo: '💼',
    industry: 'Finance',
    location: 'New York, NY',
    employees: '5,000+',
    openPositions: 32,
    description: 'International financial services company with operations in over 50 countries.',
    tags: ['Health Benefits', 'Career Growth', 'Bonus Program']
  },
  {
    name: 'Healthcare Innovations',
    logo: '🏥',
    industry: 'Healthcare',
    location: 'Boston, MA',
    employees: '500-1,000',
    openPositions: 28,
    description: 'Revolutionary healthcare technology company improving patient care worldwide.',
    tags: ['Mission Driven', 'R&D Focus', 'Flexible Schedule']
  },
  {
    name: 'Green Energy Co',
    logo: '🌱',
    industry: 'Energy',
    location: 'Austin, TX',
    employees: '200-500',
    openPositions: 18,
    description: 'Sustainable energy solutions provider focused on renewable energy infrastructure.',
    tags: ['Environmental Impact', 'Innovation', 'Work-Life Balance']
  },
  {
    name: 'DataDriven Analytics',
    logo: '📊',
    industry: 'Data Science',
    location: 'Seattle, WA',
    employees: '100-500',
    openPositions: 22,
    description: 'Advanced analytics and business intelligence solutions for enterprise clients.',
    tags: ['Cutting Edge Tech', 'Learning Budget', 'Remote First']
  },
  {
    name: 'Creative Design Studio',
    logo: '🎨',
    industry: 'Design',
    location: 'Los Angeles, CA',
    employees: '50-200',
    openPositions: 15,
    description: 'Award-winning design studio creating exceptional digital experiences.',
    tags: ['Creative Freedom', 'Modern Office', 'Team Events']
  }
];

export const CompaniesSection: React.FC = () => {
  return (
    <section id='companies' className='bg-background-100 px-4 py-20'>
      <div className='mx-auto max-w-7xl'>
        {/* Section Header */}
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white lg:text-4xl'>
            Top Companies 
            <span className='text-primary'> Hiring Now</span>
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-300'>
            Discover opportunities with industry-leading companies across various sectors. 
            From startups to Fortune 500 companies, find the perfect match for your career.
          </p>
        </div>

        {/* Companies Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {companies.map((company, index) => (
            <Card
              key={index}
              className='border-background-200 bg-background-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer'
              bodyStyle={{ padding: '24px' }}
            >
              <div className='space-y-4'>
                {/* Company Header */}
                <div className='flex items-start justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl'>
                      {company.logo}
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-white'>
                        {company.name}
                      </h3>
                      <p className='text-sm text-primary'>{company.industry}</p>
                    </div>
                  </div>
                  <div className='rounded-full bg-primary px-3 py-1 text-xs font-medium text-white'>
                    {company.openPositions} jobs
                  </div>
                </div>

                {/* Company Info */}
                <div className='space-y-2'>
                  <div className='flex items-center text-sm text-gray-300'>
                    <MapPin className='mr-2 h-4 w-4' />
                    {company.location}
                  </div>
                  <div className='flex items-center text-sm text-gray-300'>
                    <Users className='mr-2 h-4 w-4' />
                    {company.employees} employees
                  </div>
                </div>

                {/* Description */}
                <p className='text-sm text-gray-300 line-clamp-2'>
                  {company.description}
                </p>

                {/* Tags */}
                <div className='flex flex-wrap gap-1'>
                  {company.tags.map((tag, tagIndex) => (
                    <Tag
                      key={tagIndex}
                      className='border-primary/30 bg-primary/10 text-primary text-xs'
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>

                {/* Action Button */}
                <button className='w-full rounded-lg border border-primary/30 bg-primary/5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10'>
                  View Open Positions
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className='mt-12 text-center'>
          <button className='rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-400'>
            View All Companies
          </button>
        </div>

        {/* Company Registration CTA */}
        <div className='mt-16 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center'>
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary'>
            <Briefcase className='h-8 w-8 text-white' />
          </div>
          <h3 className='mb-4 text-2xl font-bold text-white'>
            Are You a Company Looking to Hire?
          </h3>
          <p className='mb-6 text-gray-300'>
            Join our platform and connect with thousands of qualified candidates. 
            Post jobs, schedule interviews, and find the perfect talent for your team.
          </p>
          <button className='rounded-lg border border-primary bg-transparent px-8 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white'>
            Register Your Company
          </button>
        </div>
      </div>
    </section>
  );
};
