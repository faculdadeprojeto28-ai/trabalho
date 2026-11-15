'use client';

import React from 'react';
import {
  Layers,
  Grid,
  Package,
  Boxes,
  FolderTree,
  Paintbrush,
  Zap,
  Droplets,
  DoorClosed,
  Wrench,
  Bath,
  Home,
  Mountain,
  Hammer,
  MoreHorizontal,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Layers':
      return <Layers {...props} />;
    case 'Grid':
      return <Grid {...props} />;
    case 'Package':
      return <Package {...props} />;
    case 'Boxes':
      return <Boxes {...props} />;
    case 'FolderTree':
      return <FolderTree {...props} />;
    case 'Paintbrush':
      return <Paintbrush {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'DoorClosed':
      return <DoorClosed {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'Bath':
      return <Bath {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Mountain':
      return <Mountain {...props} />;
    case 'Hammer':
      return <Hammer {...props} />;
    default:
      return <MoreHorizontal {...props} />;
  }
};
