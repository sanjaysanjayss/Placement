import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Briefcase, ArrowRight, IndianRupee } from "lucide-react";

const UpcomingDrives = () => {
  const drives = [
    {
      id: 1,
      company: "TechCorp Solutions",
      logo: "TC",
      role: "Software Engineer",
      package: "12-18 LPA",
      date: "Jan 15, 2024",
      location: "Bangalore",
      eligibility: "CGPA ≥ 7.0",
      status: "Open",
      type: "On-Campus",
    },
    {
      id: 2,
      company: "DataMinds Analytics",
      logo: "DM",
      role: "Data Analyst",
      package: "8-12 LPA",
      date: "Jan 20, 2024",
      location: "Hyderabad",
      eligibility: "CGPA ≥ 6.5",
      status: "Open",
      type: "Virtual",
    },
    {
      id: 3,
      company: "CloudNine Systems",
      logo: "CN",
      role: "Cloud Engineer",
      package: "15-22 LPA",
      date: "Jan 25, 2024",
      location: "Mumbai",
      eligibility: "CGPA ≥ 7.5",
      status: "Coming Soon",
      type: "On-Campus",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="mb-2 inline-block rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
              Opportunities
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Upcoming Placement Drives</h2>
          </div>
          <Link to="/drives">
            <Button variant="outline">
              View All Drives
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Drives Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drives.map((drive) => (
            <div
              key={drive.id}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary font-display font-bold text-primary-foreground">
                    {drive.logo}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">{drive.company}</h3>
                    <p className="text-sm text-muted-foreground">{drive.role}</p>
                  </div>
                </div>
                <Badge
                  variant={drive.status === "Open" ? "default" : "secondary"}
                  className={drive.status === "Open" ? "bg-success text-success-foreground" : ""}
                >
                  {drive.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IndianRupee className="h-4 w-4" />
                  <span>{drive.package}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{drive.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{drive.location}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {drive.type}
                  </Badge>
                </div>
              </div>

              {/* Eligibility */}
              <div className="mb-4 rounded-lg bg-muted/50 px-3 py-2">
                <p className="text-xs text-muted-foreground">Eligibility</p>
                <p className="text-sm font-medium">{drive.eligibility}</p>
              </div>

              {/* Action */}
              <Link to={`/drives/${drive.id}`}>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingDrives;
