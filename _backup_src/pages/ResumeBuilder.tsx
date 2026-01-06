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
import { FileText, Download, Eye, Edit, Plus, Trash2, Copy, Save, Star, CheckCircle, AlertTriangle, Wand2, History, Target } from "lucide-react";
import { toast } from "sonner";

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: "professional" | "creative" | "modern" | "minimal";
  preview: string;
  isATSFriendly: boolean;
  sections: string[];
  popularity: number;
}

interface ResumeData {
  id: string;
  userId: string;
  name: string;
  templateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    cgpa?: string;
    achievements?: string[];
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    duration: string;
    link?: string;
  }>;
  skills: {
    technical: string[];
    softSkills: string[];
    languages: string[];
  };
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  atsScore: number;
  keywordOptimization: {
    optimized: boolean;
    suggestions: string[];
    missingKeywords: string[];
  };
  version: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ResumeVersion {
  id: string;
  resumeId: string;
  version: number;
  name: string;
  data: ResumeData;
  createdAt: string;
  changeLog: string;
}

export default function ResumeBuilder() {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ResumeData>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSection, setSelectedSection] = useState("personal");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, resumesRes, versionsRes] = await Promise.all([
        fetch('http://localhost:3000/resumeTemplates'),
        fetch('http://localhost:3000/resumes?userId=current_user'),
        fetch('http://localhost:3000/resumeVersions')
      ]);

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData);
      }

      if (resumesRes.ok) {
        const resumesData = await resumesRes.json();
        setResumes(resumesData);
      }

      if (versionsRes.ok) {
        const versionsData = await versionsRes.json();
        setVersions(versionsData);
      }
    } catch (error) {
      toast.error("Failed to fetch resume data");
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      const newResume: ResumeData = {
        id: Date.now().toString(),
        userId: 'current_user',
        name: `Resume - ${new Date().toLocaleDateString()}`,
        templateId,
        personalInfo: {
          name: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          portfolio: ''
        },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: {
          technical: [],
          softSkills: [],
          languages: []
        },
        certifications: [],
        achievements: [],
        atsScore: 0,
        keywordOptimization: {
          optimized: false,
          suggestions: [],
          missingKeywords: []
        },
        version: 1,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3000/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResume)
      });

      if (response.ok) {
        setResumes(prev => [...prev, newResume]);
        setCurrentResume(newResume);
        setEditData(newResume);
        setIsEditing(true);
        setIsCreating(false);
        toast.success("Resume created successfully");
      }
    } catch (error) {
      toast.error("Failed to create resume");
    }
  };

  const saveResume = async () => {
    try {
      if (!currentResume) return;

      const updatedResume = {
        ...editData,
        updatedAt: new Date().toISOString(),
        atsScore: calculateATSScore(editData as ResumeData),
        keywordOptimization: optimizeKeywords(editData as ResumeData)
      };

      const response = await fetch(`http://localhost:3000/resumes/${currentResume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedResume)
      });

      if (response.ok) {
        setResumes(prev => prev.map(r => r.id === currentResume.id ? updatedResume as ResumeData : r));
        setCurrentResume(updatedResume as ResumeData);
        setIsEditing(false);
        toast.success("Resume saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save resume");
    }
  };

  const calculateATSScore = (resume: ResumeData): number => {
    let score = 0;
    const maxScore = 100;

    // Personal info completeness
    if (resume.personalInfo.name) score += 10;
    if (resume.personalInfo.email) score += 10;
    if (resume.personalInfo.phone) score += 10;
    if (resume.personalInfo.location) score += 5;

    // Summary
    if (resume.summary && resume.summary.length > 50) score += 15;

    // Education
    if (resume.education.length > 0) score += 15;

    // Experience
    if (resume.experience.length > 0) score += 15;

    // Skills
    if (resume.skills.technical.length > 0) score += 10;
    if (resume.skills.softSkills.length > 0) score += 5;

    // Projects
    if (resume.projects.length > 0) score += 5;

    return Math.min(score, maxScore);
  };

  const optimizeKeywords = (resume: ResumeData) => {
    const commonKeywords = [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'project management', 'analytical', 'critical thinking', 'collaboration',
      'javascript', 'python', 'react', 'node.js', 'sql', 'aws', 'docker'
    ];

    const resumeText = [
      resume.summary,
      ...resume.experience.map(e => e.description),
      ...resume.projects.map(p => p.description),
      ...resume.skills.technical,
      ...resume.skills.softSkills
    ].join(' ').toLowerCase();

    const missingKeywords = commonKeywords.filter(keyword => !resumeText.includes(keyword));
    const suggestions = missingKeywords.slice(0, 5);

    return {
      optimized: missingKeywords.length < 3,
      suggestions,
      missingKeywords
    };
  };

  const downloadResume = async (format: 'pdf' | 'docx') => {
    try {
      toast.success(`Downloading resume as ${format.toUpperCase()}...`);
      // In a real app, generate and download PDF/DOCX
    } catch (error) {
      toast.error("Failed to download resume");
    }
  };

  const duplicateResume = async (resumeId: string) => {
    try {
      const resume = resumes.find(r => r.id === resumeId);
      if (!resume) return;

      const duplicatedResume = {
        ...resume,
        id: Date.now().toString(),
        name: `${resume.name} (Copy)`,
        version: 1,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3000/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedResume)
      });

      if (response.ok) {
        setResumes(prev => [...prev, duplicatedResume]);
        toast.success("Resume duplicated successfully");
      }
    } catch (error) {
      toast.error("Failed to duplicate resume");
    }
  };

  const addSection = (section: string, item: any) => {
    switch (section) {
      case 'education':
        setEditData(prev => ({
          ...prev,
          education: [...(prev.education || []), item]
        }));
        break;
      case 'experience':
        setEditData(prev => ({
          ...prev,
          experience: [...(prev.experience || []), item]
        }));
        break;
      case 'projects':
        setEditData(prev => ({
          ...prev,
          projects: [...(prev.projects || []), item]
        }));
        break;
      case 'certifications':
        setEditData(prev => ({
          ...prev,
          certifications: [...(prev.certifications || []), item]
        }));
        break;
      case 'achievements':
        setEditData(prev => ({
          ...prev,
          achievements: [...(prev.achievements || []), item]
        }));
        break;
    }
  };

  const removeSection = (section: string, index: number) => {
    switch (section) {
      case 'education':
        setEditData(prev => ({
          ...prev,
          education: prev.education?.filter((_, i) => i !== index) || []
        }));
        break;
      case 'experience':
        setEditData(prev => ({
          ...prev,
          experience: prev.experience?.filter((_, i) => i !== index) || []
        }));
        break;
      case 'projects':
        setEditData(prev => ({
          ...prev,
          projects: prev.projects?.filter((_, i) => i !== index) || []
        }));
        break;
      case 'certifications':
        setEditData(prev => ({
          ...prev,
          certifications: prev.certifications?.filter((_, i) => i !== index) || []
        }));
        break;
      case 'achievements':
        setEditData(prev => ({
          ...prev,
          achievements: prev.achievements?.filter((_, i) => i !== index) || []
        }));
        break;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Resume
        </Button>
      </div>

      <Tabs defaultValue="my-resumes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-resumes">My Resumes</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ats-optimizer">ATS Optimizer</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="my-resumes">
          <div className="grid gap-4">
            {resumes.map(resume => (
              <Card key={resume.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{resume.name}</h3>
                        {resume.isDefault && <Badge className="bg-blue-100 text-blue-800">Default</Badge>}
                        <Badge variant={resume.atsScore >= 80 ? "default" : resume.atsScore >= 60 ? "secondary" : "destructive"}>
                          ATS Score: {resume.atsScore}%
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Template: {templates.find(t => t.id === resume.templateId)?.name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Version {resume.version}</span>
                        <span>•</span>
                        <span>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadResume('pdf')}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadResume('docx')}>
                        <Download className="h-4 w-4 mr-1" />
                        DOCX
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => duplicateResume(resume.id)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button size="sm" onClick={() => {
                        setCurrentResume(resume);
                        setEditData(resume);
                        setIsEditing(true);
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-600">Education</Label>
                      <p className="font-medium">{resume.education.length} items</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Experience</Label>
                      <p className="font-medium">{resume.experience.length} items</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Projects</Label>
                      <p className="font-medium">{resume.projects.length} items</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Skills</Label>
                      <p className="font-medium">{resume.skills.technical.length + resume.skills.softSkills.length} skills</p>
                    </div>
                  </div>

                  {resume.keywordOptimization && !resume.keywordOptimization.optimized && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">ATS Optimization Needed</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Missing keywords: {resume.keywordOptimization.missingKeywords.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {resumes.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Resumes Created</h3>
                  <p className="text-gray-600 mb-4">Create your first professional resume</p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    {template.isATSFriendly && (
                      <Badge className="bg-green-100 text-green-800">ATS Friendly</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{template.popularity}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => createResume(template.id)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ats-optimizer">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  ATS Optimization
                </CardTitle>
                <CardDescription>Improve your resume's ATS compatibility and keyword optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resumes.map(resume => (
                    <div key={resume.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">{resume.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">ATS Score:</span>
                          <Badge variant={resume.atsScore >= 80 ? "default" : resume.atsScore >= 60 ? "secondary" : "destructive"}>
                            {resume.atsScore}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={resume.atsScore} className="h-2 mb-3" />
                      
                      {resume.keywordOptimization && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {resume.keywordOptimization.optimized ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-sm font-medium">
                              {resume.keywordOptimization.optimized ? 'Well Optimized' : 'Needs Optimization'}
                            </span>
                          </div>
                          
                          {!resume.keywordOptimization.optimized && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Suggested keywords to add:</p>
                              <div className="flex flex-wrap gap-1">
                                {resume.keywordOptimization.suggestions.map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{keyword}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="versions">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Version History
                </CardTitle>
                <CardDescription>Track changes and restore previous versions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <History className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Version History</h3>
                  <p className="text-gray-600">Resume version history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Selection Modal */}
      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose a Template</DialogTitle>
              <DialogDescription>Select a template to start building your resume</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h4 className="font-semibold mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{template.category}</Badge>
                      {template.isATSFriendly && (
                        <Badge className="bg-green-100 text-green-800 text-xs">ATS</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Resume Editor Modal */}
      {isEditing && currentResume && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Resume</DialogTitle>
              <DialogDescription>Customize your resume content</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2 border-b">
                {['personal', 'summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements'].map(section => (
                  <Button
                    key={section}
                    variant={selectedSection === section ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedSection(section)}
                    className="capitalize"
                  >
                    {section}
                  </Button>
                ))}
              </div>

              {selectedSection === 'personal' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={editData.personalInfo?.name || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editData.personalInfo?.email || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editData.personalInfo?.phone || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={editData.personalInfo?.location || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              {selectedSection === 'summary' && (
                <div>
                  <Label>Professional Summary</Label>
                  <Textarea
                    value={editData.summary || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, summary: e.target.value }))}
                    rows={4}
                    placeholder="Write a compelling summary of your professional background..."
                  />
                </div>
              )}

              {selectedSection === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <Label>Technical Skills</Label>
                    <Textarea
                      value={editData.skills?.technical?.join(', ') || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        skills: { ...prev.skills, technical: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                      }))}
                      placeholder="e.g., JavaScript, Python, React, Node.js"
                    />
                  </div>
                  <div>
                    <Label>Soft Skills</Label>
                    <Textarea
                      value={editData.skills?.softSkills?.join(', ') || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        skills: { ...prev.skills, softSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                      }))}
                      placeholder="e.g., Leadership, Communication, Teamwork"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={saveResume}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Resume
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
