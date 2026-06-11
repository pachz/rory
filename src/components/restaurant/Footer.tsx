import type { EntityIntro } from "@/lib/graphql/types";

interface FooterProps {
  intro: EntityIntro;
}

const SOCIAL_ICONS: Record<string, string> = {
  Instagram: "📷",
  WhatsApp: "💬",
  Telegram: "✈️",
  Phone: "📞",
  Location: "📍",
};

export function Footer({ intro }: FooterProps) {
  return (
    <footer className="border-t border-black/5 bg-[var(--surface)] px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        {intro.socialLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {intro.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.address}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-black/8 px-4 py-2 text-sm font-medium transition hover:bg-black/5"
              >
                <span>{SOCIAL_ICONS[link.name] ?? "🔗"}</span>
                {link.name}
              </a>
            ))}
          </div>
        )}

        <p className="text-xs text-black/35">
          Powered by Rory · {intro.name}
        </p>
      </div>
    </footer>
  );
}
