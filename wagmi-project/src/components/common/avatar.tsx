import React from 'react';

interface AvatarProps {
  name: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 40 }) => {
  // Extract initials from the name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
    return initials;
  };

  const initials = getInitials(name);

  return (
    <div 
      className="flex items-center justify-center rounded-full bg-yellow-400 text-gray-800 font-bold uppercase" 
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
