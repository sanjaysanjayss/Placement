import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Upload, User, GraduationCap, Briefcase, Award, FileText, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface StudentProfile {
  id: string;
  userId: string;
  personalInfo: {
    name: string;
    rollNumber: string;
    department: string;
    batch: string;
    email: string;
    phone: string;
    address: string;
  };
  academicInfo: {
    tenthPercentage: number;
    tenthBoard: string;
    tenthYear: number;
    twelfthPercentage: number;
    twelfthBoard: string;
    twelfthYear: number;
    cgpa: number;
    currentSemester: number;
    backlogs: number;
    standingArrears: number;
  };
  skills: {
    technical: string[];
    softSkills: string[];
    languages: string[];
  };
  experience: {
    internships: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
      duration: string;
    }>;
  };
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    type: "academic" | "technical" | "extracurricular";
  }>;
  resumes: Array<{
    id: string;
    name: string;
    url: string;
    uploadDate: string;
    isDefault: boolean;
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  profileVisibility: "public" | "private";
  completenessScore: number;
  createdAt: string;
  updatedAt: string;
}

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<StudentProfile>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/studentProfiles?userId=${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setProfile(data[0]);
          setEditForm(data[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletenessScore = (profileData: Partial<StudentProfile>): number => {
    let score = 0;
    const totalFields = 8;

    if (profileData.personalInfo?.name) score++;
    if (profileData.personalInfo?.rollNumber) score++;
    if (profileData.academicInfo?.cgpa) score++;
    if (profileData.skills?.technical?.length) score++;
    if (profileData.experience?.internships?.length || profileData.experience?.projects?.length) score++;
    if (profileData.resumes?.length) score++;
    if (profileData.socialLinks?.github || profileData.socialLinks?.linkedin) score++;
    if (profileData.achievements?.length) score++;

    return Math.round((score / totalFields) * 100);
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        ...editForm,
        completenessScore: calculateCompletenessScore(editForm),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`http://localhost:3000/studentProfiles/${profile?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });

      if (response.ok) {
        setProfile(updatedProfile as StudentProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      // In a real app, upload to cloud storage
      const newResume = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString(),
        isDefault: false
      };

      const updatedResumes = [...(profile?.resumes || []), newResume];
      const updatedProfile = { ...profile, resumes: updatedResumes };

      const response = await fetch(`http://localhost:3000/studentProfiles/${profile?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });

      if (response.ok) {
        setProfile(updatedProfile);
        toast.success("Resume uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const addSkill = (type: 'technical' | 'softSkills', skill: string) => {
    if (!skill.trim()) return;
    const currentSkills = editForm.skills?.[type] || [];
    setEditForm(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...currentSkills, skill.trim()]
      }
    }));
  };

  const removeSkill = (type: 'technical' | 'softSkills', index: number) => {
    const currentSkills = editForm.skills?.[type] || [];
    setEditForm(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: currentSkills.filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Profile Found</h3>
            <p className="text-gray-600 mb-4">Create your profile to get started</p>
            <Button onClick={() => setIsEditing(true)}>Create Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Completeness Score */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completeness</span>
            <span className="text-sm font-bold">{profile.completenessScore}%</span>
          </div>
          <Progress value={profile.completenessScore} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.personalInfo?.name || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.personalInfo.name}</p>
                  )}
                </div>
                <div>
                  <Label>Roll Number</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.personalInfo?.rollNumber || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, rollNumber: e.target.value }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.personalInfo.rollNumber}</p>
                  )}
                </div>
                <div>
                  <Label>Department</Label>
                  {isEditing ? (
                    <Select
                      value={editForm.personalInfo?.department || ''}
                      onValueChange={(value) => setEditForm(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, department: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="ECE">ECE</SelectItem>
                        <SelectItem value="EEE">EEE</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{profile.personalInfo.department}</p>
                  )}
                </div>
                <div>
                  <Label>Batch</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.personalInfo?.batch || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, batch: e.target.value }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.personalInfo.batch}</p>
                  )}
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{profile.personalInfo.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.personalInfo?.phone || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.personalInfo.phone}</p>
                  )}
                </div>
              </div>
              <div>
                <Label>Address</Label>
                {isEditing ? (
                  <Textarea
                    value={editForm.personalInfo?.address || ''}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, address: e.target.value }
                    }))}
                  />
                ) : (
                  <p className="font-medium">{profile.personalInfo.address}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>10th Percentage</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.academicInfo?.tenthPercentage || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, tenthPercentage: parseFloat(e.target.value) }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.tenthPercentage}%</p>
                  )}
                </div>
                <div>
                  <Label>10th Board</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.academicInfo?.tenthBoard || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, tenthBoard: e.target.value }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.tenthBoard}</p>
                  )}
                </div>
                <div>
                  <Label>12th Percentage</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.academicInfo?.twelfthPercentage || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, twelfthPercentage: parseFloat(e.target.value) }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.twelfthPercentage}%</p>
                  )}
                </div>
                <div>
                  <Label>12th Board</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.academicInfo?.twelfthBoard || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, twelfthBoard: e.target.value }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.twelfthBoard}</p>
                  )}
                </div>
                <div>
                  <Label>CGPA</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.academicInfo?.cgpa || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, cgpa: parseFloat(e.target.value) }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.cgpa}</p>
                  )}
                </div>
                <div>
                  <Label>Current Semester</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.academicInfo?.currentSemester || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, currentSemester: parseInt(e.target.value) }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.currentSemester}</p>
                  )}
                </div>
                <div>
                  <Label>Backlogs</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.academicInfo?.backlogs || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, backlogs: parseInt(e.target.value) }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.backlogs}</p>
                  )}
                </div>
                <div>
                  <Label>Standing Arrears</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.academicInfo?.standingArrears || ''}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        academicInfo: { ...prev.academicInfo, standingArrears: parseInt(e.target.value) }
                      }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.academicInfo.standingArrears}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Technical Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(isEditing ? editForm.skills?.technical : profile.skills.technical)?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('technical', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add technical skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill('technical', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input');
                        if (input) {
                          addSkill('technical', input.value);
                          input.value = '';
                        }
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">Soft Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(isEditing ? editForm.skills?.softSkills : profile.skills.softSkills)?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('softSkills', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add soft skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill('softSkills', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input');
                        if (input) {
                          addSkill('softSkills', input.value);
                          input.value = '';
                        }
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.languages.map((language, index) => (
                    <Badge key={index} variant="outline">{language}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Internships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.experience.internships.map((internship, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{internship.role}</h4>
                      <p className="text-sm text-gray-600">{internship.company}</p>
                      <p className="text-sm text-gray-500">{internship.duration}</p>
                      <p className="mt-2">{internship.description}</p>
                    </div>
                  ))}
                  {profile.experience.internships.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No internships added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.experience.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-gray-500">{project.duration}</p>
                      <p className="mt-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {profile.experience.projects.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No projects added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button asChild disabled={uploadingResume}>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingResume ? "Uploading..." : "Upload Resume"}
                    </span>
                  </Button>
                </label>
              </div>

              <div className="space-y-2">
                {profile.resumes.map((resume) => (
                  <div key={resume.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{resume.name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {resume.isDefault && <Badge variant="default">Default</Badge>}
                      <Button size="sm" variant="outline" asChild>
                        <a href={resume.url} download>Download</a>
                      </Button>
                    </div>
                  </div>
                ))}
                {profile.resumes.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No resumes uploaded yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={achievement.type === 'academic' ? 'default' : 
                                        achievement.type === 'technical' ? 'secondary' : 'outline'}>
                            {achievement.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {profile.achievements.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No achievements added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
