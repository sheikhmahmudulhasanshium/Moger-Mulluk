"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Loading from "../common/loading";
import { cn } from "@/lib/utils";
import { WifiOff, AlertCircle } from "lucide-react";

type ConnectionStatus = "online" | "degraded" | "offline";

interface StatusContextType {
  status: ConnectionStatus;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<ConnectionStatus>("online");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`, { 
        cache: 'no-store',
        signal: AbortSignal.timeout(8000) 
      });
      const data = await res.json();
      setStatus(data.status === "Online" ? "online" : "degraded");
    } catch {
      setStatus("offline");
    } finally {
      if (isInitialLoading) {
        // Smooth transition out of the splash screen
        setTimeout(() => setIsInitialLoading(false), 1200);
      }
    }
  }, [isInitialLoading]);

  useEffect(() => {
    // 1. Handlers for API Client events (triggers when any of your 20+ endpoints fail)
    const goOnline = () => setStatus("online");
    const goDegraded = () => setStatus("degraded");
    const goOffline = () => setStatus("offline");

    // 2. Handlers for Native Browser events (Physical internet connection)
    const handleBrowserOnline = () => checkHealth();
    const handleBrowserOffline = () => setStatus("offline");

    // Custom API Listeners
    window.addEventListener("api-online", goOnline);
    window.addEventListener("api-degraded", goDegraded);
    window.addEventListener("api-offline", goOffline);

    // Native Browser Listeners
    window.addEventListener("online", handleBrowserOnline);
    window.addEventListener("offline", handleBrowserOffline);

    checkHealth();
    const interval = setInterval(checkHealth, 40000); 

    return () => {
      window.removeEventListener("api-online", goOnline);
      window.removeEventListener("api-degraded", goDegraded);
      window.removeEventListener("api-offline", goOffline);
      window.removeEventListener("online", handleBrowserOnline);
      window.removeEventListener("offline", handleBrowserOffline);
      clearInterval(interval);
    };
  }, [checkHealth]);

  return (
    <StatusContext.Provider value={{ status }}>
      {/* 
        BRANDED SPLASH SCREEN 
        Passing the specific message to the updated Loading component
      */}
      {isInitialLoading && <Loading message="Establishing Connection" />}

      {/* CONNECTIVITY BAND */}
      {!isInitialLoading && status !== "online" && (
        <div className={cn(
          "fixed top-0 left-0 w-full z-100 flex items-center justify-center py-1 text-[10px] md:text-xs font-bold tracking-wider animate-in slide-in-from-top duration-300",
          status === "offline" ? "bg-red-600 text-white" : "bg-amber-500 text-black"
        )}>
          {status === "offline" ? (
            <span className="flex items-center gap-2">
              <WifiOff className="h-3 w-3 animate-pulse" /> NO CONNECTION TO SERVER
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3" /> SYSTEM PERFORMANCE DEGRADED
            </span>
          )}
        </div>
      )}

      {/* MAIN APP CONTENT */}
      <div className={cn(
        "transition-all duration-700",
        isInitialLoading ? "opacity-0 invisible scale-95" : "opacity-100 visible scale-100",
        // mt-6 (24px) creates space exactly for the band when it appears
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