'use client';
import React from 'react';
import { MailHistoryDetails } from '@/components/email';

const EmailHistoryDetailsPage = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  return <MailHistoryDetails id={id} />;
};

export default EmailHistoryDetailsPage;
