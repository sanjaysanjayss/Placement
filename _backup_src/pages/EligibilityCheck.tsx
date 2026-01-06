import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertTriangle, Info, Settings, Users, Target, BookOpen, Award, Eye, Download } from "lucide-react";
import { toast } from "sonner";

interface EligibilityRule {
  id: string;
  name: string;
  description: string;
  type: "global" | "company_specific";
  companyId?: string;
  criteria: {
    minCGPA: number;
    maxBacklogs: number;
    standingArrears: boolean;
    passoutYear: number[];
    departments: string[];
    minAttendance?: number;
    requiredSkills?: string[];
    min10thPercentage?: number;
    min12thPercentage?: number;
    gapYears?: number;
    maxAge?: number;
  };
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface EligibilityResult {
  studentId: string;
  driveId: string;
  positionId: string;
  ruleId: string;
  isEligible: boolean;
  score: number;
  checks: Array<{
    criterion: string;
    passed: boolean;
    value: any;
    required: any;
    weight: number;
  }>;
  explanation: string;
  recommendations: string[];
  checkedAt: string;
}

interface EligibilityOverride {
  id: string;
  studentId: string;
  driveId: string;
  positionId: string;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  status: "pending" | "approved" | "rejected";
}

export default function EligibilityCheck() {
  const [rules, setRules] = useState<EligibilityRule[]>([]);
  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [overrides, setOverrides] = useState<EligibilityOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<EligibilityRule | null>(null);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<EligibilityRule>>({});
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [currentResult, setCurrentResult] = useState<EligibilityResult | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rulesRes, resultsRes, overridesRes] = await Promise.all([
        fetch('http://localhost:3000/eligibilityRules'),
        fetch('http://localhost:3000/eligibilityResults'),
        fetch('http://localhost:3000/eligibilityOverrides')
      ]);

