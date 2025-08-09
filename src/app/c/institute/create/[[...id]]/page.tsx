import React from 'react';
import { OptionsalParamsType } from '@/types';
import { CreateCompanyFormId } from '@/components/company';

const CreateCompany = ({ params }: OptionsalParamsType) => {
  const companyId = params.id?.[0];
  return (
    <div className='min-h-screen'>
      <CreateCompanyFormId mode='company' companyId={companyId} />
    </div>
  );
};

export default CreateCompany;
