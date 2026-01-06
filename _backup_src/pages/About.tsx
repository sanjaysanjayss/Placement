import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in every aspect of placement training and management.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear and open communication between students, trainers, and placement officers.",
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Every feature is designed keeping student success as our primary goal.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Fostering strong partnerships between academia and industry.",
    },
  ];

  const achievements = [
    { value: "5000+", label: "Students Placed" },
    { value: "200+", label: "Partner Companies" },
    { value: "95%", label: "Placement Rate" },
    { value: "15 LPA", label: "Avg. Package" },
  ];

  const benefits = [
    "Centralized platform for all placement activities",
    "Automated eligibility checking and filtering",
    "Real-time notifications and updates",
    "Comprehensive training program management",
    "Detailed analytics and reporting",
    "Resume building and management tools",
    "Mock interview scheduling",
    "Performance tracking and feedback",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-block rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
                About Us
              </span>
              <h1 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                Sri Shakthi Institute of Engineering and Technology
              </h1>
              <p className="text-lg text-primary-foreground/80">
                L & T By Pass, Sri Shakthi Nagar, Coimbatore, Tamil Nadu 641062
              </p>
              <p className="mt-4 text-primary-foreground/70">
                Our customized Placement Training System is designed to bridge the gap between academic learning and industry requirements, ensuring every student achieves their career goals.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
                  Our Mission
                </span>
                <h2 className="mb-6 font-display text-3xl font-bold sm:text-4xl">
                  Empowering Students for Career Success
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Our mission is to create a seamless, efficient, and transparent placement ecosystem that empowers students to achieve their dream careers while simplifying the complex placement process for educational institutions.
                </p>
                <p className="mb-8 text-muted-foreground">
                  We believe that every student deserves access to quality training, timely information about opportunities, and the tools to showcase their abilities to potential employers.
                </p>
                <Link to="/register">
                  <Button size="lg">
                    Join Our Platform
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {achievements.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border bg-card p-6 text-center shadow-card"
                  >
                    <p className="mb-1 font-display text-3xl font-bold text-secondary">
                      {item.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                Our Values
              </span>
              <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
                What Drives Us Forward
              </h2>
              <p className="text-muted-foreground">
                Our core values guide every decision we make and every feature we build.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 font-display font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <div className="grid gap-3 sm:grid-cols-2">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="mb-4 inline-block rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
                  Why Choose Us
                </span>
                <h2 className="mb-6 font-display text-3xl font-bold sm:text-4xl">
                  A Complete Placement Solution
                </h2>
                <p className="mb-6 text-muted-foreground">
                  This Unified Placement Training System replaces fragmented tools with a single platform that handles everything from student registration to final placement reports.
                </p>
                <p className="text-muted-foreground">
                  Our system is designed with input from placement officers, trainers, and students to ensure it meets the real needs of all stakeholders in the placement process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to Transform Your Placement Process?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80">
                Join the hundreds of students who have launched their careers through Sri Shakthi's placement system.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/register">
                  <Button variant="hero" size="xl">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="heroOutline" size="xl">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
