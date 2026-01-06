import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Query json-server for a user with matching email
      const response = await fetch(`http://localhost:3003/users?email=${email}`);
      const users = await response.json();

      const user = users.find((u: any) => u.password === password);

      if (user) {
        // Save user to localStorage for persistence
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Welcome back, " + user.name);
        navigate("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Is the database running?");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
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
            <h1 className="mb-2 font-display text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to access your placement dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@college.edu"
                  className="h-12 pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-secondary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">New here?</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Register Link */}
          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full">
              Create an account
            </Button>
          </Link>
        </div>
      </div>

      {/* Right - Hero Image */}
      <div className="hidden flex-1 bg-gradient-hero lg:block">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="max-w-md">
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground">
              Your Gateway to Dream Career
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              Access comprehensive training programs, track your progress, and register for placement drives from top companies.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary-foreground">5000+</p>
                <p className="text-sm text-primary-foreground/70">Students Placed</p>
              </div>
              <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary-foreground">200+</p>
                <p className="text-sm text-primary-foreground/70">Partner Companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
