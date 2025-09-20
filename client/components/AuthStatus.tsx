import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@shared/api";
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Settings,
  Info
} from "lucide-react";

export default function AuthStatus() {
  const { backendConnected } = useAuth();
  const [oauthAvailable, setOauthAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const checkOAuthStatus = async () => {
    setLoading(true);
    try {
      const available = await apiClient.checkOAuthAvailable();
      setOauthAvailable(available);
    } catch (error) {
      setOauthAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendConnected) {
      checkOAuthStatus();
    }
  }, [backendConnected]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Authentication Status</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={checkOAuthStatus}
          disabled={loading || !backendConnected}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Check
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {!backendConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Backend not connected. Using demo authentication only.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Backend Connected</span>
            </div>
            
            <div className="flex items-center gap-2">
              {oauthAvailable === null ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Checking OAuth...</span>
                </>
              ) : oauthAvailable ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Google OAuth Available</span>
                  <Badge variant="default">Production Ready</Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Google OAuth Not Configured</span>
                  <Badge variant="secondary">Demo Mode</Badge>
                </>
              )}
            </div>

            {oauthAvailable === false && (
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>To enable Google OAuth:</p>
                    <ol className="list-decimal list-inside text-xs space-y-1">
                      <li>Set up Google OAuth credentials</li>
                      <li>Add GOOGLE_CLIENT_ID to Heroku environment</li>
                      <li>Add GOOGLE_CLIENT_SECRET to Heroku environment</li>
                      <li>Redeploy backend</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`${apiClient.baseURL}/docs`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                API Docs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Google Console
              </Button>
            </div>
          </div>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Current Status:</strong> {backendConnected ? (
              oauthAvailable ? 
                "Production authentication with Google OAuth" : 
                "Demo authentication - OAuth setup needed"
            ) : "Demo authentication only - backend offline"}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}