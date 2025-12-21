import Link from "next/link";
import Image from "next/image";
//import DynamicLogo from "@/public/logo/Frame 2 ";
const Footer = () => {
    return (
        <footer className="flex flex-col w-full justify-between items-center min-h-[60svh] bg-accent">
            <div>
                <Image src={'/logo/group 1.svg'} alt={""} height={400} width={400}/>

            </div>
            <div>
                <Image src={'/logo/frame 1.svg'} alt={""} height={100} width={300}/>

            </div>
            <div>
                <Image src={'/logo/frame 2.svg'} alt={""} height={100} width={300}/>

            </div>
            
            {<div className="flex gap-2 flex-wrap py-2.5">
                <Link href={'/'}>Home</Link>
                 <Link href={'/faq'}>FAQ</Link>
                  <Link href={'/notice'}>Notice</Link>
                </div>
            }
        </footer>
      );
}
 
export default Footer;
