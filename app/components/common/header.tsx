import Link from "next/link";
//import { useMessages } from "next-intl";
import { Button } from "@/components/ui/button"; // shadcn button
import { Coffee, Utensils } from "lucide-react"; // icons for OrderNow & BookTable
import DynamicLogo from "@/public/logo/dynamic-header-logo";
import { useMessages } from "next-intl";

const Header = () => {
      const messages = useMessages();

  return (
    <header className="flex items-center justify-between px-6 h-20 bg-amber-200 text-amber-950/75">
      
      {/* Logo */}
      <Link href="/" className="flex h-full items-center">
        <DynamicLogo />
      </Link>

      {/* Navigation + CTA */}
      <nav className="flex items-center-safe gap-4">
        {/* CTA buttons - full label on desktop */}
                 <div className="hidden md:flex gap-6">
                    
                  <Button variant="default" asChild>
                    <Link href="/pre-order">{messages.CTA.orderNow}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/book-table">{messages.CTA.bookTable}</Link>
                  </Button>
                 </div>

        {/* Mobile CTA icons only */}
        <div className="flex md:hidden gap-2">
          <Link href="/pre-order">
            <Button size="sm" variant="default">
              <Coffee className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/book-table">
            <Button size="sm" variant="outline">
              <Utensils  className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
