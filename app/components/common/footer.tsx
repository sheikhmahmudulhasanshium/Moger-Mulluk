import Link from "next/link";

const Footer = () => {
    return (
        <footer className="flex flex-col w-full justify-between items-center h-[60svh] bg-accent">
            <h2>This is a footer</h2>
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
