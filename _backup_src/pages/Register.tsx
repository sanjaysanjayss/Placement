import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  BookOpen
} from "lucide-react";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "student";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const roles = [
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "officer", label: "Placement Officer", icon: Building2 },
    { id: "trainer", label: "Trainer", icon: BookOpen },
  ];

  const departments = [
    "CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AIDS", "BME", "FT", "AGRI"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.endsWith("@srishakthi.ac.in")) {
      toast.error("Please use your college email (@srishakthi.ac.in)");
      return;
    }

    if (!formData.department) {
      toast.error("Please select your department");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to create account");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Is the database running?");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Hero Image */}
      <div className="hidden flex-1 bg-gradient-hero lg:block">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="max-w-md">
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground">
              Campus Connect Pro 2026
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              Join Sri Shakthi Institute of Engineering and Technology's official placement portal.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-primary-foreground">For Students</p>
                  <p className="text-sm text-primary-foreground/70">Track training & register for drives</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-primary-foreground">For Officers</p>
                  <p className="text-sm text-primary-foreground/70">Manage placements efficiently</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-primary-foreground">For Trainers</p>
                  <p className="text-sm text-primary-foreground/70">Deliver & track training programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
              <img src="/pts_logo.png" alt="PTS Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Placement Training System</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 font-display text-3xl font-bold">Create account</h1>
            <p className="text-muted-foreground">
              Get started with your placement journey
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="mb-3 block">I am a</Label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${role === r.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  <r.icon className={`h-6 w-6 ${role === r.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium ${role === r.id ? "text-primary" : "text-muted-foreground"}`}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="h-12 pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@srishakthi.ac.in"
                  className="h-12 pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <select
                  id="department"
                  name="department"
                  className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="h-12 pl-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="h-12 pl-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-secondary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-secondary hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-secondary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

