import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  Globe,
  Linkedin,
  Calendar,
  User,
  Briefcase,
  GraduationCap,
  Headphones,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: "student" | "recruiter" | "parent" | "trainer" | "other";
  subject: "placement_query" | "training_program" | "company_drive" | "technical_support" | "general_inquiry";
  message: string;
  status: "open" | "replied" | "closed";
  ticketId: string;
  createdAt: string;
  repliedAt?: string;
  reply?: string;
}

interface DepartmentContact {
  role: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
}

const instituteInfo = {
  name: "Sri Shakthi Institute of Engineering and Technology",
  placementCellName: "Placement & Training Cell",
  address: "Sri Shakthi Institute of Engineering and Technology, Salem - 636 004, Tamil Nadu, India",
  workingHours: "Mon–Fri: 9:00 AM – 5:00 PM",
  email: "placement@srisakthi.ac.in",
  phone: "+91 90420 20357",
  whatsapp: "+91 90420 20357",
  website: "https://www.srisakthi.ac.in",
  linkedin: "https://linkedin.com/company/sri-shakthi-institute-of-engineering-and-technology",
  careerPage: "https://www.srisakthi.ac.in/careers"
};

const departmentContacts: DepartmentContact[] = [
  {
    role: "Placement Officer",
    name: "Mr. XYZ",
    email: "placement@srisakthi.ac.in",
    phone: "+91 90420 20357",
    department: "Placement Cell"
  },
  {
    role: "Training Coordinator", 
    name: "Ms. ABC",
    email: "training@srisakthi.ac.in",
    phone: "+91 90420 20358",
    department: "Training"
  },
  {
    role: "Technical Support",
    name: "IT Team",
    email: "support@srisakthi.ac.in",
    phone: "+91 90420 20359",
    department: "IT Support"
  },
  {
    role: "Student Coordinator",
    name: "Student Representative",
    email: "student@srisakthi.ac.in",
    department: "Student Affairs"
  }
];

const faqs = [
  {
    question: "How to register for placement drives?",
    answer: "You can register for placement drives by visiting the Company Drives section, checking your eligibility, and clicking on Register Now for eligible positions."
  },
  {
    question: "Why am I not eligible for certain drives?",
    answer: "Eligibility depends on CGPA, backlogs, department, and batch requirements. Check the eligibility criteria section for each drive to see specific requirements."
  },
  {
    question: "How to update my resume?",
    answer: "Go to the Resume Builder section to create, edit, or update your resume. You can upload multiple versions and set a default resume."
  },
  {
    question: "Whom to contact for training issues?",
    answer: "For training-related queries, contact the Training Coordinator at training@srisakthi.ac.in or call +91 90420 20358."
  }
];

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState<ContactQuery | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<typeof faqs[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.userType) {
      newErrors.userType = "Please select your user type";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const query: ContactQuery = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        userType: formData.userType as any,
        subject: formData.subject as any,
        message: formData.message,
        status: "open",
        ticketId: `TKT-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString()
      };

      // Store in database
      const response = await fetch('http://localhost:3003/contactQueries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });

      if (response.ok) {
        setSubmittedQuery(query);
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          userType: "",
          subject: "",
          message: ""
        });
        setErrors({});

        // Simulate sending emails
        setTimeout(() => {
          toast.success("Confirmation email sent to your inbox");
        }, 1000);

        setTimeout(() => {
          toast.success("Notification sent to placement team");
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to submit query. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "placement_query": return <Briefcase className="h-4 w-4" />;
      case "training_program": return <GraduationCap className="h-4 w-4" />;
      case "company_drive": return <Building2 className="h-4 w-4" />;
      case "technical_support": return <Headphones className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "student": return <GraduationCap className="h-4 w-4" />;
      case "recruiter": return <Briefcase className="h-4 w-4" />;
      case "parent": return <Users className="h-4 w-4" />;
      case "trainer": return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get in touch with the Placement & Training Cell. We're here to help you with all your placement and training needs.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && submittedQuery && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-semibold mb-1">Query Submitted Successfully!</div>
            <div>Your ticket ID: <span className="font-mono bg-green-100 px-2 py-1 rounded">{submittedQuery.ticketId}</span></div>
            <div className="text-sm mt-1">We'll get back to you within 24 hours. A confirmation email has been sent to {submittedQuery.email}.</div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Institute Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Institute Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{instituteInfo.name}</h4>
                <p className="text-gray-600">{instituteInfo.placementCellName}</p>
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <p className="text-sm text-gray-600 mt-1">{instituteInfo.address}</p>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Working Hours
                </Label>
                <p className="text-sm text-gray-600 mt-1">{instituteInfo.workingHours}</p>
              </div>
            </CardContent>
          </Card>

          {/* Communication Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium">{instituteInfo.email}</p>
                  <p className="text-sm text-gray-600">Email us</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">{instituteInfo.phone}</p>
                  <p className="text-sm text-gray-600">Call us</p>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp Chat
              </Button>
            </CardContent>
          </Card>

          {/* Department Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Department Contacts</CardTitle>
              <CardDescription>Reach out to the right department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departmentContacts.map((contact, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{contact.role}</p>
                        <p className="text-sm text-gray-600">{contact.name}</p>
                        <p className="text-xs text-blue-600">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-xs text-gray-500">{contact.phone}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {contact.department}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={instituteInfo.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  College Website
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={instituteInfo.careerPage} target="_blank" rel="noopener noreferrer">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Career Page
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={instituteInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="userType">User Type *</Label>
                    <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                      <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="recruiter">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Recruiter
                          </div>
                        </SelectItem>
                        <SelectItem value="parent">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Parent
                          </div>
                        </SelectItem>
                        <SelectItem value="trainer">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Trainer
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Other
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.userType && (
                      <p className="text-sm text-red-500 mt-1">{errors.userType}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placement_query">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Placement Query
                          </div>
                        </SelectItem>
                        <SelectItem value="training_program">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Training Program
                          </div>
                        </SelectItem>
                        <SelectItem value="company_drive">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Company Drive
                          </div>
                        </SelectItem>
                        <SelectItem value="technical_support">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-4 w-4" />
                            Technical Support
                          </div>
                        </SelectItem>
                        <SelectItem value="general_inquiry">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            General Inquiry
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us more about your query..."
                      rows={5}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>All fields marked with * are required</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Query
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Us
              </CardTitle>
              <CardDescription>
                Visit our campus or get directions to our location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">Sri Shakthi Institute of Engineering and Technology</p>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start cursor-pointer" onClick={() => setSelectedFAQ(selectedFAQ?.question === faq.question ? null : faq)}>
                      <h4 className="font-medium text-sm">{faq.question}</h4>
                      <div className="text-blue-500">
                        {selectedFAQ?.question === faq.question ? "−" : "+"}
                      </div>
                    </div>
                    {selectedFAQ?.question === faq.question && (
                      <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Didn't find your answer?</strong> Use the contact form above or reach out to our team directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Mail className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">Get responses within 24 hours</p>
            <p className="text-sm font-medium mt-1">{instituteInfo.email}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Phone className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600">Mon-Fri, 9AM-5PM</p>
            <p className="text-sm font-medium mt-1">{instituteInfo.phone}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <MapPin className="h-12 w-12 mx-auto text-purple-500 mb-4" />
            <h3 className="font-semibold mb-2">Visit Us</h3>
            <p className="text-sm text-gray-600">Placement Cell Office</p>
            <p className="text-sm font-medium mt-1">Main Campus, Salem</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
