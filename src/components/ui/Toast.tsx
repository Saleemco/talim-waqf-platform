import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const colors = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={cn(
            'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg max-w-sm',
            colors[type]
          )}
        >
          {icons[type]}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-auto text-white/50 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}