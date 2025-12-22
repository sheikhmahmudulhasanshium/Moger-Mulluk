import Link from "next/link";
import { useTranslations, useMessages } from "next-intl";

interface PageLink {
  title: string;
  link: string;
}

const Footer = () => {
  const t = useTranslations("Footer");
  const messages = useMessages();

  // safely extract page objects
  const pages: PageLink[] = [
    messages.HomePage,
    messages.FAQPage,
    messages.NoticePage
  ].filter(Boolean) as PageLink[];

  return (
    <footer className="flex flex-col w-full items-center justify-between min-h-[60svh] bg-accent px-4 py-10">
      
      {/* Tagline */}
      <h2 className="text-xl font-semibold mb-4">
        {t("tagline")}
      </h2>

      {/* Description */}
      <p className="max-w-xl text-center text-sm opacity-80 mb-6">
        {t("description")}
      </p>

      {/* Dynamic Links */}
      <div className="flex gap-4 flex-wrap justify-center py-2.5">
        {pages.map((page: PageLink) => (
          <Link
            key={page.link}
            href={page.link}
            className="hover:underline"
          >
            {page.title}
          </Link>
        ))}
      </div>

      {/* Footer bottom */}
      <div className="mt-6 text-xs opacity-70">
        {t("address")}
      </div>

      <div className="mt-1 text-xs opacity-60">
        {t("copyright")}
      </div>
    </footer>
  );
};

export default Footer;
