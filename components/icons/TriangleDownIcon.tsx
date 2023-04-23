import * as React from 'react';

export default function TriangleDownIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={8}
      height={15}
      fill="none"
      {...props}
    >
      <path fill="#D9D9D9" d="M4 15 .536 9h6.928L4 15Z" />
      <path fill="#fff" fillOpacity={0.2} d="m4 0 3.464 6H.536L4 0Z" />
    </svg>
  );
}
