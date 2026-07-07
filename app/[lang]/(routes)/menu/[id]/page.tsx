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
  const { lang, id } = await params;
  const baseUrl = "https://moger-mulluk.vercel.app";
  
  try {
    const product = await productApi.getDetail(lang, id);
    const ogImage = product.media?.thumbnail || "/favicon/web-app-manifest-512x512.png"; // Fallback to a default image if thumbnail is not available

    return {
      title: product.title,
      description: product.description,
      alternates: {
        canonical: `${baseUrl}/${lang}/menu/${id}`,
        languages: {
          'en': `${baseUrl}/en/menu/${id}`,
          'bn': `${baseUrl}/bn/menu/${id}`,
          'es': `${baseUrl}/es/menu/${id}`,
          'hi': `${baseUrl}/hi/menu/${id}`
        }
      },
      facebook: {
        appId: '2151814335752206'
      },
      openGraph: {
        type: "website", // FIXED
        url: `${baseUrl}/${lang}/menu/${id}`, // FIXED
        title: product.title,
        description: product.description,
        images: [{
          url: ogImage,
          width: 1200, // FIXED
          height: 630, // FIXED
        }],
      },
      twitter: {
        card: "summary_large_image",
        images: [ogImage],
      }
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return { title: "Product | Moger Mulluk" };
  }
}

const MenuItemPage = async ({ params }: Props) => {
    // Correctly using params here
    const { lang, id } = await params; 

    return ( 
        <PageProvider header={<Header/>} footer={<Footer/>}>
            <Body id={id} lang={lang} />
        </PageProvider>
    );
}
 
export default MenuItemPage;