import Link from "next/link";
import LocalSwitcher from "../buttons/lang-switcher";
import { ModeToggle } from "../buttons/theme-toggle";
import { useMessages } from "next-intl";
import { Button } from "@/components/ui/button";
import { AppMessages } from "../types";

const Navbar = () => {
  const messages = useMessages() as unknown as AppMessages;

  const pages = [
    messages.HomePage,
    messages.AboutPage,
    messages.FAQPage,
    messages.NoticePage,
  ].filter(Boolean);

  const navmenu = [
    { title: messages.Navigation.menu, link: "/menu" },
    { title: messages.Navigation.locations, link: "/locations" },
    { title: messages.Navigation.offers, link: "/offers" },
    { title: messages.Navigation.gallery, link: "/gallery" },
  ].filter((item) => item.title);

  return (
    <nav className="flex justify-between py-2 px-12 items-center w-full gap-6">
      {/* Desktop links */}
      <div className="hidden md:flex gap-6 overflow-x-auto overflow-y-hidden">
        {pages.map((page) => (
          <Button key={page.link} variant='outline' className="hover:bg-amber-950 hover:text-white" asChild>
            <Link href={page.link}>
              {page.title}
            </Link>
          </Button>
        ))}

        {navmenu.map((item) => (
          <Button key={item.link} variant='outline' className="hover:bg-amber-950 hover:text-white" asChild>
            <Link href={item.link}>
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <LocalSwitcher />
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;