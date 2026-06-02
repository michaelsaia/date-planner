"use client";

import { useState } from "react";

type LocationStepProps = {
  location: { lat: number; lng: number; label: string } | null;
  onChange: (location: { lat: number; lng: number; label: string } | null) => void;
};

export default function LocationStep({ location, onChange }: LocationStepProps) {
  const [label, setLabel] = useState(location?.label ?? "");
  const [detecting, setDetecting] = useState(false);

  function handleDetectLocation() {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const locationLabel = label || "My Location";
        setLabel(locationLabel);
        onChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: locationLabel,
        });
        setDetecting(false);
      },
      () => {
        setDetecting(false);
      },
    );
  }

  function handleLabelChange(newLabel: string) {
    setLabel(newLabel);
    if (location) {
      onChange({ ...location, label: newLabel });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Where are you based?</h2>
        <p className="mt-1 text-sm text-muted">
          This helps us suggest nearby venues. You can skip this step if you prefer.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="location-label" className="block text-sm font-medium text-foreground">
            Location name
          </label>
          <input
            id="location-label"
            type="text"
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="e.g., Downtown Seattle"
            className="mt-1.5 block w-full rounded-lg border border-border bg-card px-3 py-3 sm:py-2 text-base sm:text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detecting}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 sm:py-2 text-sm font-medium text-foreground transition-colors hover:bg-card/80 min-h-[44px] sm:min-h-0"
        >
          {detecting ? "Detecting..." : "Use my current location"}
        </button>

        {location && (
          <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted" aria-live="polite">
            Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        )}

        {!location && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-muted underline hover:text-foreground"
          >
            Skip — I&apos;ll add my location later
          </button>
        )}
      </div>
    </div>
  );
}
