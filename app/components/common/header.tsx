import LocalSwitcher from "../buttons/lang-switcher";
import { ModeToggle } from "../buttons/theme-toggle";

const Header = () => {
    return ( 
    <header className="flex justify-between items-center px-6 h-16 bg-amber-200 gap-2 ">
        <h1 className="font-stretch-50% font-mono font-semibold italic">Custom Logo</h1>
        
        <div className="flex gap-2 justify-end-safe">
            <LocalSwitcher/>
            <ModeToggle/>
        </div>
   
    </header> 
     );
}
 
export default Header;