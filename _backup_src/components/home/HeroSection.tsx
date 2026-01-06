import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Building2, Trophy } from "lucide-react";
import { toast } from "sonner";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const quickLogin = async () => {
    try {
      const response = await fetch('http://localhost:3003/users?email=san9042jay@gmail.com');
      const users = await response.json();
      const user = users[0];
      
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Quick login successful! Welcome " + user.name);
        navigate("/company-drives");
      }
    } catch (error) {
      toast.error("Quick login failed");
    }
  };
  const stats = [
    { icon: Users, value: "5000+", label: "Students Placed" },
    { icon: Building2, value: "200+", label: "Partner Companies" },
    { icon: BookOpen, value: "50+", label: "Training Programs" },
    { icon: Trophy, value: "95%", label: "Success Rate" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>Placement Season 2026 is Live</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl animate-slide-up">
            Your Gateway to{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                Dream Career
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-primary-foreground/80 sm:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Comprehensive placement training and management system designed to bridge the gap between academic learning and industry requirements.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button onClick={quickLogin} variant="hero" size="xl">
              Quick Login & Test Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/drives">
              <Button variant="heroOutline" size="xl">
                View Upcoming Drives
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="heroOutline" size="xl">
                Register Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 max-w-4xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 text-center backdrop-blur-sm transition-all hover:bg-primary-foreground/10"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-accent transition-transform group-hover:scale-110" />
                <p className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
