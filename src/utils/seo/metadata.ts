import { Metadata } from 'next';

export function generateMetadata(path: string, baseUrl: string): Metadata {
  return {
    title: {
      template: '%s | Porisima',
      default: 'Porisima',
    },
    description: 'Porisima',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      url: `${baseUrl}${path}`,
    },
  };
}
