import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'

/**
 * Reusable Button component
 *
 * @param {'primary'|'ghost'|'danger'} variant
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {React.ReactNode} children
 * @param {string} className
 */
export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const base =
    variant === 'primary' ? 'btn-primary' :
    variant === 'ghost'   ? 'btn-ghost'   :
    'btn-ghost text-red-400 hover:border-red-500/50 hover:text-red-300'

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { y: -2 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      className={`${base} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader
          size={15}
          style={{ animation: 'spin 1s linear infinite' }}
          className="shrink-0"
        />
      )}
      {children}
    </motion.button>
  )
}
