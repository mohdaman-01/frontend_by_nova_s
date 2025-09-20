import { useEffect, useState } from "react";
import { Brain, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { apiClient, type ModelStatusResponse } from "@shared/api";

export default function MLStatus() {
  const [status, setStatus] = useState<ModelStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMLStatus = async () => {
      try {
        const response = await apiClient.getModelStatus();
        console.log('🔍 ML Status Response:', response); // Debug log
        setStatus(response);
        setError(null);
      } catch (err) {
        console.error('❌ ML Status Error:', err); // Debug log
        setError(err instanceof Error ? err.message : 'Failed to check ML status');
      } finally {
        setLoading(false);
      }
    };

    checkMLStatus();
    
    // Check status every 10 seconds for faster updates during debugging
    const interval = setInterval(checkMLStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 text-xs">
        <Loader2 className="h-3 w-3 animate-spin" /> Checking AI...
      </span>
    );
  }

  if (error || !status?.success) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-1 text-xs">
        <AlertTriangle className="h-3 w-3" /> AI Unavailable
      </span>
    );
  }

  const isReady = status.loaded_models > 0;
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
      isReady 
        ? 'bg-violet-600/10 text-violet-700 dark:text-violet-400'
        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
    }`}>
      {isReady ? (
        <>
          <Brain className="h-3 w-3" /> AI Ready ({status.loaded_models}/{status.total_models})
        </>
      ) : (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> AI Loading...
        </>
      )}
    </span>
  );
}