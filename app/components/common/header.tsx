import DynamicLogo from "@/public/logo/Frame 2 ";
import LocalSwitcher from "../buttons/lang-switcher";
import { ModeToggle } from "../buttons/theme-toggle";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 h-20 bg-amber-200 text-amber-950/75">
      
      {/* Logo area — height driven, no stretching */}
      <Link href={'/'} className="flex h-full items-center">
        <DynamicLogo />
      </Link>

      <div className="flex gap-2 items-center justify-end">
        <LocalSwitcher />
        <ModeToggle />
      </div>

    </header>
  );
};

export default Header;
