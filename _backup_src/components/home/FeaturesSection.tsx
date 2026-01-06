import { 
  UserCircle, 
  Calendar, 
  Building2, 
  CheckCircle, 
  BarChart3, 
  Bell,
  FileText,
  Users
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: UserCircle,
      title: "Student Profiles",
      description: "Comprehensive profiles with academic details, skills, and resume management.",
      color: "bg-info/10 text-info",
    },
    {
      icon: Calendar,
      title: "Training Schedule",
      description: "Aptitude, technical, and soft skills training programs with attendance tracking.",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Building2,
      title: "Company Drives",
      description: "View and register for upcoming placement drives from top companies.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: CheckCircle,
      title: "Eligibility Check",
      description: "Automatic eligibility verification based on CGPA, backlogs, and other criteria.",
      color: "bg-success/10 text-success",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and performance insights.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications for drives, results, and announcements.",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description: "Create and manage professional resumes with our built-in resume builder.",
      color: "bg-destructive/10 text-destructive",
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Dedicated portals for students, trainers, and placement officers.",
      color: "bg-muted-foreground/10 text-muted-foreground",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            Features
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
            Everything You Need for Placement Success
          </h2>
          <p className="text-muted-foreground">
            A comprehensive platform designed to streamline the entire placement process from training to final selection.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} transition-transform group-hover:scale-110`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
