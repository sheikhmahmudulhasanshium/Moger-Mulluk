import { Metadata } from "next";
import { productApi } from "@/app/components/hooks/product-api";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import PageProvider from "@/app/components/providers/page-provider";
import Body from "./body";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params; // Correctly awaited
  
  try {
    const product = await productApi.getDetail(lang, id);
    
    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [product.media?.thumbnail || ""],
      },
    };
  } catch (error) {
    console.log(error)
    return { title: "Product | Moger Mulluk" };
  }
}

const MenuItemPage = async ({ params }: Props) => {
    const { lang, id } = await params; // Correctly awaited

    return ( 
        <PageProvider header={<Header/>} footer={<Footer/>}>
            <Body id={id} lang={lang} />
        </PageProvider>
    );
}
 
export default MenuItemPage;