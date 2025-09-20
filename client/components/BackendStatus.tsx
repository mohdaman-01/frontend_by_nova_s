import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient, type HealthResponse } from "@shared/api";
import { CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

export default function BackendStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.health();
      setHealth(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'error': return 'bg-amber-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Backend Status</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={checkHealth}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Connection failed: {error}</span>
          </div>
        ) : health ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Connected to Railway Backend</span>
              <Badge variant="secondary" className={getStatusColor(health.status)}>
                {health.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-2 font-mono">{health.version}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Database:</span>
                <Badge 
                  variant={health.database === 'connected' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {health.database}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Services:</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Badge variant={health.services.ocr === 'available' ? 'default' : 'secondary'}>
                  OCR: {health.services.ocr}
                </Badge>
                <Badge variant={health.services.verification === 'available' ? 'default' : 'secondary'}>
                  Verify: {health.services.verification}
                </Badge>
                <Badge variant={health.services.ai_module === 'available' ? 'default' : 'secondary'}>
                  AI: {health.services.ai_module}
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open('https://nova-s-sih-35061497bf29.herokuapp.com/docs', '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              API Documentation
            </Button>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking backend status...</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}