export default function ProfileSkeleton() {
  return (
    <div className="flex min-h-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-lg space-y-8 sm:space-y-10 animate-pulse">
        {/* Header */}
        <div>
          <div className="h-8 w-48 rounded bg-border/50" />
          <div className="mt-2 h-4 w-72 rounded bg-border/30" />
        </div>

        {/* Interests section */}
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-border/50" />
          <div className="h-4 w-56 rounded bg-border/30" />
          {/* Category groups */}
          {[
            [80, 68, 92, 74],
            [70, 88, 64, 96, 76],
            [84, 72, 90],
          ].map((widths, group) => (
            <div key={group} className="space-y-2">
              <div className="h-3 w-20 rounded bg-border/40" />
              <div className="flex flex-wrap gap-2.5">
                {widths.map((w, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-full bg-border/30"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Budget section */}
        <div className="space-y-4">
          <div className="h-6 w-36 rounded bg-border/50" />
          <div className="h-4 w-48 rounded bg-border/30" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-16 rounded-full bg-border/30" />
            ))}
          </div>
          <div className="h-4 w-32 rounded bg-border/30 mx-auto" />
          <div className="space-y-3">
            <div className="h-6 w-full rounded bg-border/20" />
            <div className="h-6 w-full rounded bg-border/20" />
          </div>
        </div>

        {/* Location section */}
        <div className="space-y-4">
          <div className="h-6 w-44 rounded bg-border/50" />
          <div className="h-4 w-60 rounded bg-border/30" />
          <div className="h-11 w-full rounded-lg bg-border/20" />
          <div className="h-11 w-48 rounded-full bg-border/30" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-11 w-36 rounded-full bg-border/40" />
          <div className="h-11 w-36 rounded-full bg-border/20" />
        </div>
      </div>
    </div>
  );
}
