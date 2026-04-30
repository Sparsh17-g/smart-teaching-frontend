import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

export default function EmptyState({ icon = 'Inbox', title, description, action }) {
  const Icon = Icons[icon] || Icons.Inbox

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06]
                      flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-400 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
