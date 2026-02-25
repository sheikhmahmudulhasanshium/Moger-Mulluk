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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // 1. Check if the Environment Variable is missing
    if (!baseUrl) {
      console.error("STATUS_CHECK: NEXT_PUBLIC_API_URL is not defined in .env");
      setStatus("offline");
      if (isInitialLoading) setIsInitialLoading(false);
      return;
    }

    try {
      // Clean the URL to prevent double slashes (e.g. http://localhost:3001//status)
      const cleanUrl = `${baseUrl.replace(/\/$/, "")}/status`;

      const res = await fetch(cleanUrl, { 
        cache: 'no-store',
        // signal: AbortSignal.timeout(8000) is fine for modern browsers, 
        // but we ensure it's wrapped in this try/catch
        signal: AbortSignal.timeout(8000) 
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      
      const isHealthy = 
        data.status?.toLowerCase() === "online" || 
        data.status?.toLowerCase() === "ok";
      
      setStatus(isHealthy ? "online" : "degraded");
    } catch (err) {
      // 2. This catches "Failed to fetch" (Network error/CORS/Server Down)
      // and "TimeoutError" (Signal timeout)
      console.warn("Health Check Failed:", err instanceof Error ? err.message : err);
      setStatus("offline");
    } finally {
      if (isInitialLoading) {
        setTimeout(() => setIsInitialLoading(false), 1200);
      }
    }
  }, [isInitialLoading]);

  useEffect(() => {
    const goOnline = () => setStatus("online");
    const goDegraded = () => setStatus("degraded");
    const goOffline = () => setStatus("offline");

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