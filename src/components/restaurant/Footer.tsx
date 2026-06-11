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
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        {intro.socialLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {intro.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.address}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--elevated)]"
              >
                <span>{SOCIAL_ICONS[link.name] ?? "🔗"}</span>
                {link.name}
              </a>
            ))}
          </div>
        )}

        <p className="text-xs text-[var(--muted-light)]">
          Powered by Rory · {intro.name}
        </p>
      </div>
    </footer>
  );
}
