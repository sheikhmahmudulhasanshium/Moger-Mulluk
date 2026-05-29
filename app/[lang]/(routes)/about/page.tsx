import { getPageData } from "@/app/components/hooks/hooks-server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'about');
  const baseUrl = "https://moger-mulluk.vercel.app";

  if (!data) return { title: "Our Story | Moger Mulluk" };

  return {
    title: data.title,
    description: data.description,
    // --- ADD THIS SECTION ---
    alternates: {
      canonical: `${baseUrl}/${lang}/about`, // Self-referencing canonical
      languages: {
        'en': `${baseUrl}/en/about`,
        'es': `${baseUrl}/es/about`,
        'bn': `${baseUrl}/bn/about`,
        'hi': `${baseUrl}/hi/about`,
        'x-default': `${baseUrl}/en/about`, // Default language version
      },
    },
    // ------------------------
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.seo.ogImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: [data.seo.ogImage],
    }
  };
}