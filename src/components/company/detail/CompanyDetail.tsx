'use client';
import React from 'react';
import { Card, Tag, Button, Typography, Row, Col, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Mail, Phone, User, MapPin, Building2, Globe, Calendar } from 'lucide-react';
import { useGetCompanyById } from '@/apis';
import { CompanySize } from '@/interfaces';

const { Title, Text, Paragraph } = Typography;

interface CompanyDetailProps {
  companyId: string;
}

export const CompanyDetail: React.FC<CompanyDetailProps> = ({ companyId }) => {
  const router = useRouter();
  const { data: company, isLoading } = useGetCompanyById(companyId);

  const getSizeColor = (size: CompanySize) => {
    const colors = {
      [CompanySize.STARTUP]: '#F4612E',
      [CompanySize.SMALL]: '#395b50',
      [CompanySize.MEDIUM]: '#bfab25',
      [CompanySize.LARGE]: '#6a0136',
      [CompanySize.ENTERPRISE]: '#1f2f16',
    };
    return colors[size] || '#F4612E';
  };

  const getSizeLabel = (size: CompanySize) => {
    const labels = {
      [CompanySize.STARTUP]: 'Startup',
      [CompanySize.SMALL]: 'Small Company',
      [CompanySize.MEDIUM]: 'Medium Company',
      [CompanySize.LARGE]: 'Large Company',
      [CompanySize.ENTERPRISE]: 'Enterprise',
    };
    return labels[size] || size;
  };

  const getSizeDescription = (size: CompanySize) => {
    const descriptions = {
      [CompanySize.STARTUP]: '1-10 employees',
      [CompanySize.SMALL]: '11-50 employees',
      [CompanySize.MEDIUM]: '51-200 employees',
      [CompanySize.LARGE]: '201-1000 employees',
      [CompanySize.ENTERPRISE]: '1000+ employees',
    };
    return descriptions[size] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-100 dark:bg-background-dark-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background-100 dark:bg-background-dark-100 flex items-center justify-center">
        <Card className="text-center p-8 bg-white dark:bg-background-dark-200">
          <Title level={3} className="text-danger dark:text-danger-dark mb-4">Company Not Found</Title>
          <Text className="text-paragraph dark:text-paragraph-dark mb-6">The company you&apos;re looking for doesn&apos;t exist or has been removed.</Text>
          <Button 
            type="primary" 
            onClick={() => router.push('/admin/companies')}
            className="bg-primary hover:bg-primary-600 border-primary hover:border-primary-600 text-white"
          >
            Back to Companies
          </Button>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/admin/companies/create/${companyId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background-100 dark:bg-background-dark-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleBack}
            className="mb-6 text-paragraph dark:text-paragraph-dark hover:text-heading dark:hover:text-heading-dark border-background-200 dark:border-background-dark-300 hover:border-background-300 dark:hover:border-background-dark-200"
          >
            Back to Companies
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start space-x-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {company.logoUrl ? (
                  <img 
                    src={company.logoUrl} 
                    alt={company.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-background-200 dark:border-background-dark-300 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl shadow-sm">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Title level={2} className="mb-0 text-heading dark:text-heading-dark">
                    {company.name}
                  </Title>
                  <Tag 
                    color={getSizeColor(company.size)} 
                    className="px-3 py-1 rounded-full font-medium border-0"
                    style={{ color: 'white' }}
                  >
                    {getSizeLabel(company.size)}
                  </Tag>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-paragraph dark:text-paragraph-dark mb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-textColor dark:text-textColor-dark" />
                    <Text strong className="text-heading dark:text-heading-dark">{company.industry}</Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-textColor dark:text-textColor-dark" />
                    <Text className="text-paragraph dark:text-paragraph-dark">{company.location}</Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-textColor dark:text-textColor-dark" />
                    <Text className="text-paragraph dark:text-paragraph-dark">{getSizeDescription(company.size)}</Text>
                  </div>
                </div>

                {company.website && (
                  <div className="mb-4">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300 font-medium transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{company.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Button */}
            <div className="flex-shrink-0">
              <Button
                type="primary"
                size="large"
                onClick={handleEdit}
                className="bg-primary hover:bg-primary-600 border-primary hover:border-primary-600 px-8 h-12 font-medium text-white"
              >
                ✏️ Edit Company
              </Button>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Company Description */}
          <Col xs={24} lg={16}>
            <Card className="shadow-sm h-full bg-white dark:bg-background-dark-200">
              <Title level={4} className="text-heading dark:text-heading-dark mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-dark-200 text-primary-600 dark:text-primary-dark-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3">📝</span>
                About the Company
              </Title>
              <Paragraph className="text-paragraph dark:text-paragraph-dark text-base leading-relaxed">
                {company.description || 'No description provided.'}
              </Paragraph>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={8}>
            <Card className="shadow-sm h-full bg-white dark:bg-background-dark-200">
              <Title level={4} className="text-heading dark:text-heading-dark mb-6 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-dark-100 text-indigo-600 dark:text-indigo-dark-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">📞</span>
                Contact Information
              </Title>
              
              <div className="space-y-6">
                {company.contactEmail && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-dark-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-secondary-600 dark:text-secondary-dark-400" />
                    </div>
                    <div>
                      <Text strong className="text-heading dark:text-heading-dark block">Email</Text>
                      <a 
                        href={`mailto:${company.contactEmail}`}
                        className="text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300 transition-colors"
                      >
                        {company.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {company.contactNumber && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-dark-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-dark-600" />
                    </div>
                    <div>
                      <Text strong className="text-heading dark:text-heading-dark block">Phone</Text>
                      <a 
                        href={`tel:${company.contactNumber}`}
                        className="text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300 transition-colors"
                      >
                        {company.contactNumber}
                      </a>
                    </div>
                  </div>
                )}

                {company.createdAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-dark-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-secondary-600 dark:text-secondary-dark-400" />
                    </div>
                    <div>
                      <Text strong className="text-heading dark:text-heading-dark block">Registered</Text>
                      <Text className="text-paragraph dark:text-paragraph-dark">
                        {new Date(company.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </div>
                  </div>
                )}

                {!company.contactEmail && !company.contactNumber && (
                  <div className="text-center py-8">
                    <Text className="text-textColor dark:text-textColor-dark">No contact information available</Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Company Stats */}
        <Row gutter={[24, 24]} className="mt-6">
          <Col xs={24}>
            <Card className="shadow-sm bg-white dark:bg-background-dark-200">
              <Title level={4} className="text-heading dark:text-heading-dark mb-6 flex items-center">
                <span className="w-8 h-8 bg-secondary-100 dark:bg-secondary-dark-200 text-secondary-600 dark:text-secondary-dark-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">📊</span>
                Company Details
              </Title>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className="text-center p-4 bg-background-100 dark:bg-background-dark-100 rounded-lg">
                    <Building2 className="w-8 h-8 text-primary dark:text-primary-dark mx-auto mb-2" />
                    <Text strong className="block text-heading dark:text-heading-dark">Industry</Text>
                    <Text className="text-paragraph dark:text-paragraph-dark">{company.industry}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className="text-center p-4 bg-background-100 dark:bg-background-dark-100 rounded-lg">
                    <MapPin className="w-8 h-8 text-indigo-600 dark:text-indigo-dark-600 mx-auto mb-2" />
                    <Text strong className="block text-heading dark:text-heading-dark">Location</Text>
                    <Text className="text-paragraph dark:text-paragraph-dark">{company.location}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className="text-center p-4 bg-background-100 dark:bg-background-dark-100 rounded-lg">
                    <User className="w-8 h-8 text-secondary dark:text-secondary-dark mx-auto mb-2" />
                    <Text strong className="block text-heading dark:text-heading-dark">Company Size</Text>
                    <Text className="text-paragraph dark:text-paragraph-dark">{getSizeLabel(company.size)}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className="text-center p-4 bg-background-100 dark:bg-background-dark-100 rounded-lg">
                    <Globe className="w-8 h-8 text-purple-600 dark:text-purple-dark-600 mx-auto mb-2" />
                    <Text strong className="block text-heading dark:text-heading-dark">Website</Text>
                    {company.website ? (
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300 transition-colors text-sm"
                      >
                        Visit Website
                      </a>
                    ) : (
                      <Text className="text-textColor dark:text-textColor-dark text-sm">Not provided</Text>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
