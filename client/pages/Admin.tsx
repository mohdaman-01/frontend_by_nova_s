import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Upload, 
  Database, 
  Plus, 
  Hash, 
  FileText, 
  Users, 
  BarChart3,
  Download,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import BackendStatus from "@/components/BackendStatus";
import AuthStatus from "@/components/AuthStatus";
import { apiClient } from "@shared/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

type DigitalRecord = {
  student_name: string;
  roll_number: string;
  marks?: string;
  cert_number: string;
  issuer: string;
  issued_at: string;
};

type UploadStats = {
  total_records: number;
  successful: number;
  failed: number;
  errors: string[];
};

export default function Admin() {
  const { user } = useAuth();
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [sampleFiles, setSampleFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiClient.adminRequest('/api/v1/auth/users');
      setUsers(response);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const onBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setBulkFiles(list);
  };

  const onSampleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setSampleFiles((prev) => [...prev, ...list]);
  };

  const uploadBulkFile = async (file: File) => {
    setLoading(true);
    setUploadStatus("Uploading...");
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const endpoint = file.name.endsWith('.csv') 
        ? '/api/v1/upload/verified-records/csv'
        : '/api/v1/upload/verified-records/json';
      
      const response = await fetch(`${apiClient.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setUploadStats(result);
      setUploadStatus("Upload completed!");
      
    } catch (error) {
      setUploadStatus(`Upload failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async (format: 'csv' | 'json') => {
    try {
      const response = await apiClient.adminRequest(`/api/v1/upload/templates/${format}`);
      
      if (format === 'csv') {
        // Convert JSON template to CSV
        const template = response.template;
        const headers = Object.keys(template).join(',');
        const values = Object.values(template).join(',');
        const csvContent = `${headers}\n${values}`;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verified_records_template.csv';
        a.click();
      } else {
        // Download JSON template
        const blob = new Blob([JSON.stringify(response.template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verified_records_template.json';
        a.click();
      }
    } catch (error) {
      console.error('Failed to download template:', error);
    }
  };

  const promoteUser = async (email: string) => {
    try {
      await apiClient.adminRequest(`/api/v1/auth/promote-admin/${email}`, { method: 'POST' });
      loadUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to promote user:', error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage verified records, upload institutional data, and monitor the certificate verification system.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <BackendStatus />
          <AuthStatus />
        </div>

        <Tabs defaultValue="bulk-upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
            <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="samples">Sample Docs</TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-upload" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" /> Bulk Upload Verified Records
                  </CardTitle>
                  <CardDescription>
                    Upload CSV or JSON files containing verified certificate data from institutions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadTemplate('csv')}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" /> CSV Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadTemplate('json')}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" /> JSON Template
                    </Button>
                  </div>
                  
                  <div className="rounded-xl border-2 border-dashed p-6 text-center">
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={onBulkFileChange}
                      className="block w-full text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload CSV or JSON files with verified certificate data
                    </p>
                  </div>
                  
                  {bulkFiles.length > 0 && (
                    <div className="space-y-2">
                      {bulkFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md border p-2">
                          <span className="truncate">{file.name}</span>
                          <Button 
                            size="sm" 
                            onClick={() => uploadBulkFile(file)}
                            disabled={loading}
                          >
                            {loading ? "Uploading..." : "Upload"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {uploadStatus && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{uploadStatus}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {uploadStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" /> Upload Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Successful: {uploadStats.successful}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>Failed: {uploadStats.failed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>Total Records: {uploadStats.total_records}</span>
                      </div>
                      {uploadStats.errors.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm mb-2">Errors:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {uploadStats.errors.map((error, i) => (
                              <li key={i}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manual-entry">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Manual Record Entry
                </CardTitle>
                <CardDescription>
                  Add individual verified certificate records to the database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManualRecordForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> User Management
                </CardTitle>
                <CardDescription>
                  Manage user roles and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Role: {user.role} • Joined: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {user.role !== 'admin' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => promoteUser(user.email)}
                        >
                          Promote to Admin
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" /> Sample Documents
                </CardTitle>
                <CardDescription>
                  Upload sample certificates for OCR training and testing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border-2 border-dashed p-6 text-center">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    multiple
                    onChange={onSampleFileChange}
                    className="block w-full text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload PDF or image files for OCR training
                  </p>
                </div>
                {sampleFiles.length > 0 && (
                  <ul className="mt-4 grid gap-2 text-sm">
                    {sampleFiles.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span className="truncate">{f.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(f.size / 1024)} KB
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function ManualRecordForm() {
  const [form, setForm] = useState<DigitalRecord>({
    student_name: "",
    roll_number: "",
    marks: "",
    cert_number: "",
    issuer: "",
    issued_at: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Adding record...");

    try {
      // Convert form data to API format
      const recordData = {
        ...form,
        issued_at: new Date(form.issued_at).toISOString(),
      };

      const response = await apiClient.adminRequest('/api/v1/upload/verified-records/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([recordData]),
      });

      setStatus("Record added successfully!");
      setForm({
        student_name: "",
        roll_number: "",
        marks: "",
        cert_number: "",
        issuer: "",
        issued_at: new Date().toISOString().split('T')[0],
      });

    } catch (error) {
      setStatus(`Failed to add record: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="student_name">Student Name *</Label>
          <Input
            id="student_name"
            value={form.student_name}
            onChange={(e) => setForm({ ...form, student_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="roll_number">Roll Number *</Label>
          <Input
            id="roll_number"
            value={form.roll_number}
            onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="cert_number">Certificate Number *</Label>
          <Input
            id="cert_number"
            value={form.cert_number}
            onChange={(e) => setForm({ ...form, cert_number: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="marks">Marks/Grade</Label>
          <Input
            id="marks"
            value={form.marks}
            onChange={(e) => setForm({ ...form, marks: e.target.value })}
            placeholder="e.g., 85%, A+, First Class"
          />
        </div>
        <div>
          <Label htmlFor="issuer">Issuing Institution *</Label>
          <Input
            id="issuer"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="issued_at">Issue Date *</Label>
          <Input
            id="issued_at"
            type="date"
            value={form.issued_at}
            onChange={(e) => setForm({ ...form, issued_at: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading} className="gap-2">
          <Plus className="h-4 w-4" />
          {loading ? "Adding..." : "Add Record"}
        </Button>
      </div>

      {status && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
