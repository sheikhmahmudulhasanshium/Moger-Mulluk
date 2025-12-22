import Link from "next/link";
import LocalSwitcher from "../buttons/lang-switcher";
import { ModeToggle } from "../buttons/theme-toggle";
import { useMessages } from "next-intl";
import { Button } from "@/components/ui/button";
import { AppMessages } from "../types";


const Navbar = () => {
  // Cast messages to the interface via unknown to satisfy ESLint
  const messages = useMessages() as unknown as AppMessages;

  const pages = [
    messages.HomePage,
    messages.AboutPage,
    messages.FAQPage,
    messages.NoticePage,
  ].filter(Boolean);

  // Map the navigation strings into objects with titles and links
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
          <Link key={page.link} href={page.link} className=" flex justify-between md:w-auto">
            <Button variant={'outline'} className="hover:bg-amber-950 hover:text-white">
              {page.title}
            </Button>
          </Link>
        ))}

        {/* Added the mapping for navmenu items as requested */}
        {navmenu.map((item) => (
          <Link key={item.link} href={item.link} className=" flex justify-between md:w-auto ">
            <Button variant={'outline'} className="hover:bg-amber-950 hover:text-white">
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex gap-2 ">
        <LocalSwitcher />
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;