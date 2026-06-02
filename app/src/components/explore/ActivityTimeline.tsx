"use client";

type Activity = {
  name: string;
  venueName: string;
  venueUrl: string | null;
  mapsUrl: string | null;
  order: number;
};

export default function ActivityTimeline({
  activities,
}: {
  activities: Activity[];
}) {
  if (activities.length === 0) return null;

  return (
    <div className="space-y-0">
      {activities.map((activity, idx) => (
        <div key={activity.order} className="relative flex gap-3 sm:gap-4">
          {/* Timeline line */}
          {idx < activities.length - 1 && (
            <div className="absolute left-[15px] top-9 bottom-0 w-0.5 bg-border" />
          )}

          {/* Step number */}
          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {activity.order}
          </div>

          {/* Content — full-width card on mobile */}
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-card p-3 mb-3 sm:border-0 sm:bg-transparent sm:p-0 sm:mb-0 sm:pb-6">
            <h4 className="text-sm font-semibold text-foreground">
              {activity.name}
            </h4>
            {activity.venueName && (
              <p className="mt-0.5 text-sm text-muted">{activity.venueName}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {activity.venueUrl && (
                <a
                  href={activity.venueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-card sm:py-1"
                >
                  <LinkIcon />
                  Visit Website
                </a>
              )}
              {activity.mapsUrl && (
                <a
                  href={activity.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-card sm:py-1"
                >
                  <MapPinIcon />
                  View on Map
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkIcon() {
  return (
    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
