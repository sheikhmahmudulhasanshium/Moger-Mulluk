import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
    
    return ( 
        <aside>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MenuIcon/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href={'/'}>Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/faq'}>FAQs</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/notice'}>Notices</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/'}>Home</Link>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </aside>
     );
}
 
export default Sidebar;