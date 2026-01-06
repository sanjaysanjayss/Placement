import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, TrendingDown, Users, Target, Award, BookOpen, Download, Calendar, Filter, Eye } from "lucide-react";
import { toast } from "sonner";

interface PerformanceMetrics {
  studentId: string;
  period: string;
  metrics: {
    attendanceRate: number;
    testScores: {
      aptitude: number;
      technical: number;
      communication: number;
      overall: number;
    };
    driveParticipation: {
      totalDrives: number;
      registered: number;
      attended: number;
      selected: number;
    };
    skillRatings: {
      technical: number;
      communication: number;
      problemSolving: number;
      teamwork: number;
      leadership: number;
    };
    trainingProgress: {
      sessionsCompleted: number;
      totalSessions: number;
      averageRating: number;
    };
    readinessScore: number;
    improvementAreas: string[];
    strengths: string[];
  };
  createdAt: string;
}

interface BatchAnalytics {
  batch: string;
  department: string;
  totalStudents: number;
  averageCGPA: number;
  averageAttendance: number;
  placementRate: number;
  averagePackage: number;
  topSkills: string[];
  performanceTrends: Array<{
    month: string;
    readinessScore: number;
    placementRate: number;
  }>;
}

interface CompanyAnalytics {
  companyId: string;
  companyName: string;
  totalApplications: number;
  totalSelected: number;
  selectionRate: number;
  averagePackage: number;
  requiredSkills: string[];
  performanceByDepartment: Array<{
    department: string;
    applications: number;
    selected: number;
    successRate: number;
  }>;
}

