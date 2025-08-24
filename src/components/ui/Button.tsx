interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'custom';
}

export function Button({ children, className = "", isLoading = false, variant = 'primary', ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-[#7C65C1] text-white hover:bg-[#6952A3] px-6 py-3 rounded-lg",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-3 rounded-lg",
    custom: "" // No default classes for custom variant
  };

  const finalClassName = variant === 'custom' 
    ? `${baseClasses} ${className}`
    : `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      className={finalClassName}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
