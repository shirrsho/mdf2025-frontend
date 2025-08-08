import { IPayment } from '@/interfaces';

interface PaymentCardProps {
  payment: IPayment;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105'>
      <div className='relative flex h-48 w-full items-center justify-center'></div>
      <div className='p-4'>
        <h2 className='mb-2 text-xl font-semibold'>{payment.name}</h2>
      </div>
    </div>
  );
};
