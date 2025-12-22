import Link from "next/link";
import { useTranslations, useMessages } from "next-intl";
import DynamicFooterLogo from "./dynamic-footer-logo";

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
    <footer className="flex flex-col w-full items-center justify-between min-h-[60svh] py-10 px-4">
            <div className="w-full overflow-hidden">

      <DynamicFooterLogo/>
      </div>
      {/* Description */}
      <p className="max-w-xl text-center text-sm opacity-80 mb-6 mt-4">
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
