import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/training", label: "Training" },
    { href: "/drives", label: "Company Drives" },
    { href: "/training-schedule", label: "Schedule" },
    { href: "/company-drives", label: "Drives Portal" },
    { href: "/eligibility-check", label: "Eligibility" },
    { href: "/mock-tests", label: "Tests" },
    { href: "/resume-builder", label: "Resume" },
    { href: "/performance-analytics", label: "Analytics" },
    { href: "/notifications", label: "Notifications" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
            <img src="/pts_logo.png" alt="PTS Logo" className="h-full w-full object-cover" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">Placement Training System</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${isActive(link.href)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {link.label}
            </Link>
          ))}
          {user && user.role === "officer" && (
            <Link
              to="/users"
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${isActive("/users")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              Students
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to={`/users/${user.id}`}>
                {user.avatar ? (
                  <div className="h-9 w-9 rounded-full border-2 border-primary/20 overflow-hidden hover:border-primary transition-colors">
                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{user.name.charAt(0)}</span>
                    </div>
                    <span>Profile</span>
                  </Button>
                )}
              </Link>
              <Button size="sm" onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden hover:bg-muted"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border md:hidden animate-fade-in">
          <nav className="container flex flex-col gap-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded-lg ${isActive(link.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
