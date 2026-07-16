import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-white/60">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-colors',
              icon ? 'pl-10' : 'pl-4',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'