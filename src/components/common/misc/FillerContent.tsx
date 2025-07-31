import React from 'react';

interface FillerContentProps {
  rows?: number;
  height?: number;
}

export const FillerContent: React.FC<FillerContentProps> = ({
  rows = 50,
  height = 100,
}) => {
  return (
    <div>
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          style={{
            height: `${height}px`,
            backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0',
            display: 'flex',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          Row {index + 1}
        </div>
      ))}
    </div>
  );
};
