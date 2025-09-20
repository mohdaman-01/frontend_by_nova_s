import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  FileUp,
  Hash,
  Image as ImageIcon,
  QrCode,
  Replace,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Wifi,
  WifiOff,
  Server,
  Brain,
  Zap,
} from "lucide-react";
import { analyzeFile, type VerificationResult } from "@/lib/verify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MLStatus from "@/components/MLStatus";

export default function UploadBox() {
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { backendConnected } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) await handleFile(f);
  }, []);

  const handleFile = async (f: File, opts?: { skipRedirect?: boolean }) => {
    // Redirect JPEG uploads to preview page first (unless disabled)
    if (!opts?.skipRedirect && f.type && /image\/jpeg|image\/jpg/i.test(f.type)) {
      const src = URL.createObjectURL(f);
      const params = new URLSearchParams({ src, name: f.name, type: f.type || "image/jpeg" });
      navigate(`/preview?${params.toString()}`);
      return;
    }
    setFile(f);
    setLoading(true);
    try {
      const r = await analyzeFile(f);
      setResult(r);
    } catch (err) {
      console.error(err);
      setResult({
        status: "invalid",
        issues: ["Unexpected error analyzing file"],
        metadata: {
          fileName: f.name,
          size: f.size,
          mime: f.type || "",
          hashHex: "",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-load from query (?src=...) to analyze when returning from preview
  useEffect(() => {
    const params = new URLSearchParams(search);
    const src = params.get("src");
    const type = params.get("type");
    const name = params.get("name") || "uploaded.jpg";
    if (src && type && /image\/jpeg|image\/jpg/i.test(type)) {
      // Only analyze on verify route to avoid loops
      if (pathname === "/verify") {
        fetch(src)
          .then((r) => r.blob())
          .then((blob) => new File([blob], name, { type }))
          .then((file) => handleFile(file, { skipRedirect: true }))
          .catch(() => {});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  const statusChip = useMemo(() => {
    if (!result) return null;
    if (result.status === "valid")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" /> Valid
        </span>
      );
    if (result.status === "suspect")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-1 text-xs">
          <ShieldAlert className="h-3.5 w-3.5" /> Suspect
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-600/10 text-red-700 dark:text-red-400 px-2 py-1 text-xs">
        <AlertCircle className="h-3.5 w-3.5" /> Invalid
      </span>
    );
  }, [result]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Verify a certificate
            <div className="flex gap-2">
              {backendConnected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 text-xs">
                  <Server className="h-3 w-3" /> Backend Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-1 text-xs">
                  <WifiOff className="h-3 w-3" /> Offline Mode
                </span>
              )}
              {backendConnected && <MLStatus />}
            </div>
          </CardTitle>
          <CardDescription>
            Upload a JPEG or PNG image. We compute hashes, check QR codes, 
            cross-check with registries, and use AI to detect fake certificates.
            {!backendConnected && (
              <span className="block text-amber-600 dark:text-amber-400 text-xs mt-1">
                Using local verification only - AI detection and backend unavailable
              </span>
            )}
          </CardDescription>
        </div>
        <div>{statusChip}</div>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
            dragging
              ? "border-violet-500 bg-violet-500/5 ring-4 ring-violet-500/10"
              : "border-border",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />

          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground flex items-center justify-center shadow-md">
              <FileUp className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              Drag and drop your certificate here, or
            </p>
            <Button onClick={() => inputRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" /> Choose file
            </Button>
            <p className="text-xs text-muted-foreground">
              We only support JPEG and PNG for now.
            </p>
          </div>
        </div>

        {file && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">File details</h4>
              <ul className="text-sm grid gap-2">
                <li className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" /> Hash:{" "}
                  <span className="font-mono break-all">
                    {result?.metadata.hashHex || ""}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Replace className="h-4 w-4 text-muted-foreground" /> Size:{" "}
                  {Math.round(file.size / 1024)} KB
                </li>
                <li className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" /> Type:{" "}
                  {file.type || "Unknown"}
                </li>
                {result?.metadata.qrData && (
                  <li className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-muted-foreground" /> QR:{" "}
                    <span
                      className="truncate max-w-[260px]"
                      title={result.metadata.qrData}
                    >
                      {result.metadata.qrData}
                    </span>
                  </li>
                )}
                {result?.metadata.ocrText && (
                  <li className="flex items-center gap-2">
                    <FileUp className="h-4 w-4 text-muted-foreground" /> OCR:{" "}
                    <span
                      className="truncate max-w-[260px]"
                      title={result.metadata.ocrText}
                    >
                      {result.metadata.ocrText.substring(0, 50)}...
                    </span>
                  </li>
                )}
                {result?.metadata.uploadId && (
                  <li className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" /> ID:{" "}
                    <span className="font-mono text-xs">
                      {result.metadata.uploadId}
                    </span>
                  </li>
                )}
                {result?.metadata.mlDetection && (
                  <li className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" /> AI:{" "}
                    <span className={`text-xs font-medium ${
                      result.metadata.mlDetection.is_fake 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {result.metadata.mlDetection.is_fake ? 'FAKE' : 'AUTHENTIC'} 
                      ({(result.metadata.mlDetection.confidence * 100).toFixed(1)}%)
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Verification</h4>
              {!loading && result && (
                <div
                  className={cn(
                    "rounded-lg border p-4 text-sm transition-colors",
                    result.status === "valid" &&
                      "border-emerald-500/40 bg-emerald-500/5",
                    result.status === "suspect" &&
                      "border-amber-500/40 bg-amber-500/5",
                    result.status === "invalid" &&
                      "border-red-500/40 bg-red-500/5",
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.status === "valid" && (
                      <ShieldCheck className="h-4 w-4 text-emerald-600 animate-float" />
                    )}
                    {result.status === "suspect" && (
                      <ShieldAlert className="h-4 w-4 text-amber-600 animate-float" />
                    )}
                    {result.status === "invalid" && (
                      <AlertCircle className="h-4 w-4 text-red-600 animate-float" />
                    )}
                    <span className="font-medium capitalize">
                      {result.status}
                    </span>
                  </div>
                  {result.matchedRecord ? (
                    <p>
                      Matched registry record for{" "}
                      <span className="font-medium">
                        {result.matchedRecord.name}
                      </span>{" "}
                      at {result.matchedRecord.institution} (
                      {result.matchedRecord.year}).
                    </p>
                  ) : (
                    <p>
                      No exact registry match. We checked hash, QR code, and
                      basic metadata.
                    </p>
                  )}
                  {result.issues.length > 0 && (
                    <ul className="mt-2 list-disc pl-4">
                      {result.issues.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  )}
                  
                  {/* ML Detection Details */}
                  {result.metadata.mlDetection && result.metadata.mlDetection.success && (
                    <div className="mt-3 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-violet-600" />
                        <span className="text-sm font-medium">AI Analysis</span>
                        <span className="text-xs text-muted-foreground">
                          ({result.metadata.mlDetection.models_used} models, {result.metadata.mlDetection.processing_time.toFixed(1)}s)
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Authenticity Score:</span>
                          <span className="font-mono">
                            {(result.metadata.mlDetection.authenticity_score * 100).toFixed(1)}%
                          </span>
                        </div>
                        {result.metadata.mlDetection.text_analysis && (
                          <div className="flex justify-between">
                            <span>Text Quality:</span>
                            <span className="font-mono">
                              {(result.metadata.mlDetection.text_analysis.quality_score * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                        {result.metadata.mlDetection.text_analysis?.suspicious_patterns && 
                         result.metadata.mlDetection.text_analysis.suspicious_patterns.length > 0 && (
                          <div className="text-amber-600 dark:text-amber-400">
                            <span>Suspicious patterns: </span>
                            <span className="font-mono text-xs">
                              {result.metadata.mlDetection.text_analysis.suspicious_patterns.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {loading && (
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Analyzing…
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
