'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface SocialShareProps {
  title: string;
}

export default function SocialShare({ title }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  
  const baseUrl = "https://moger-mulluk.vercel.app";
  const fullUrl = `${baseUrl}${pathname}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const appId = "2151814335752206";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
      } catch (err) { console.log(err); }
    } else {
      handleCopy();
    }
  };

  // Icons8 Helper
  const getIcon = (id: string) => `https://img.icons8.com/material-outlined/48/ffffff/${id}.png`;

  return (
    <div className="inline-flex items-center gap-2 h-16 p-0">
      
      {/* Main Toggle Button (No X button, stays as share icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-12 h-12 shrink-0 p-0 flex items-center justify-center rounded-full shadow-md transition-all duration-300
          ${isOpen ? 'bg-zinc-800 dark:bg-yellow-800 ' : 'bg-yellow-900 '}
          hover:scale-105 active:scale-95
        `}
      >
        <Image 
          src={getIcon('share')} 
          alt="share" 
          width={24} 
          height={24} 
          className={`bg-transparent ${isOpen ? 'dark:invert-0 invert' : ''}`}
          priority
        />
      </button>

      {/* Expanded Menu Container */}
      <div 
        className={`
          flex items-center gap-2 overflow-hidden transition-all duration-500 ease-in-out p-0
          ${isOpen ? 'max-w-150 opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}
        `}
      >
        {/* Copy to Clipboard */}
        <button 
          onClick={handleCopy}
          className={`w-10 h-10 shrink-0 p-0 flex items-center justify-center rounded-full shadow-sm transition-all hover:scale-110 active:scale-90 ${copied ? 'bg-green-600' : 'bg-zinc-500'}`}
        >
          <Image src={copied ? getIcon('checkmark') : getIcon('copy')} alt="copy" width={20} height={20} className="bg-transparent" />
        </button>

        {/* Telegram */}
        <ShareCircle 
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} 
          iconUrl={getIcon('telegram-app')}
          color="bg-[#0088cc]" 
        />

        {/* WhatsApp */}
        <ShareCircle 
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} 
          iconUrl={getIcon('whatsapp')}
          color="bg-[#25D366]" 
        />

        {/* SMS / Text Message */}
        <ShareCircle 
          href={`sms:?body=${encodedTitle}%20${encodedUrl}`} 
          iconUrl={getIcon('sms')}
          color="bg-[#4cd964]" 
        />
        
        {/* Messenger */}
        <ShareCircle 
          href={`https://www.facebook.com/dialog/send?app_id=${appId}&link=${encodedUrl}&redirect_uri=${encodedUrl}`} 
          iconUrl={getIcon('facebook-messenger--v1')}
          color="bg-[#00B2FF]" 
        />

        {/* Facebook */}
        <ShareCircle 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
          iconUrl={getIcon('facebook-f')}
          color="bg-[#1877F2]" 
        />

        {/* Native More */}
        <button 
          onClick={handleNativeShare}
          className="w-10 h-10 shrink-0 p-0 flex items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 hover:scale-110 transition-transform"
        >
          <Image src={getIcon('more')} alt="more" width={20} height={20} className="bg-transparent dark:invert invert-0" />
        </button>
      </div>
    </div>
  );
}

function ShareCircle({ href, iconUrl, color }: { href: string; iconUrl: string; color: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className={`w-10 h-10 shrink-0 p-0 flex items-center justify-center rounded-full shadow-sm transition-transform hover:scale-110 active:scale-90 ${color}`}
    >
      <Image src={iconUrl} alt="social" width={20} height={20} className="bg-transparent" />
    </a>
  );
}