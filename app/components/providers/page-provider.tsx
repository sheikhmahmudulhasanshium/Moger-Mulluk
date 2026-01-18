interface PageProviderProps {
    header: React.ReactNode
    footer: React.ReactNode
    navbar?: React.ReactNode
    sidebar?: React.ReactNode
    children: React.ReactNode
}

const PageProvider: React.FC<PageProviderProps> = ({ header, footer, sidebar, navbar, children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {header}
      
      <div className="sticky top-0 z-40 bg-background">
        <div className="md:hidden flex items-center py-2 mx-4 h-12">
          {sidebar}
        </div>
        <div className="hidden md:block">
          {navbar}
        </div>
      </div>

      <main className="grow min-h-[70vh]">
        {children}
      </main>

      {footer}
    </div>
  );
};

export default PageProvider;