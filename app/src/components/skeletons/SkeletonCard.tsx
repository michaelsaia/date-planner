export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card animate-pulse">
      {/* Image placeholder */}
      <div className="h-40 rounded-t-xl bg-border/50" />

      <div className="p-3 sm:p-4 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 rounded bg-border/50" />

        {/* Description lines */}
        <div className="h-3 w-full rounded bg-border/30" />
        <div className="h-3 w-5/6 rounded bg-border/30" />

        {/* Activity preview */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-border/40" />
            <div className="h-3 w-2/3 rounded bg-border/30" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-border/40" />
            <div className="h-3 w-1/2 rounded bg-border/30" />
          </div>
        </div>

        {/* Footer: cost + interest badges */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="h-4 w-12 rounded bg-border/50" />
          <div className="flex gap-1">
            <div className="h-4 w-16 rounded-full bg-border/30" />
            <div className="h-4 w-14 rounded-full bg-border/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
