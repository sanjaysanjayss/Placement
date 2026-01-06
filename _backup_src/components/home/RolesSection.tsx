import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, BookOpen, ArrowRight } from "lucide-react";

const RolesSection = () => {
  const roles = [
    {
      icon: GraduationCap,
      title: "For Students",
      description: "Access training materials, track your progress, register for drives, and manage your placement journey all in one place.",
      features: [
        "Profile management with skills & resume",
        "View and register for company drives",
        "Track training attendance & performance",
        "Real-time eligibility updates",
      ],
      link: "/register?role=student",
      linkText: "Register as Student",
      gradient: "from-info to-secondary",
    },
    {
      icon: Briefcase,
      title: "For Placement Officers",
      description: "Efficiently manage placement activities, create training programs, and generate comprehensive reports.",
      features: [
        "Manage student database",
        "Schedule and monitor training",
        "Post company drive details",
        "Generate placement statistics",
      ],
      link: "/register?role=officer",
      linkText: "Officer Portal",
      gradient: "from-primary to-secondary",
    },
    {
      icon: BookOpen,
      title: "For Trainers",
      description: "Upload training materials, track attendance, evaluate students, and provide valuable feedback.",
      features: [
        "Upload training materials",
        "Mark student attendance",
        "Evaluate performance",
        "Provide feedback & grades",
      ],
      link: "/register?role=trainer",
      linkText: "Trainer Portal",
      gradient: "from-accent to-warning",
    },
  ];

  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            User Roles
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
            Designed for Every Stakeholder
          </h2>
          <p className="text-muted-foreground">
            Tailored experiences for students, placement officers, and trainers with role-specific features and dashboards.
          </p>
        </div>

        {/* Roles Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {roles.map((role, index) => (
            <div
              key={role.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-xl"
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${role.gradient} p-6 text-primary-foreground`}>
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
                  <role.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold">{role.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="mb-6 text-muted-foreground">{role.description}</p>
                
                <ul className="mb-6 space-y-3">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={role.link}>
                  <Button className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                    {role.linkText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
