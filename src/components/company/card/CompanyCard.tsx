import { ICompany } from '@/interfaces';

interface CompanyCardProps {
  company: ICompany;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105'>
      <div className='relative flex h-48 w-full items-center justify-center'></div>
      <div className='p-4'>
        <h2 className='mb-2 text-xl font-semibold'>{company.name}</h2>
      </div>
    </div>
  );
};
