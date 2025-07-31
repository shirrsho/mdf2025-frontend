export const imageLoader = ({ src }: any) => {
  return `${process.env.NEXT_PUBLIC_BUCKET_URI}/${src}`;
};
