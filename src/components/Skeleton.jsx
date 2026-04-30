// ─────────────────────────────────────────────────────────────
//  Skeleton placeholder components for loading states
// ─────────────────────────────────────────────────────────────

export function VideoCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="skeleton h-40 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
    </div>
  )
}

export function NoticeCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="skeleton h-4 flex-1 rounded" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-8 w-8 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-16 rounded" />
    </div>
  )
}
