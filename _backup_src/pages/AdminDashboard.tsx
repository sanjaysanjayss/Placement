import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Building2, 
  Calendar, 
  Award, 
  Settings, 
  Upload, 
  Download, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Database,
  Mail,
  Phone,
  Edit,
  Trash2,
  Plus,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface SystemStats {
  totalStudents: number;
  totalTrainers: number;
  totalOfficers: number;
  totalCompanies: number;
  totalDrives: number;
  activeDrives: number;
  totalPlacements: number;
  placementRate: number;
  avgPackage: number;
  trainingSessions: number;
  avgAttendance: number;
  systemHealth: {
    status: "healthy" | "warning" | "critical";
    uptime: string;
    responseTime: number;
    errorRate: number;
  };
}

interface BulkOperation {
  id: string;
  type: "student_upload" | "trainer_upload" | "drive_creation" | "eligibility_update";
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  totalRecords: number;
  processedRecords: number;
  errors: string[];
  createdAt: string;
  completedAt?: string;
}

interface SystemConfig {
  id: string;
  category: string;
  settings: Record<string, any>;
  lastUpdated: string;
  updatedBy: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [uploadType, setUploadType] = useState<"students" | "trainers" | "companies">("students");
  const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, bulkRes, configRes, logsRes] = await Promise.all([
        fetch('http://localhost:3000/systemStats'),
        fetch('http://localhost:3000/bulkOperations'),
        fetch('http://localhost:3000/systemConfigs'),
        fetch('http://localhost:3000/activityLogs')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (bulkRes.ok) {
        const bulkData = await bulkRes.json();
        setBulkOperations(bulkData);
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        setSystemConfigs(configData);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setActivityLogs(logsData);
      }
    } catch (error) {
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);

    try {
      const response = await fetch('http://localhost:3000/admin/bulk-upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const operation = await response.json();
        setBulkOperations(prev => [...prev, operation]);
        setIsBulkUpload(false);
        toast.success("Bulk upload started successfully");
      }
    } catch (error) {
      toast.error("Failed to start bulk upload");
    }
  };

  const updateSystemConfig = async (config: SystemConfig) => {
    try {
      const response = await fetch(`http://localhost:3000/systemConfigs/${config.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, lastUpdated: new Date().toISOString() })
      });

      if (response.ok) {
        setSystemConfigs(prev => prev.map(c => c.id === config.id ? config : c));
        toast.success("Configuration updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update configuration");
    }
  };

  const exportData = async (type: 'students' | 'trainers' | 'drives' | 'analytics') => {
    try {
      toast.success(`Exporting ${type} data...`);
      // In a real app, generate and download CSV/Excel
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const backupSystem = async () => {
    try {
      toast.success("Creating system backup...");
      // In a real app, create backup
    } catch (error) {
      toast.error("Failed to create backup");
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={backupSystem}>
            <Database className="h-4 w-4 mr-2" />
            Backup System
          </Button>
          <Button onClick={() => setIsBulkUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Students</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-gray-500">Active users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Placement Rate</span>
              <Award className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{stats?.placementRate || 0}%</div>
            <p className="text-xs text-gray-500">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Drives</span>
              <Building2 className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{stats?.activeDrives || 0}</div>
            <p className="text-xs text-gray-500">Ongoing placements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">System Health</span>
              <Activity className="h-4 w-4 text-green-500" />
            </div>
            <div className={`text-2xl font-bold ${getHealthColor(stats?.systemHealth.status || 'healthy')}`}>
              {stats?.systemHealth.status || 'Healthy'}
            </div>
            <p className="text-xs text-gray-500">{stats?.systemHealth.uptime || '99.9%'} uptime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="system-config">System Config</TabsTrigger>
          <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="data-management">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium">{log.userName}</p>
                          <p className="text-sm text-gray-600">{log.action} - {log.resource}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm">{stats?.systemHealth.responseTime || 0}ms</span>
                    </div>
                    <Progress value={Math.min((stats?.systemHealth.responseTime || 0) / 5, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-sm">{stats?.systemHealth.errorRate || 0}%</span>
                    </div>
                    <Progress value={stats?.systemHealth.errorRate || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Server Load</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk-operations">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bulk Operations</h3>
              <Button onClick={() => setIsBulkUpload(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Operation
              </Button>
            </div>

            {bulkOperations.map(operation => (
              <Card key={operation.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold capitalize">{operation.type.replace('_', ' ')}</h4>
                        <Badge className={
                          operation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          operation.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          operation.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {operation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Started: {new Date(operation.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{operation.processedRecords}/{operation.totalRecords}</p>
                      <p className="text-xs text-gray-500">records processed</p>
                    </div>
                  </div>

                  <Progress value={operation.progress} className="h-2 mb-2" />

                  {operation.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm font-medium text-red-800">Errors:</p>
                      <ul className="text-sm text-red-700 list-disc list-inside">
                        {operation.errors.slice(0, 3).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {operation.errors.length > 3 && (
                          <li>...and {operation.errors.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {bulkOperations.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Bulk Operations</h3>
                  <p className="text-gray-600">Start a bulk upload or data operation</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="system-config">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">System Configuration</h3>
            </div>

            {systemConfigs.map(config => (
              <Card key={config.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{config.category}</h4>
                      <p className="text-sm text-gray-600">
                        Last updated: {new Date(config.lastUpdated).toLocaleString()} by {config.updatedBy}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedConfig(config)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(config.settings).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</Label>
                        <p className="font-medium">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity-logs">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Activity Logs</h3>
              <Button variant="outline" onClick={() => exportData('analytics')}>
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium text-sm">
                <div>User</div>
                <div>Action</div>
                <div>Resource</div>
                <div>Status</div>
                <div>IP Address</div>
                <div>Timestamp</div>
              </div>
              {activityLogs.map(log => (
                <div key={log.id} className="grid grid-cols-6 gap-4 p-4 border-b text-sm">
                  <div>
                    <p className="font-medium">{log.userName}</p>
                    <p className="text-gray-600">{log.userRole}</p>
                  </div>
                  <div>{log.action}</div>
                  <div>{log.resource}</div>
                  <div>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </div>
                  <div>{log.ipAddress}</div>
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data-management">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Export system data in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" onClick={() => exportData('students')}>
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </Button>
                  <Button variant="outline" onClick={() => exportData('trainers')}>
                    <Users className="h-4 w-4 mr-2" />
                    Trainers
                  </Button>
                  <Button variant="outline" onClick={() => exportData('drives')}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Drives
                  </Button>
                  <Button variant="outline" onClick={() => exportData('analytics')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>Perform system maintenance operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={backupSystem}>
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    System Diagnostics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk Upload Modal */}
      {isBulkUpload && (
        <Dialog open={isBulkUpload} onOpenChange={setIsBulkUpload}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bulk Upload</DialogTitle>
              <DialogDescription>Upload data in bulk using CSV/Excel files</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Upload Type</Label>
                <Select value={uploadType} onValueChange={(value: any) => setUploadType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="trainers">Trainers</SelectItem>
                    <SelectItem value="companies">Companies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select File</Label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBulkUpload(file);
                  }}
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>Supported formats: CSV, Excel</p>
                <p>Max file size: 10MB</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsBulkUpload(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
