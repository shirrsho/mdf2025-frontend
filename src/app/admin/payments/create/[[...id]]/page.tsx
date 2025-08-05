import React from 'react';
import { OptionsalParamsType } from '@/types';
import { CreateTemplateFormId } from '@/components/template';

const CreateTemplate = ({ params }: OptionsalParamsType) => {
  const templateId = params.id?.[0];
  return (
    <div className='min-h-screen'>
      <CreateTemplateFormId templateId={templateId} />
    </div>
  );
};

export default CreateTemplate;