      if (rulesRes.ok) {
        const rulesData = await rulesRes.json();
        setRules(rulesData);
      }

      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        setResults(resultsData);
      }

      if (overridesRes.ok) {
        const overridesData = await overridesRes.json();
        setOverrides(overridesData);
      }
    } catch (error) {
      toast.error("Failed to fetch eligibility data");
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (studentId: string, driveId: string, positionId: string) => {
    setCheckingEligibility(true);
    try {
      // Get student profile
      const profileRes = await fetch(`http://localhost:3000/studentProfiles?userId=${studentId}`);
      const profileData = await profileRes.json();
      const profile = profileData[0];

      if (!profile) {
        toast.error("Student profile not found");
        return;
      }

      // Get drive and position details
      const driveRes = await fetch(`http://localhost:3000/companyDrives?id=${driveId}`);
      const driveData = await driveRes.json();
      const drive = driveData[0];

      if (!drive) {
        toast.error("Drive not found");
        return;
      }

      const position = drive.positions.find((p: any) => p.id === positionId);
      if (!position) {
        toast.error("Position not found");
        return;
      }

      // Get applicable rules
      const applicableRules = rules.filter(rule => 
        rule.isActive && (
          rule.type === 'global' || 
          (rule.type === 'company_specific' && rule.companyId === driveId)
        )
      ).sort((a, b) => b.priority - a.priority);

      // Perform eligibility check
      const ruleToApply = applicableRules[0];
      if (!ruleToApply) {
        toast.error("No eligibility rules found");
        return;
      }

      const checks = [];
      let totalScore = 0;
      let maxScore = 0;

      // CGPA Check
      const cgpa = profile.academicInfo?.cgpa || 0;
      const cgpaPassed = cgpa >= ruleToApply.criteria.minCGPA;
      checks.push({
        criterion: "CGPA",
        passed: cgpaPassed,
        value: cgpa,
        required: `>= ${ruleToApply.criteria.minCGPA}`,
        weight: 25
      });
      if (cgpaPassed) totalScore += 25;
      maxScore += 25;

      // Backlog Check
      const backlogs = profile.academicInfo?.backlogs || 0;
      const backlogPassed = backlogs <= ruleToApply.criteria.maxBacklogs;
      checks.push({
        criterion: "Backlogs",
        passed: backlogPassed,
        value: backlogs,
        required: `<= ${ruleToApply.criteria.maxBacklogs}`,
        weight: 20
      });
      if (backlogPassed) totalScore += 20;
      maxScore += 20;

      // Department Check
      const department = profile.personalInfo?.department || '';
      const deptPassed = ruleToApply.criteria.departments.includes(department);
      checks.push({
        criterion: "Department",
        passed: deptPassed,
        value: department,
        required: ruleToApply.criteria.departments.join(', '),
        weight: 15
      });
      if (deptPassed) totalScore += 15;
      maxScore += 15;

      // 10th Percentage Check
      if (ruleToApply.criteria.min10thPercentage) {
        const tenthPercentage = profile.academicInfo?.tenthPercentage || 0;
        const tenthPassed = tenthPercentage >= ruleToApply.criteria.min10thPercentage;
        checks.push({
          criterion: "10th Percentage",
          passed: tenthPassed,
          value: tenthPercentage,
          required: `>= ${ruleToApply.criteria.min10thPercentage}%`,
          weight: 10
        });
        if (tenthPassed) totalScore += 10;
        maxScore += 10;
      }

      // 12th Percentage Check
      if (ruleToApply.criteria.min12thPercentage) {
        const twelfthPercentage = profile.academicInfo?.twelfthPercentage || 0;
        const twelfthPassed = twelfthPercentage >= ruleToApply.criteria.min12thPercentage;
        checks.push({
          criterion: "12th Percentage",
          passed: twelfthPassed,
          value: twelfthPercentage,
          required: `>= ${ruleToApply.criteria.min12thPercentage}%`,
          weight: 10
        });
        if (twelfthPassed) totalScore += 10;
        maxScore += 10;
      }

      // Standing Arrears Check
      if (ruleToApply.criteria.standingArrears) {
        const standingArrears = profile.academicInfo?.standingArrears || 0;
        const arrearsPassed = standingArrears === 0;
        checks.push({
          criterion: "Standing Arrears",
          passed: arrearsPassed,
          value: standingArrears,
          required: "0",
          weight: 20
        });
        if (arrearsPassed) totalScore += 20;
        maxScore += 20;
      }

      const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
      const isEligible = checks.every(check => check.passed);

      // Generate explanation
      const failedChecks = checks.filter(check => !check.passed);
      const explanation = isEligible 
        ? "Student meets all eligibility criteria"
        : `Student fails on: ${failedChecks.map(check => check.criterion).join(', ')}`;

      // Generate recommendations
      const recommendations = [];
      if (!cgpaPassed) recommendations.push("Focus on improving CGPA through better academic performance");
      if (!backlogPassed) recommendations.push("Clear pending backlogs to meet eligibility criteria");
      if (!deptPassed) recommendations.push("Check if department eligibility can be expanded");
      if (ruleToApply.criteria.min10thPercentage && !checks.find(c => c.criterion === "10th Percentage")?.passed) {
        recommendations.push("10th percentage below threshold - may need special consideration");
      }

      const result: EligibilityResult = {
        studentId,
        driveId,
        positionId,
        ruleId: ruleToApply.id,
        isEligible,
        score: finalScore,
        checks,
        explanation,
        recommendations,
        checkedAt: new Date().toISOString()
      };

      // Save result
      const response = await fetch('http://localhost:3000/eligibilityResults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });

      if (response.ok) {
        setResults(prev => [...prev, result]);
        setCurrentResult(result);
        toast.success(isEligible ? "Student is eligible!" : "Student is not eligible");
      }
    } catch (error) {
      toast.error("Failed to check eligibility");
    } finally {
      setCheckingEligibility(false);
    }
  };

  const createRule = async () => {
    try {
      const ruleToCreate = {
        ...newRule,
        id: Date.now().toString(),
        isActive: true,
        priority: newRule.priority || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3000/eligibilityRules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleToCreate)
      });

      if (response.ok) {
        setRules(prev => [...prev, ruleToCreate as EligibilityRule]);
        setIsCreatingRule(false);
        setNewRule({});
        toast.success("Eligibility rule created successfully");
      }
    } catch (error) {
      toast.error("Failed to create rule");
    }
  };

  const requestOverride = async (studentId: string, driveId: string, positionId: string, reason: string) => {
    try {
      const override: EligibilityOverride = {
        id: Date.now().toString(),
        studentId,
        driveId,
        positionId,
        reason,
        approvedBy: "current_admin", // Replace with actual admin ID
        approvedAt: new Date().toISOString(),
        status: "pending"
      };

      const response = await fetch('http://localhost:3000/eligibilityOverrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(override)
      });

      if (response.ok) {
        setOverrides(prev => [...prev, override]);
        toast.success("Override request submitted");
      }
    } catch (error) {
      toast.error("Failed to submit override request");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Eligibility Check System</h1>
        <Button onClick={() => setIsCreatingRule(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <Tabs defaultValue="check" className="space-y-6">
        <TabsList>
          <TabsTrigger value="check">Check Eligibility</TabsTrigger>
          <TabsTrigger value="rules">Eligibility Rules</TabsTrigger>
          <TabsTrigger value="results">Check Results</TabsTrigger>
          <TabsTrigger value="overrides">Override Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="check">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Check Student Eligibility</CardTitle>
                <CardDescription>Verify if a student meets the criteria for a specific drive position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Student ID</Label>
                    <Input placeholder="Enter student ID" />
                  </div>
                  <div>
                    <Label>Drive</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select drive" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drive1">Company A - Campus Drive</SelectItem>
                        <SelectItem value="drive2">Company B - Pool Drive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pos1">Software Engineer</SelectItem>
                        <SelectItem value="pos2">Data Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={() => checkEligibility("student1", "drive1", "pos1")}
                  disabled={checkingEligibility}
                >
                  {checkingEligibility ? "Checking..." : "Check Eligibility"}
                </Button>
              </CardContent>
            </Card>

            {currentResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {currentResult.isEligible ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    Eligibility Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Overall Score: {currentResult.score}%</span>
                    <Badge variant={currentResult.isEligible ? "default" : "destructive"}>
                      {currentResult.isEligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                  </div>
                  <Progress value={currentResult.score} className="h-3" />

                  <div>
                    <h4 className="font-semibold mb-2">Detailed Checks:</h4>
                    <div className="space-y-2">
                      {currentResult.checks.map((check, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            {check.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">{check.criterion}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm">{check.value} {check.required}</span>
                            <span className="ml-2 text-xs text-gray-500">({check.weight}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Explanation:</h4>
                    <p className="text-gray-600">{currentResult.explanation}</p>
                  </div>

                  {currentResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {currentResult.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!currentResult.isEligible && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => requestOverride(
                        currentResult.studentId,
                        currentResult.driveId,
                        currentResult.positionId,
                        "Requesting eligibility override"
                      )}>
                        Request Override
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid gap-4">
            {rules.map(rule => (
              <Card key={rule.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{rule.name}</h3>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {rule.type === 'global' ? 'Global' : 'Company Specific'}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{rule.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRule(rule)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label>Min CGPA</Label>
                      <p className="font-medium">{rule.criteria.minCGPA}</p>
                    </div>
                    <div>
                      <Label>Max Backlogs</Label>
                      <p className="font-medium">{rule.criteria.maxBacklogs}</p>
                    </div>
                    <div>
                      <Label>Departments</Label>
                      <p className="font-medium">{rule.criteria.departments.join(', ')}</p>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <p className="font-medium">{rule.priority}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {rules.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Eligibility Rules</h3>
                  <p className="text-gray-600">Create eligibility rules to start checking student eligibility</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="grid gap-4">
            {results.map(result => (
              <Card key={`${result.studentId}-${result.driveId}-${result.positionId}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Eligibility Check Result</h3>
                      <p className="text-sm text-gray-600">
                        Student: {result.studentId} | Drive: {result.driveId} | Position: {result.positionId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Score: {result.score}%</span>
                      <Badge variant={result.isEligible ? "default" : "destructive"}>
                        {result.isEligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={result.score} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">
                    Checked: {new Date(result.checkedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
            {results.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Check Results</h3>
                  <p className="text-gray-600">Eligibility check results will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="overrides">
          <div className="grid gap-4">
            {overrides.map(override => (
              <Card key={override.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Override Request</h3>
                      <p className="text-sm text-gray-600">
                        Student: {override.studentId} | Drive: {override.driveId}
                      </p>
                    </div>
                    <Badge variant={
                      override.status === 'approved' ? 'default' :
                      override.status === 'rejected' ? 'destructive' : 'secondary'
                    }>
                      {override.status}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-2">{override.reason}</p>
                  <p className="text-sm text-gray-600">
                    Requested: {new Date(override.approvedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
            {overrides.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Override Requests</h3>
                  <p className="text-gray-600">Override requests will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <h3 className="text-2xl font-bold">{results.length}</h3>
                <p className="text-gray-600">Total Checks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                <h3 className="text-2xl font-bold">
                  {results.filter(r => r.isEligible).length}
                </h3>
                <p className="text-gray-600">Eligible Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <h3 className="text-2xl font-bold">
                  {results.filter(r => !r.isEligible).length}
                </h3>
                <p className="text-gray-600">Not Eligible</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                <h3 className="text-2xl font-bold">
                  {results.length > 0 ? Math.round((results.filter(r => r.isEligible).length / results.length) * 100) : 0}%
                </h3>
                <p className="text-gray-600">Success Rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Rule Modal */}
      {isCreatingRule && (
        <Dialog open={isCreatingRule} onOpenChange={setIsCreatingRule}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Eligibility Rule</DialogTitle>
              <DialogDescription>Define criteria for student eligibility</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rule Name</Label>
                  <Input
                    value={newRule.name || ''}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Standard Campus Eligibility"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select onValueChange={(value: "global" | "company_specific") => setNewRule(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="company_specific">Company Specific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newRule.description || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the eligibility criteria..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Min CGPA</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newRule.criteria?.minCGPA || ''}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, minCGPA: parseFloat(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Max Backlogs</Label>
                  <Input
                    type="number"
                    value={newRule.criteria?.maxBacklogs || ''}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, maxBacklogs: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Min 10th %</Label>
                  <Input
                    type="number"
                    value={newRule.criteria?.min10thPercentage || ''}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, min10thPercentage: parseFloat(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Min 12th %</Label>
                  <Input
                    type="number"
                    value={newRule.criteria?.min12thPercentage || ''}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, min12thPercentage: parseFloat(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Departments</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map(dept => (
                    <Badge key={dept} variant="outline" className="cursor-pointer">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingRule(false)}>Cancel</Button>
                <Button onClick={createRule}>Create Rule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
