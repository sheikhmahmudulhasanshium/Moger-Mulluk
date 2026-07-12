import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn button
import { Coffee, Utensils } from "lucide-react"; // icons for OrderNow & BookTable
import DynamicLogo from "@/app/components/common/dynamic-header-logo";
import { useMessages } from "next-intl";

// Local interface representing the translation structure needed by the Header
interface HeaderMessages {
  Logo: {
    brandName: string;
  };
  CTA: {
    orderNow: string;
    bookTable: string;
  };
}

const Header = () => {
  // Cast useMessages to our local HeaderMessages interface via unknown
  const messages = useMessages() as unknown as HeaderMessages;

  return (
    <header className="flex items-center justify-between px-6 h-20 bg-amber-200 text-amber-950">
      
      {/* Logo */}
      <Link 
        href="/" 
        className="flex h-full items-center" 
        aria-label={messages.Logo?.brandName || "Home"}
      >
        <DynamicLogo />
      </Link>

      {/* Navigation + CTA */}
      <nav className="flex items-center-safe gap-4">
        {/* CTA buttons - full label on desktop */}
        <div className="hidden md:flex gap-6">
          <Button variant="default" asChild>
            <Link href="/order/#pre-order">{messages.CTA.orderNow}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/order/#book-table">{messages.CTA.bookTable}</Link>
          </Button>
        </div>

        {/* Mobile CTA icons only */}
        <div className="flex md:hidden gap-2">
          <Button size="sm" variant="default" asChild>
            <Link 
              href="/order/#pre-order" 
              aria-label={messages.CTA.orderNow}
            >
              <Coffee className="w-5 h-5" />
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link 
              href="/order/#book-table" 
              aria-label={messages.CTA.bookTable}
            >
              <Utensils className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;