'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 text-center dark:bg-gray-900'>
          <h1 className='mb-4 text-6xl font-bold text-red-500 dark:text-red-400'>
            Oops!
          </h1>
          <p className='mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-100'>
            Something went wrong...
          </p>
          <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
            We seem to be having some technical difficulties. Please try again.
          </p>
        </div>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
