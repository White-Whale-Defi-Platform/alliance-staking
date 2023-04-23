import React, { CSSProperties } from 'react';
import { CircularProgress } from '@chakra-ui/react';

interface CustomButtonProps {
  onClick: (event: React.MouseEvent) => void;
  disabled: boolean;
  loading: boolean;
  buttonLabel: string;
  height: string;
  width: string;
  transform?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  disabled,
  loading,
  buttonLabel,
  height,
  width,
  transform,
}) => {
  const similarButtonStyles: CSSProperties = {
    borderRadius: '78px',
    width: width,
    height: height,
    padding: '1rem 1.5rem',
    background: disabled ? 'gray' : '#6ACA70',
    color: 'white',
    fontWeight: 'bold',
    transform: transform,
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: '0.2s all',
    opacity: disabled ? 0.8 : 1,
    alignSelf: 'center',
    textTransform: 'capitalize',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onClick(event);
  };

  return (
    <button
      style={similarButtonStyles}
      onClick={handleClick}
      disabled={disabled}
    >
      {loading ? (
        <CircularProgress isIndeterminate size="24px" color="white" />
      ) : (
        buttonLabel
      )}
    </button>
  );
};

export default CustomButton;
