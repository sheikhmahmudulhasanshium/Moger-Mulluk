interface PageProviderProps{
    header: React.ReactNode
    footer: React.ReactNode
    navbar?: React.ReactNode
    sidebar?: React.ReactNode
    children: React.ReactNode
}
const PageProvider:React.FC<PageProviderProps> = ({header,footer,sidebar,navbar,children}) => {
    
  return ( 
        <div className="flex flex-col min-h-screen justify-between ">
      {header}
      
      {/* Secondary Navigation Area - Switches between mobile and desktop */}
      <div className="sticky top-0 z-40 bg-background">
        {/* Mobile Sidebar Trigger (only shows on mobile) */}
        <div className="md:hidden  flex items-center p-2 h-12">
          {sidebar}
          {/* You can add other mobile-only action buttons here in the future */}
        </div>

        {/* Desktop Navbar (only shows on desktop) */}
        <div className="hidden md:block">
          {navbar}
        </div>
      </div>
      

      <main className="grow">
        {children}
      </main>
      {footer}
    </div>
     );
}
 
export default PageProvider;