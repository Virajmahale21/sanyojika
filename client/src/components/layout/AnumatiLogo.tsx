import React from 'react';
import { AnumatiSetuLogo } from './AnumatiSetuLogo';

interface AnumatiLogoProps {
  size?: number;
  className?: string;
  width?: number;
}

export const AnumatiLogo: React.FC<AnumatiLogoProps> = ({ size, width, className = '' }) => {
  return <AnumatiSetuLogo width={width || size || 180} className={className} />;
};

export const AnumatiBrand: React.FC<{
  light?: boolean;
  size?: number;
  titlePrimary?: string;
  titleAccent?: string;
  subtitle?: string;
  className?: string;
}> = ({
  size = 200,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <AnumatiSetuLogo width={size} />
    </div>
  );
};

export default AnumatiLogo;
