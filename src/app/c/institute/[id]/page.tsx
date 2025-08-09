import React from 'react';
import { CompanyDetail } from '@/components/company';

const DetailCompany = ({ params }: any) => {
  const companyId = params.id;
  return (
    <div className='min-h-screen'>
      <CompanyDetail mode='company' companyId={companyId ?? ''} />
    </div>
  );
};

export default DetailCompany;
