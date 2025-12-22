import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../buttons/theme-toggle";
import LocalSwitcher from "../buttons/lang-switcher";
import { useMessages } from "next-intl";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
    const messages = useMessages();
    
      const pages = [
        messages.HomePage,
        messages.AboutPage,
        messages.FAQPage,
        messages.NoticePage,
      ].filter(Boolean) as { title: string; link: string }[];
        const navmenu = [
        { title: messages.Navigation.menu, link: "/menu" },
        { title: messages.Navigation.locations, link: "/locations" },
        { title: messages.Navigation.offers, link: "/offers" },
        { title: messages.Navigation.gallery, link: "/gallery" },
    ].filter((item) => item.title);

    return ( 
        <aside className="flex justify-between items-center gap-2 w-full  py-4 ">
            <DropdownMenu >
                <DropdownMenuTrigger className="items-start flex">
                    <MenuIcon/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    
                              {pages.map((page) => (
                                <DropdownMenuItem key={page.link}  className="hover:bg-amber-950 hover:text-white">                                
                                    <Link  href={page.link} className=" ">
                                    {page.title} </Link>
                                </DropdownMenuItem>
                                
                                ))}

                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex justify-between gap-4">
                {navmenu.map((item) => (
          <Link key={item.link} href={item.link} className=" flex justify-between md:w-auto">
            <Button variant={'outline'} className="hover:bg-amber-950 hover:text-white">
              {item.title}
            </Button>
          </Link>
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