export default function PerformanceAnalytics() {
  const [studentMetrics, setStudentMetrics] = useState<PerformanceMetrics[]>([]);
  const [batchAnalytics, setBatchAnalytics] = useState<BatchAnalytics[]>([]);
  const [companyAnalytics, setCompanyAnalytics] = useState<CompanyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod, selectedBatch, selectedDepartment]);

  const fetchAnalyticsData = async () => {
    try {
      const [metricsRes, batchRes, companyRes] = await Promise.all([
        fetch(`http://localhost:3000/performanceMetrics?period=${selectedPeriod}`),
        fetch(`http://localhost:3000/batchAnalytics?batch=${selectedBatch}&department=${selectedDepartment}`),
        fetch('http://localhost:3000/companyAnalytics')
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setStudentMetrics(metricsData);
      }

      if (batchRes.ok) {
        const batchData = await batchRes.json();
        setBatchAnalytics(batchData);
      }

      if (companyRes.ok) {
        const companyData = await companyRes.json();
        setCompanyAnalytics(companyData);
      }
    } catch (error) {
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'student' | 'batch' | 'company') => {
    try {
      toast.success(`Generating ${type} report...`);
      // In a real app, generate and download PDF/Excel report
    } catch (error) {
      toast.error("Failed to generate report");
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getReadinessBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Sample data for charts
  const readinessTrendData = [
    { month: 'Jan', score: 65, target: 70 },
    { month: 'Feb', score: 68, target: 70 },
    { month: 'Mar', score: 72, target: 75 },
    { month: 'Apr', score: 75, target: 75 },
    { month: 'May', score: 78, target: 80 },
    { month: 'Jun', score: 82, target: 80 },
  ];

  const skillDistributionData = [
    { name: 'Programming', value: 85, fill: '#0088FE' },
    { name: 'Communication', value: 72, fill: '#00C49F' },
    { name: 'Problem Solving', value: 78, fill: '#FFBB28' },
    { name: 'Aptitude', value: 70, fill: '#FF8042' },
    { name: 'Teamwork', value: 88, fill: '#8884D8' },
  ];

  const departmentPerformanceData = [
    { department: 'CSE', placement: 85, avgPackage: 8.5 },
    { department: 'IT', placement: 78, avgPackage: 7.2 },
    { department: 'ECE', placement: 72, avgPackage: 6.8 },
    { department: 'EEE', placement: 68, avgPackage: 6.2 },
    { department: 'Mechanical', placement: 65, avgPackage: 5.8 },
  ];

  const radarData = [
    { skill: 'Technical', A: 85, fullMark: 100 },
    { skill: 'Communication', A: 72, fullMark: 100 },
    { skill: 'Problem Solving', A: 78, fullMark: 100 },
    { skill: 'Teamwork', A: 88, fullMark: 100 },
    { skill: 'Leadership', A: 65, fullMark: 100 },
    { skill: 'Aptitude', A: 70, fullMark: 100 },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_quarter">Last Quarter</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Readiness Score</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">76.8%</div>
            <p className="text-xs text-gray-500">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Placement Rate</span>
              <Award className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">73.4%</div>
            <p className="text-xs text-gray-500">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Attendance</span>
              <BookOpen className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">84.2%</div>
            <p className="text-xs text-gray-500">+1.8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Students</span>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-gray-500">+23 new this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Student Performance</TabsTrigger>
          <TabsTrigger value="batch">Batch Analytics</TabsTrigger>
          <TabsTrigger value="company">Company Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Readiness Score Trend</CardTitle>
                <CardDescription>Monthly average readiness scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={readinessTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} name="Actual Score" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>Average skill ratings across all students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={skillDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {skillDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Placement rates and average packages by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="placement" fill="#8884d8" name="Placement %" />
                    <Bar yAxisId="right" dataKey="avgPackage" fill="#82ca9d" name="Avg Package (LPA)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Radar</CardTitle>
                <CardDescription>Overall skill assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    <SelectItem value="2021">2021 Batch</SelectItem>
                    <SelectItem value="2022">2022 Batch</SelectItem>
                    <SelectItem value="2023">2023 Batch</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => generateReport('student')}>
                <Download className="h-4 w-4 mr-2" />
                Export Student Report
              </Button>
            </div>

            <div className="grid gap-4">
              {studentMetrics.slice(0, 5).map((metric) => (
                <Card key={metric.studentId}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Student {metric.studentId}</h3>
                        <p className="text-sm text-gray-600">Performance for {metric.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getReadinessColor(metric.metrics.readinessScore)}`}>
                          {metric.metrics.readinessScore}%
                        </span>
                        <Badge className={getReadinessBadge(metric.metrics.readinessScore)}>
                          {metric.metrics.readinessScore >= 80 ? 'Excellent' : 
                           metric.metrics.readinessScore >= 60 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-gray-600">Attendance</Label>
                        <div className="flex items-center gap-2">
                          <Progress value={metric.metrics.attendanceRate} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{metric.metrics.attendanceRate}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Test Scores</Label>
                        <p className="font-medium">{metric.metrics.testScores.overall}%</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Drives Attended</Label>
                        <p className="font-medium">{metric.metrics.driveParticipation.attended}/{metric.metrics.driveParticipation.totalDrives}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Selection Rate</Label>
                        <p className="font-medium">{metric.metrics.driveParticipation.selected > 0 ? 
                          `${Math.round((metric.metrics.driveParticipation.selected / metric.metrics.driveParticipation.attended) * 100)}%` : 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Strengths</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {metric.metrics.strengths.slice(0, 2).map((strength, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{strength}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Improvement Areas</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {metric.metrics.improvementAreas.slice(0, 2).map((area, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{area}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batch">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => generateReport('batch')}>
                <Download className="h-4 w-4 mr-2" />
                Export Batch Report
              </Button>
            </div>

            <div className="grid gap-4">
              {batchAnalytics.map((batch) => (
                <Card key={`${batch.batch}-${batch.department}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{batch.batch} - {batch.department}</h3>
                        <p className="text-sm text-gray-600">{batch.totalStudents} students</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">{batch.placementRate}%</span>
                        <Badge className="bg-green-100 text-green-800">Placement Rate</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-gray-600">Avg CGPA</Label>
                        <p className="font-medium">{batch.averageCGPA}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Avg Attendance</Label>
                        <p className="font-medium">{batch.averageAttendance}%</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Placement Rate</Label>
                        <p className="font-medium">{batch.placementRate}%</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Avg Package</Label>
                        <p className="font-medium">{batch.averagePackage} LPA</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Placed Students</Label>
                        <p className="font-medium">{Math.round(batch.totalStudents * batch.placementRate / 100)}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-600">Top Skills</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {batch.topSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => generateReport('company')}>
                <Download className="h-4 w-4 mr-2" />
                Export Company Report
              </Button>
            </div>

            <div className="grid gap-4">
              {companyAnalytics.map((company) => (
                <Card key={company.companyId}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{company.companyName}</h3>
                        <p className="text-sm text-gray-600">Hiring Analytics</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{company.selectionRate}%</span>
                        <Badge className="bg-blue-100 text-blue-800">Selection Rate</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-gray-600">Total Applications</Label>
                        <p className="font-medium">{company.totalApplications}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Selected</Label>
                        <p className="font-medium">{company.totalSelected}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Selection Rate</Label>
                        <p className="font-medium">{company.selectionRate}%</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Avg Package</Label>
                        <p className="font-medium">{company.averagePackage} LPA</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Department-wise Performance</Label>
                      {company.performanceByDepartment.map((dept, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{dept.department}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">{dept.applications} applications</span>
                            <span className="text-sm">{dept.selected} selected</span>
                            <Badge variant="outline">{dept.successRate}% success</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Long-term performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Advanced Trend Analysis</h3>
                  <p className="text-gray-600">Detailed trend analysis with predictive analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
