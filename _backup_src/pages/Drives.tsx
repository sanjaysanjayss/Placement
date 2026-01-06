import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Users, 
  Clock,
  Search,
  Filter,
  Building2,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";

const Drives = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const drives = [
    {
      id: 1,
      company: "TechCorp Solutions",
      logo: "TC",
      role: "Software Engineer",
      package: "12-18 LPA",
      date: "Jan 15, 2024",
      deadline: "Jan 10, 2024",
      location: "Bangalore",
      type: "On-Campus",
      eligibility: {
        cgpa: 7.0,
        backlogs: 0,
        branches: ["CSE", "IT", "ECE"],
      },
      status: "Open",
      registered: 245,
      description: "Looking for passionate software engineers to join our core product team. Work on cutting-edge technologies and solve real-world problems.",
      requirements: ["Strong in DSA", "Knowledge of any OOP language", "Good communication skills"],
      isEligible: true,
    },
    {
      id: 2,
      company: "DataMinds Analytics",
      logo: "DM",
      role: "Data Analyst",
      package: "8-12 LPA",
      date: "Jan 20, 2024",
      deadline: "Jan 15, 2024",
      location: "Hyderabad",
      type: "Virtual",
      eligibility: {
        cgpa: 6.5,
        backlogs: 1,
        branches: ["CSE", "IT", "Math", "Statistics"],
      },
      status: "Open",
      registered: 180,
      description: "Join our analytics team to work with large datasets and derive meaningful insights for Fortune 500 clients.",
      requirements: ["SQL proficiency", "Python/R knowledge", "Statistical analysis skills"],
      isEligible: true,
    },
    {
      id: 3,
      company: "CloudNine Systems",
      logo: "CN",
      role: "Cloud Engineer",
      package: "15-22 LPA",
      date: "Jan 25, 2024",
      deadline: "Jan 20, 2024",
      location: "Mumbai",
      type: "On-Campus",
      eligibility: {
        cgpa: 7.5,
        backlogs: 0,
        branches: ["CSE", "IT"],
      },
      status: "Coming Soon",
      registered: 0,
      description: "Be part of our cloud infrastructure team managing enterprise-grade solutions on AWS, Azure, and GCP.",
      requirements: ["Cloud certification preferred", "Linux administration", "Networking fundamentals"],
      isEligible: false,
    },
    {
      id: 4,
      company: "FinServe Technologies",
      logo: "FS",
      role: "Full Stack Developer",
      package: "10-15 LPA",
      date: "Jan 28, 2024",
      deadline: "Jan 22, 2024",
      location: "Chennai",
      type: "Hybrid",
      eligibility: {
        cgpa: 6.0,
        backlogs: 2,
        branches: ["CSE", "IT", "ECE", "EEE"],
      },
      status: "Open",
      registered: 320,
      description: "Looking for versatile developers who can work across the entire technology stack for our fintech products.",
      requirements: ["React/Angular experience", "Node.js/Java backend", "Database management"],
      isEligible: true,
    },
    {
      id: 5,
      company: "InnovateTech Labs",
      logo: "IT",
      role: "ML Engineer",
      package: "18-25 LPA",
      date: "Feb 5, 2024",
      deadline: "Jan 30, 2024",
      location: "Pune",
      type: "On-Campus",
      eligibility: {
        cgpa: 8.0,
        backlogs: 0,
        branches: ["CSE", "AI/ML"],
      },
      status: "Coming Soon",
      registered: 0,
      description: "Join our AI research team working on next-generation machine learning solutions.",
      requirements: ["Deep learning frameworks", "Python expertise", "Research publications preferred"],
      isEligible: false,
    },
    {
      id: 6,
      company: "SecureNet Solutions",
      logo: "SN",
      role: "Security Analyst",
      package: "9-14 LPA",
      date: "Feb 10, 2024",
      deadline: "Feb 5, 2024",
      location: "Delhi",
      type: "Virtual",
      eligibility: {
        cgpa: 7.0,
        backlogs: 0,
        branches: ["CSE", "IT"],
      },
      status: "Open",
      registered: 95,
      description: "Protect enterprise systems from cyber threats as part of our security operations team.",
      requirements: ["Cybersecurity knowledge", "Network security", "Ethical hacking skills"],
      isEligible: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-success text-success-foreground";
      case "Coming Soon":
        return "bg-warning text-warning-foreground";
      case "Closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredDrives = drives.filter(
    (drive) =>
      drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-block rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
                Placement Drives
              </span>
              <h1 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                Your Next Opportunity Awaits
              </h1>
              <p className="mb-8 text-lg text-primary-foreground/80">
                Browse upcoming placement drives from top companies and register for the ones that match your profile.
              </p>
              
              {/* Search */}
              <div className="mx-auto flex max-w-lg gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by company or role..."
                    className="h-12 pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="heroOutline" size="lg">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-card py-6">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{drives.filter(d => d.status === "Open").length}</p>
                <p className="text-sm text-muted-foreground">Open Drives</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">{drives.length}</p>
                <p className="text-sm text-muted-foreground">Total Drives</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">{drives.reduce((acc, d) => acc + d.registered, 0)}</p>
                <p className="text-sm text-muted-foreground">Registrations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Drives List */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="space-y-6">
              {filteredDrives.map((drive) => (
                <div
                  key={drive.id}
                  className="group rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      {/* Left - Company Info */}
                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary font-display text-xl font-bold text-primary-foreground">
                          {drive.logo}
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-xl font-semibold">{drive.company}</h3>
                            <Badge className={getStatusColor(drive.status)}>{drive.status}</Badge>
                            <Badge variant="outline">{drive.type}</Badge>
                          </div>
                          <p className="mb-3 text-lg text-muted-foreground">{drive.role}</p>
                          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                            {drive.description}
                          </p>
                          
                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <IndianRupee className="h-4 w-4" />
                              <span className="font-medium text-foreground">{drive.package}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{drive.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{drive.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{drive.registered} registered</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Eligibility & Action */}
                      <div className="flex flex-col gap-4 lg:items-end lg:text-right">
                        {/* Eligibility */}
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Eligibility Criteria
                          </p>
                          <div className="space-y-1 text-sm">
                            <p>CGPA: <span className="font-medium">{drive.eligibility.cgpa}+</span></p>
                            <p>Backlogs: <span className="font-medium">{drive.eligibility.backlogs === 0 ? "None" : `≤ ${drive.eligibility.backlogs}`}</span></p>
                            <p>Branches: <span className="font-medium">{drive.eligibility.branches.join(", ")}</span></p>
                          </div>
                          
                          <div className="mt-3 flex items-center gap-1.5">
                            {drive.isEligible ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-success" />
                                <span className="text-sm font-medium text-success">You're eligible</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-destructive" />
                                <span className="text-sm font-medium text-destructive">Not eligible</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Deadline & Action */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Deadline: {drive.deadline}</span>
                          </div>
                          <Button
                            disabled={!drive.isEligible || drive.status !== "Open"}
                            className="min-w-[140px]"
                          >
                            {drive.status === "Open" ? (
                              <>
                                Register Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            ) : (
                              "Coming Soon"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDrives.length === 0 && (
              <div className="py-16 text-center">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 font-display text-lg font-semibold">No drives found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Drives;
