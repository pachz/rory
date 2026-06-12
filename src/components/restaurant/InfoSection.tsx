import type { Amenity, EntityIntro } from "@/lib/graphql/types";
import { formatTime, formatWeekday } from "@/lib/format";

interface InfoSectionProps {
  intro: EntityIntro;
  amenities: Amenity[];
}

export function InfoSection({ intro, amenities }: InfoSectionProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="grid gap-6 sm:grid-cols-2">
        {intro.address && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-2 text-sm font-bold text-[var(--muted-light)]">
              آدرس
            </h3>
            <p className="text-sm leading-relaxed">{intro.address}</p>
            {intro.location && (
              <a
                href={`https://maps.google.com/?q=${intro.location.coordinates[1]},${intro.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-[var(--brand-accent)]"
              >
                مشاهده روی نقشه ←
              </a>
            )}
          </div>
        )}

        {intro.workingHours.length > 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-2 text-sm font-bold text-[var(--muted-light)]">
              ساعات کاری
            </h3>
            <ul className="space-y-1.5 text-sm">
              {intro.workingHours.map((wh) => (
                <li key={wh.id} className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">
                    {formatWeekday(wh.weekday)}
                  </span>
                  <span className="font-medium">
                    {formatTime(wh.startTime)} – {formatTime(wh.endTime)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {intro.phoneNumber && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-2 text-sm font-bold text-[var(--muted-light)]">
              تماس
            </h3>
            <a
              href={`tel:${intro.phoneNumber}`}
              className="text-lg font-semibold text-[var(--brand-accent)]"
              dir="ltr"
            >
              {intro.phoneNumber}
            </a>
          </div>
        )}

        {amenities.length > 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:col-span-2">
            <h3 className="mb-3 text-sm font-bold text-[var(--muted-light)]">
              امکانات
            </h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity.id}
                  className="rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--foreground)]"
                >
                  {amenity.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
