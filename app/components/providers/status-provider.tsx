"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Loading from "../common/loading";
import { cn } from "@/lib/utils";
import { WifiOff, AlertCircle, RefreshCw } from "lucide-react";
import { useLocale } from "next-intl";

const CONNECTION_MESSAGES: Record<string, string> = {
  hi: "कनेक्शन स्थापित किया जा रहा है",
  bn: "সংযোগ স্থাপন করা হচ্ছে",
  en: "Establishing Connection",
  es: "Estableciendo conexión",
};

type ConnectionStatus = "online" | "degraded" | "offline";

interface StatusContextType {
  status: ConnectionStatus;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<ConnectionStatus>("online");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const locale = useLocale(); 
  const connectionMsg = CONNECTION_MESSAGES[locale as keyof typeof CONNECTION_MESSAGES] || CONNECTION_MESSAGES.en;

  const checkHealth = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setStatus("offline");
      setIsInitialLoading(false);
      return;
    }

    try {
      const cleanUrl = `${baseUrl.replace(/\/$/, "")}/status`;
      const res = await fetch(cleanUrl, { 
        cache: 'no-store',
        signal: AbortSignal.timeout(8000) 
      });
      
      if (!res.ok) throw new Error();

      const data = await res.json();
      const isHealthy = data.status?.toLowerCase() === "online" || data.status?.toLowerCase() === "ok";
      setStatus(isHealthy ? "online" : "degraded");
    } catch {
      // Removed (err) to fix the linting error
      setStatus("offline");
    } finally {
      setTimeout(() => setIsInitialLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "offline" && !isInitialLoading) {
      timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [status, isInitialLoading]);

  useEffect(() => {
    setMounted(true);
    
    const events = ["api-online", "api-degraded", "api-offline", "online", "offline"];
    const handlers = [
        () => setStatus("online"),
        () => setStatus("degraded"),
        () => setStatus("offline"),
        checkHealth,
        () => setStatus("offline")
    ];

    events.forEach((e, i) => window.addEventListener(e, handlers[i]));
    checkHealth();
    const interval = setInterval(checkHealth, 40000); 

    return () => {
      events.forEach((e, i) => window.removeEventListener(e, handlers[i]));
      clearInterval(interval);
    };
  }, [checkHealth]);

  if (!mounted) return <>{children}</>;

  return (
    <StatusContext.Provider value={{ status }}>
      {isInitialLoading && (
        <div className="fixed inset-0 z-200 bg-background">
           <Loading message={connectionMsg} />
        </div>
      )}

      {!isInitialLoading && status !== "online" && (
        <div className={cn(
          "fixed top-0 left-0 w-full z-100 flex items-center justify-center py-1 text-[10px] md:text-xs font-bold tracking-wider animate-in slide-in-from-top duration-300",
          status === "offline" ? "bg-red-600 text-white" : "bg-amber-500 text-black"
        )}>
          {status === "offline" ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="h-3 w-3 animate-spin" /> 
              <WifiOff/> OFFLINE: REFRESHING PAGE IN 3s...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3" /> SYSTEM PERFORMANCE DEGRADED
            </span>
          )}
        </div>
      )}

      <div className={cn(
        "transition-all duration-700",
        isInitialLoading ? "opacity-0 invisible scale-95" : "opacity-100 visible scale-100",
        status !== "online" && !isInitialLoading ? "mt-6" : "mt-0"
      )}>
        {children}
      </div>
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) throw new Error("useStatus must be used within StatusProvider");
  return context;
};