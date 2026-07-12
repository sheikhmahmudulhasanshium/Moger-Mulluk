import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../buttons/theme-toggle";
import LocalSwitcher from "../buttons/lang-switcher";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
    // Correctly fetching localized strings
    const tNav = useTranslations("Navigation");
    const tHome = useTranslations("HomePage");
    const tAbout = useTranslations("AboutPage");
    const tFAQ = useTranslations("FAQPage");
    const tNotice = useTranslations("NoticePage");
    
    const pages = [
      { title: tHome("title"), link: tHome("link") },
      { title: tAbout("title"), link: tAbout("link") },
      { title: tFAQ("title"), link: tFAQ("link") },
      { title: tNotice("title"), link: tNotice("link") },
    ].filter((p) => p.title && p.link);

    const navmenu = [
      { title: tNav("menu"), link: "/menu" },
      { title: tNav("locations"), link: "/locations" },
      { title: tNav("offers"), link: "/offers" },
      { title: tNav("gallery"), link: "/gallery" },
    ].filter((item) => item.title);
    
    return ( 
        <aside className="flex justify-between items-center gap-2 w-full h-20">
            <DropdownMenu>
                {/* Fixed Accessibility: Added aria-label for mobile menu trigger */}
                <DropdownMenuTrigger 
                  className="items-start flex" 
                  aria-label={tNav("menu") || "Toggle navigation menu"}
                >
                    <MenuIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {pages.map((page) => (
                      <DropdownMenuItem key={page.link} className="hover:bg-amber-950 hover:text-white">                                
                          <Link href={page.link}>
                            {page.title}
                          </Link>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Fixed Semantic Markup: Added asChild on layout buttons */}
            <div className="flex justify-between gap-4 overflow-x-auto overflow-y-hidden">
                {navmenu.map((item) => (
                  <Button key={item.link} variant={'outline'} className="hover:bg-amber-950 hover:text-white" asChild>
                    <Link href={item.link}>
                      {item.title}
                    </Link>
                  </Button>
                ))}
            </div>

            <div className="flex gap-2 items-center justify-end">
                <LocalSwitcher />
                <ModeToggle />
            </div>
        </aside>
    );
}
 
export default Sidebar;