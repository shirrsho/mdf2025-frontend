import Image from 'next/image';

interface LogoLoaderProps {
  className?: string;
}

export const LogoLoader = ({ className = '' }: LogoLoaderProps) => {
  return (
    <div
      className={`flex min-h-[80vh] flex-col items-center justify-center p-4 ${className}`}
    >
      <div className='relative flex flex-col items-center'>
        <div className='motion-preset-spin absolute inset-0 rounded-full border-4 border-gray-200 border-t-primary motion-duration-1500'></div>
        <div className='z-10 m-4 flex h-12 w-12 flex-col items-center justify-center'>
          <Image
            src='/round_logo.png'
            alt='Logo'
            width={500}
            height={500}
            className='h-auto w-12'
          />
        </div>
      </div>
      <span className='motion-preset-typewriter-[16] mt-2 text-center text-sm font-semibold text-paragraph dark:text-paragraph-dark'>
        Loading
        <span className='inline-flex'>
          <span className='animate-[bounce_1s_infinite]'>.</span>
          <span className='animate-[bounce_1s_infinite_0.2s]'>.</span>
          <span className='animate-[bounce_1s_infinite_0.4s]'>.</span>
        </span>
      </span>
    </div>
  );
};
