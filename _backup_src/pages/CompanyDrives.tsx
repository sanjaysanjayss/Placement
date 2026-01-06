import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, MapPin, DollarSign, Calendar, Users, FileText, CheckCircle, XCircle, Clock, Award, Plus, Edit2, Eye, Upload, AlertTriangle, Info, Shield, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface CompanyDrive {
  id: string;
  company: {
    name: string;
    logo?: string;
    website: string;
    industry: string;
    description: string;
    size: string;
    headquarters: string;
  };
  drive: {
    title: string;
    description: string;
    type: "campus" | "pool" | "walkin";
    status: "upcoming" | "registration_open" | "registration_closed" | "ongoing" | "completed" | "cancelled";
    registrationDeadline: string;
    driveDate: string;
    venue: string;
    mode: "online" | "offline" | "hybrid";
  };
  positions: Array<{
    id: string;
    title: string;
    department: string[];
    package: {
      min: number;
      max: number;
      currency: string;
      ctcOrGross: "CTC" | "Gross";
    };
    eligibility: {
      minCGPA: number;
      maxBacklogs: number;
      standingArrears: boolean;
      passoutYear: number[];
      departments: string[];
      skills?: string[];
    };
    locations: string[];
    bond: {
      period?: number;
      amount?: number;
    };
    selectionProcess: string[];
    positionsAvailable: number;
    registered: number;
    shortlisted: number;
    selected: number;
  }>;
  requirements: {
    documents: string[];
    dressCode: string;
    instructions: string[];
  };
  contacts: {
    hrName: string;
    hrEmail: string;
    hrPhone: string;
    coordinatorName: string;
    coordinatorPhone: string;
  };
  timeline: Array<{
    round: string;
    date: string;
    description: string;
    status: "upcoming" | "completed" | "ongoing";
  }>;
  analytics: {
    totalViews: number;
    totalRegistrations: number;
    eligibilityCheckRate: number;
    registrationConversionRate: number;
    attendanceRate: number;
    selectionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface DriveRegistration {
  id: string;
  driveId: string;
  positionId: string;
  studentId: string;
  registrationId: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  registeredAt: string;
  confirmedAt?: string;
  resumeId: string;
  interviewSlot?: string;
  paymentStatus?: "pending" | "paid" | "refunded";
  paymentAmount?: number;
  declarations: {
    informationCorrect: boolean;
    agreeToRules: boolean;
    attendAllRounds: boolean;
  };
  eligibilityCheck: {
    cgpaValid: boolean;
    backlogValid: boolean;
    departmentValid: boolean;
    batchValid: boolean;
    trainingValid: boolean;
    overallValid: boolean;
  };
}

interface Resume {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  atsScore: number;
  isDefault: boolean;
  fileSize: number;
  fileType: string;
}

export default function CompanyDrives() {
  const [drives, setDrives] = useState<CompanyDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState<CompanyDrive | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newDrive, setNewDrive] = useState<Partial<CompanyDrive>>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [registrations, setRegistrations] = useState<DriveRegistration[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<DriveRegistration>>({});
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || "1"; // Default to user ID 1 for testing

      const [drivesRes, profileRes, resumesRes, registrationsRes] = await Promise.all([
        fetch('http://localhost:3003/companyDrives'),
        fetch(`http://localhost:3003/studentProfiles?userId=${userId}`),
        fetch(`http://localhost:3003/resumes?userId=${userId}`),
        fetch(`http://localhost:3003/driveRegistrations?studentId=${userId}`)
      ]);

      if (drivesRes.ok) {
        const drivesData = await drivesRes.json();
        setDrives(drivesData);
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.length > 0) {
          setUserProfile(profileData[0]);
        }
      }

      if (resumesRes.ok) {
        const resumesData = await resumesRes.json();
        setUserResumes(resumesData);
      }

      if (registrationsRes.ok) {
        const registrationsData = await registrationsRes.json();
        setRegistrations(registrationsData);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const performEligibilityCheck = (drive: CompanyDrive, position: any) => {
    if (!userProfile) return { overallValid: false, details: {} };

    const cgpa = userProfile.academicInfo?.currentCGPA || 0;
    const backlogs = userProfile.academicInfo?.backlogs || 0;
    const department = userProfile.personalInfo?.department || '';
    const batch = userProfile.personalInfo?.batch || '';
    const standingArrears = userProfile.academicInfo?.standingArrears || 0;

    const cgpaValid = cgpa >= position.eligibility.minCGPA;
    const backlogValid = backlogs <= position.eligibility.maxBacklogs;
    const departmentValid = position.eligibility.departments.includes(department);
    const batchValid = position.eligibility.passoutYear.length === 0 || position.eligibility.passoutYear.includes(parseInt(batch));
    const trainingValid = true; // Add training attendance check if needed
    const arrearsValid = !position.eligibility.standingArrears || standingArrears === 0;

    return {
      overallValid: cgpaValid && backlogValid && departmentValid && batchValid && trainingValid && arrearsValid,
      cgpaValid,
      backlogValid,
      departmentValid,
      batchValid,
      trainingValid,
      arrearsValid,
      details: {
        studentCGPA: cgpa,
        requiredCGPA: position.eligibility.minCGPA,
        studentBacklogs: backlogs,
        maxBacklogs: position.eligibility.maxBacklogs,
        studentDepartment: department,
        requiredDepartments: position.eligibility.departments
      }
    };
  };

  const isAlreadyRegistered = (driveId: string, positionId: string) => {
    return registrations.some(reg => reg.driveId === driveId && reg.positionId === positionId);
  };

  const isRegistrationDeadlinePassed = (deadline: string) => {
    return new Date() > new Date(deadline);
  };

  const handleRegistration = async (drive: CompanyDrive, position: any) => {
    if (!userProfile) {
      toast.error("Please complete your profile first");
      return;
    }

    // Check if already registered
    if (isAlreadyRegistered(drive.id, position.id)) {
      toast.error("You have already registered for this position");
      return;
    }

    // Check deadline
    if (isRegistrationDeadlinePassed(drive.drive.registrationDeadline)) {
      toast.error("Registration deadline has passed");
      return;
    }

    // Perform eligibility check
    const eligibility = performEligibilityCheck(drive, position);
    if (!eligibility.overallValid) {
      toast.error("You are not eligible for this position");
      return;
    }

    // Set registration data and open modal
    setRegistrationData({
      driveId: drive.id,
      positionId: position.id,
      studentId: 'current_user',
      registrationId: `REG-${Date.now()}`,
      eligibilityCheck: eligibility
    });
    setIsRegistering(true);
  };

  const submitRegistration = async () => {
    if (!registrationData.driveId || !registrationData.positionId || !selectedResume) {
      toast.error("Please select a resume and complete all declarations");
      return;
    }

    try {
      const registration: DriveRegistration = {
        ...registrationData,
        id: Date.now().toString(),
        status: "confirmed",
        registeredAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        resumeId: selectedResume,
        declarations: {
          informationCorrect: true,
          agreeToRules: true,
          attendAllRounds: true
        }
      };

      const response = await fetch('http://localhost:3003/driveRegistrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration)
      });

      if (response.ok) {
        setRegistrations(prev => [...prev, registration]);
        
        // Update drive registration count
        const drive = drives.find(d => d.id === registrationData.driveId);
        if (drive) {
          const updatedDrive = {
            ...drive,
            positions: drive.positions.map(p =>
              p.id === registrationData.positionId ? { ...p, registered: p.registered + 1 } : p
            )
          };
          setDrives(prev => prev.map(d => d.id === registrationData.driveId ? updatedDrive : d));
        }

        // Send notifications
        toast.success("Registration successful! Registration ID: " + registration.registrationId);
        
        // Reset registration state
        setIsRegistering(false);
        setRegistrationData({});
        setSelectedResume("");
      }
    } catch (error) {
      toast.error("Failed to complete registration");
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadingResume(true);
    try {
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString(),
        atsScore: Math.floor(Math.random() * 30) + 70, // Mock ATS score
        isDefault: userResumes.length === 0,
        fileSize: file.size,
        fileType: file.type
      };

      const response = await fetch('http://localhost:3003/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResume)
      });

      if (response.ok) {
        setUserResumes(prev => [...prev, newResume]);
        setSelectedResume(newResume.id);
        toast.success("Resume uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const processPayment = async () => {
    setPaymentProcessing(true);
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Payment processed successfully");
      setPaymentProcessing(false);
    } catch (error) {
      toast.error("Payment failed");
      setPaymentProcessing(false);
    }
  };

  const getRegistrationButton = (drive: CompanyDrive, position: any) => {
    const eligibility = performEligibilityCheck(drive, position);
    const alreadyRegistered = isAlreadyRegistered(drive.id, position.id);
    const deadlinePassed = isRegistrationDeadlinePassed(drive.drive.registrationDeadline);
    const registrationClosed = drive.drive.status !== 'registration_open';

    if (alreadyRegistered) {
      return (
        <Button disabled className="bg-green-600">
          <CheckCircle className="h-4 w-4 mr-2" />
          Registered
        </Button>
      );
    }

    if (deadlinePassed || registrationClosed) {
      return (
        <Button disabled variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Registration Closed
        </Button>
      );
    }

    if (!eligibility.overallValid) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Not Eligible</span>
          </div>
          <div className="text-xs text-gray-600">
            {!eligibility.cgpaValid && `CGPA: ${eligibility.details.studentCGPA} (Required: ${eligibility.details.requiredCGPA})`}
            {!eligibility.backlogValid && `Backlogs: ${eligibility.details.studentBacklogs} (Max: ${eligibility.details.maxBacklogs})`}
            {!eligibility.departmentValid && `Department not eligible`}
          </div>
        </div>
      );
    }

    return (
      <Button onClick={() => handleRegistration(drive, position)}>
        Register Now →
      </Button>
    );
  };

  const getDriveTypeColor = (type: string) => {
    switch (type) {
      case 'campus': return 'bg-blue-100 text-blue-800';
      case 'pool': return 'bg-green-100 text-green-800';
      case 'walkin': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Company Drives</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Drive
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Drives</TabsTrigger>
          <TabsTrigger value="eligible">Eligible for You</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6">
            {drives.map(drive => (
              <Card key={drive.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{drive.company.name}</h3>
                          <Badge className={getDriveTypeColor(drive.drive.type)}>
                            {drive.drive.type}
                          </Badge>
                          <Badge className={getStatusColor(drive.drive.status)}>
                            {drive.drive.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{drive.drive.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{drive.company.industry}</span>
                          <span>•</span>
                          <span>{drive.company.size}</span>
                          <span>•</span>
                          <span>{drive.company.headquarters}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedDrive(drive)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {drive.positions.map(position => (
                      <Card key={position.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{position.title}</h4>
                            <Badge variant="outline">
                              {position.registered}/{position.positionsAvailable}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span>{position.package.currency} {position.package.min} - {position.package.max} {position.package.ctcOrGross}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{position.locations.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-purple-500" />
                              <span>Min CGPA: {position.eligibility.minCGPA}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            {getRegistrationButton(drive, position)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Drive Date: {new Date(drive.drive.driveDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Reg Deadline: {new Date(drive.drive.registrationDeadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{drive.analytics.totalRegistrations} registrations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {drives.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Company Drives</h3>
                  <p className="text-gray-600">No placement drives are currently available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="eligible">
          <div className="grid gap-6">
            {drives
              .filter(drive => drive.positions.some(pos => {
                const eligibility = performEligibilityCheck(drive, pos);
                return eligibility.overallValid;
              }))
              .map(drive => (
                <Card key={drive.id}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{drive.company.name}</h3>
                    <p className="text-gray-600 mb-4">{drive.drive.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {drive.positions
                        .filter(position => {
                          const eligibility = performEligibilityCheck(drive, position);
                          return eligibility.overallValid;
                        })
                        .map(position => (
                          <div key={position.id} className="border rounded-lg p-4">
                            <h4 className="font-semibold">{position.title}</h4>
                            <p className="text-sm text-gray-600">
                              {position.package.currency} {position.package.min} - {position.package.max} {position.package.ctcOrGross}
                            </p>
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => handleRegistration(drive, position)}
                              disabled={isAlreadyRegistered(drive.id, position.id)}
                            >
                              {isAlreadyRegistered(drive.id, position.id) ? 'Registered' : 'Register'}
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Registration Modal */}
      {isRegistering && registrationData && (
        <Dialog open={isRegistering} onOpenChange={setIsRegistering}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Complete Your Registration</DialogTitle>
              <DialogDescription>
                Please review your details and complete the registration process
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Student Confirmation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Details (Read-Only)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="font-medium">{userProfile?.personalInfo?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Roll Number</Label>
                      <p className="font-medium">{userProfile?.personalInfo?.rollNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Department & Batch</Label>
                      <p className="font-medium">{userProfile?.personalInfo?.department} - {userProfile?.personalInfo?.batch}</p>
                    </div>
                    <div>
                      <Label>CGPA & Backlogs</Label>
                      <p className="font-medium">{userProfile?.academicInfo?.cgpa} CGPA, {userProfile?.academicInfo?.backlogs} Backlogs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Resume</Label>
                    <Select value={selectedResume} onValueChange={setSelectedResume}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {userResumes.map(resume => (
                          <SelectItem key={resume.id} value={resume.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{resume.name}</span>
                              <div className="flex items-center gap-2">
                                {resume.isDefault && <Badge variant="secondary">Default</Badge>}
                                <span className="text-xs text-gray-500">ATS: {resume.atsScore}%</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Or Upload New Resume</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload">
                        <Button variant="outline" disabled={uploadingResume}>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                        </Button>
                      </label>
                      <span className="text-sm text-gray-500">PDF/DOC, Max 5MB</span>
                    </div>
                  </div>

                  {selectedResume && (
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{userResumes.find(r => r.id === selectedResume)?.name}</p>
                          <p className="text-sm text-gray-600">
                            ATS Score: {userResumes.find(r => r.id === selectedResume)?.atsScore}%
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Declaration & Consent */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Declaration & Consent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox id="info-correct" />
                    <Label htmlFor="info-correct" className="text-sm">
                      I confirm that all information provided is correct and authentic
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="agree-rules" />
                    <Label htmlFor="agree-rules" className="text-sm">
                      I agree to abide by the company rules and placement cell guidelines
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="attend-rounds" />
                    <Label htmlFor="attend-rounds" className="text-sm">
                      I will attend all rounds if shortlisted and maintain professional conduct
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section (if applicable) */}
              {false && ( // Add payment logic based on drive requirements
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Registration Fee
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Registration Fee:</span>
                        <span className="font-bold">₹500</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={processPayment}
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Section */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsRegistering(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={submitRegistration}
                  disabled={!selectedResume}
                >
                  Complete Registration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Drive Details Modal */}
      {selectedDrive && (
        <Dialog open={!!selectedDrive} onOpenChange={() => setSelectedDrive(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Building2 className="h-6 w-6" />
                {selectedDrive.company.name}
              </DialogTitle>
              <DialogDescription>{selectedDrive.drive.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Industry</Label>
                      <p className="font-medium">{selectedDrive.company.industry}</p>
                    </div>
                    <div>
                      <Label>Size</Label>
                      <p className="font-medium">{selectedDrive.company.size}</p>
                    </div>
                    <div>
                      <Label>Headquarters</Label>
                      <p className="font-medium">{selectedDrive.company.headquarters}</p>
                    </div>
                    <div>
                      <Label>Website</Label>
                      <a href={selectedDrive.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedDrive.company.website}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Drive Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Drive Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Drive Date</Label>
                      <p className="font-medium">{new Date(selectedDrive.drive.driveDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Registration Deadline</Label>
                      <p className="font-medium">{new Date(selectedDrive.drive.registrationDeadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Venue</Label>
                      <p className="font-medium">{selectedDrive.drive.venue}</p>
                    </div>
                    <div>
                      <Label>Mode</Label>
                      <p className="font-medium capitalize">{selectedDrive.drive.mode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Positions */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedDrive.positions.map(position => (
                      <div key={position.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{position.title}</h4>
                          <Badge variant="outline">
                            {position.registered}/{position.positionsAvailable} registered
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label>Package</Label>
                            <p>{position.package.currency} {position.package.min} - {position.package.max} {position.package.ctcOrGross}</p>
                          </div>
                          <div>
                            <Label>Locations</Label>
                            <p>{position.locations.join(', ')}</p>
                          </div>
                          <div>
                            <Label>Departments</Label>
                            <p>{position.eligibility.departments.join(', ')}</p>
                          </div>
                          <div>
                            <Label>Min CGPA</Label>
                            <p>{position.eligibility.minCGPA}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Label>Selection Process</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {position.selectionProcess.map((round, index) => (
                              <Badge key={index} variant="outline">{round}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Drive Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Total Views</Label>
                      <p className="text-2xl font-bold">{selectedDrive.analytics.totalViews}</p>
                    </div>
                    <div>
                      <Label>Total Registrations</Label>
                      <p className="text-2xl font-bold">{selectedDrive.analytics.totalRegistrations}</p>
                    </div>
                    <div>
                      <Label>Attendance Rate</Label>
                      <p className="text-2xl font-bold">{selectedDrive.analytics.attendanceRate}%</p>
                    </div>
                    <div>
                      <Label>Selection Rate</Label>
                      <p className="text-2xl font-bold">{selectedDrive.analytics.selectionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
