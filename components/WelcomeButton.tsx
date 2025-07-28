import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const welcomeButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-[#ff6a00] to-[#ff1b9c]',
          'text-white',
          'border-none',
          'hover:scale-105',
          'hover:shadow-[0_0_20px_rgba(255,106,0,0.3)]',
          'focus-visible:ring-[#ff6a00]',
          'focus-visible:ring-offset-[#0b0f19]',
          'active:scale-95'
        ],
        secondary: [
          'bg-transparent',
          'text-[#a05eff]',
          'border-2 border-[#a05eff]',
          'hover:bg-[#a05eff]',
          'hover:text-white',
          'hover:shadow-[0_0_20px_rgba(160,94,255,0.3)]',
          'focus-visible:ring-[#a05eff]',
          'focus-visible:ring-offset-[#0b0f19]',
          'active:scale-95'
        ],
      },
      size: {
        default: 'px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 text-sm sm:text-base',
        sm: 'px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 text-xs sm:text-sm',
        lg: 'px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 text-base sm:text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface WelcomeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof welcomeButtonVariants> {
  asChild?: boolean;
}

const WelcomeButton = React.forwardRef<HTMLButtonElement, WelcomeButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        className={cn(welcomeButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
WelcomeButton.displayName = 'WelcomeButton';

export { WelcomeButton, welcomeButtonVariants };