import { LucideProps } from 'lucide-react';

declare module 'lucide-react' {
  interface LucideIconProps extends LucideProps {
    className?: string;
  }
}
