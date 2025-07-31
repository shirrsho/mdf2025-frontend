import React from 'react';

interface IHtmlRendererProps {
  htmlString?: string;
  className?: string;
}

export const HtmlRenderer: React.FC<IHtmlRendererProps> = ({
  htmlString,
  className,
}) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlString ?? '' }}
      className={`${className}`}
    />
  );
};
