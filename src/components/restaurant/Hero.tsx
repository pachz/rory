import { RemoteImage } from "@/components/ui/RemoteImage";
import type { EntityIntro } from "@/lib/graphql/types";

interface HeroProps {
  intro: EntityIntro;
}

export function Hero({ intro }: HeroProps) {
  return (
    <section className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full overflow-hidden">
      <RemoteImage
        src={intro.coverPhoto}
        alt={intro.name}
        fill
        priority
        variant="hero"
        sizes="100vw"
        containerClassName="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-16 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-end gap-4">
          <RemoteImage
            src={intro.logo}
            alt={intro.name}
            fill
            variant="logo"
            sizes="96px"
            containerClassName="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/30 bg-white shadow-xl sm:h-24 sm:w-24"
            className="object-cover"
          />
          <div className="min-w-0 text-white">
            {intro.type && (
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/70">
                {intro.type.label}
              </p>
            )}
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {intro.name}
            </h1>
            {intro.slogan && (
              <p className="mt-1 text-sm text-white/85 sm:text-base">
                {intro.slogan}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
