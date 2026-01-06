// Define the structure of your JSON to avoid 'any'
export interface AppMessages {
  HomePage: { title: string; link: string };
  AboutPage: { title: string; link: string };
  FAQPage: { title: string; link: string };
  NoticePage: { title: string; link: string };
  Navigation: {
    menu: string;
    locations: string;
    offers: string;
    gallery: string;
  };
}

export interface MItem { 
    id: string; 
    priceBDT: number; 
    stock: number; 
    unit_price: number; 
    tax: number; 
    vat: number; 
    export_price: number; 
    grand_total: number; 
    invoice: string; 
    uKey: 'c' | 'g'; 
}

export interface LData { 
    c: string; 
    g: string; 
    vs: string; 
    fans: string; 
    ctaOrder: string; 
    ctaBook: string; 
    items: Record<string, { t: string; d: string; hb: string; o: string; f: string; }>; 
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface FAQData {
    title: string;
    items: FAQItem[];
}