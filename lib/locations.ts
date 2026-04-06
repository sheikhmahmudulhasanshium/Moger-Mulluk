
/**
 * DATA STRUCTURE: 
 * We use Hubs (Major Cities) for Map Pins 
 * and Branches for the detailed drill-down.
 */
export const translations = {
  en: {
    title: "Global \n Footprint",
    statusOpen: "Open",
    statusComing: "Coming Soon",
    statusHQ: "Global HQ",
    locs: {
      us: { name: "USA", region: "North America", city: "New York", branches: [
        { name: "Brooklyn", area: "NYC", status: "Open" },
        { name: "Washington", area: "DC", status: "Coming Soon" },
        { name: "California", area: "LA", status: "Planning" }
      ]},
      sp: { name: "Spain", region: "Europe", city: "Madrid", branches: [
        { name: "Madrid Central", area: "Madrid", status: "Global HQ" },
        { name: "Barcelona", area: "Catalonia", status: "Open" }
      ]},
      ind: { name: "India", region: "South Asia", city: "Kolkata", branches: [
        { name: "Kolkata", area: "West Bengal", status: "Open" },
        { name: "Delhi", area: "NCR", status: "Coming Soon" },
        { name: "Mumbai", area: "Maharashtra", status: "Planning" }
      ]},
      bd: { name: "Bangladesh", region: "South Asia", city: "Dhaka", branches: [
        { name: "Uttara", area: "Sector 3", status: "Global HQ" },
        { name: "Banani", area: "Road 11", status: "Open" },
        { name: "Dhanmondi", area: "Satmasjid Rd", status: "Open" },
        { name: "Khulna", area: "City Center", status: "Open" },
        { name: "Rajshahi", area: "Varendra", status: "Open" }
      ]},
    }
  },
  bn: {
    title: "গ্লোবাল \n ফুটপ্রিন্ট",
    statusOpen: "চালু",
    statusComing: "শীঘ্রই আসছে",
    statusHQ: "সদর দপ্তর",
    locs: {
      us: { name: "মার্কিন যুক্তরাষ্ট্র", region: "উত্তর আমেরিকা", city: "নিউ ইয়র্ক", branches: [
        { name: "ব্রুকলিন", area: "নিউ ইয়র্ক", status: "চালু" },
        { name: "ওয়াশিংটন", area: "ডিসি", status: "শীঘ্রই আসছে" },
        { name: "ক্যালিফোর্নিয়া", area: "এলএ", status: "পরিকল্পনাধীন" }
      ]},
      sp: { name: "স্পেন", region: "ইউরোপ", city: "মাদ্রিদ", branches: [
        { name: "মাদ্রিদ সেন্ট্রাল", area: "মাদ্রিদ", status: "সদর দপ্তর" },
        { name: "বার্সেলোনা", area: "কাতালোনিয়া", status: "চালু" }
      ]},
      ind: { name: "ভারত", region: "দক্ষিণ এশিয়া", city: "কলকাতা", branches: [
        { name: "কলকাতা", area: "পশ্চিমবঙ্গ", status: "চালু" },
        { name: "দিল্লি", area: "এনসিআর", status: "শীঘ্রই আসছে" },
        { name: "মুম্বাই", area: "মহারাষ্ট্র", status: "পরিকল্পনাধীন" }
      ]},
      bd: { name: "বাংলাদেশ", region: "দক্ষিণ এশিয়া", city: "ঢাকা", branches: [
        { name: "উত্তরা", area: "সেক্টর ৩", status: "সদর দপ্তর" },
        { name: "বনানী", area: "রোড ১১", status: "চালু" },
        { name: "ধানমন্ডি", area: "সাতমসজিদ রোড", status: "চালু" },
        { name: "খুলনা", area: "সিটি সেন্টার", status: "চালু" },
        { name: "রাজশাহী", area: "বরেন্দ্র", status: "চালু" }
      ]},
    }
  },
  hi: {
    title: "ग्लोबल \n फुटप्रिंट",
    statusOpen: "सक्रिय",
    statusComing: "शीघ्र",
    statusHQ: "मुख्यालय",
    locs: {
      us: { name: "अमेरिका", region: "उत्तर अमेरिका", city: "न्यूयॉर्क", branches: [
        { name: "ब्रुकलिन", area: "NYC", status: "सक्रिय" },
        { name: "वाशिंगटन", area: "DC", status: "शीघ्र" }
      ]},
      sp: { name: "स्पेन", region: "यूरोप", city: "मैड्रिड", branches: [
        { name: "मैड्रिड", area: "स्पेन", status: "मुख्यालय" }
      ]},
      ind: { name: "भारत", region: "दक्षिण एशिया", city: "कोलकाता", branches: [
        { name: "कोलकाता", area: "WB", status: "सक्रिय" },
        { name: "दिल्ली", area: "NCR", status: "शीघ्र" }
      ]},
      bd: { name: "बांग्लादेश", region: "दक्षिण एशिया", city: "ढाका", branches: [
        { name: "उत्तरा", area: "ढाका", status: "मुख्यालय" },
        { name: "बनानी", area: "ढाका", status: "सक्रिय" }
      ]},
    }
  },
  es: {
    title: "Huella \n Global",
    statusOpen: "Abierto",
    statusComing: "Próximamente",
    statusHQ: "Sede Global",
    locs: {
      us: { name: "EE. UU.", region: "Norteamérica", city: "Nueva York", branches: [
        { name: "Brooklyn", area: "NYC", status: "Abierto" }
      ]},
      sp: { name: "España", region: "Europa", city: "Madrid", branches: [
        { name: "Madrid", area: "Central", status: "Sede Global" },
        { name: "Barcelona", area: "Cataluña", status: "Abierto" }
      ]},
      ind: { name: "India", region: "Asia del Sur", city: "Calcuta", branches: [
        { name: "Calcuta", area: "Bengala", status: "Abierto" }
      ]},
      bd: { name: "Bangladesh", region: "Asia del Sur", city: "Daca", branches: [
        { name: "Uttara", area: "Daca", status: "Sede Global" },
        { name: "Banani", area: "Daca", status: "Abierto" }
      ]},
    }
  }
};

export const COORDS = [
  { id: "us", code: "US", x: "24%", y: "38%" },
  { id: "sp", code: "ES", x: "47%", y: "42%" },
  { id: "ind", code: "IN", x: "71%", y: "54%" },
  { id: "bd", code: "BD", x: "74%", y: "52%" },
];

