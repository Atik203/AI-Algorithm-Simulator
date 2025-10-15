import * as React from "react";

import { cn } from "@lib/utils";

type InputElement = HTMLInputElement;

export interface InputProps extends React.InputHTMLAttributes<InputElement> {}

export const Input = React.forwardRef<InputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Ensure datetime inputs show picker and have proper width
          type === "datetime-local" &&
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
