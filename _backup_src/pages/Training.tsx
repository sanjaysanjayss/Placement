import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Code, 
  Users, 
  Brain, 
  Clock, 
  Calendar,
  Play,
  CheckCircle
} from "lucide-react";

const Training = () => {
  const categories = [
    { id: "all", label: "All Programs", count: 12 },
    { id: "aptitude", label: "Aptitude", count: 4 },
    { id: "technical", label: "Technical", count: 5 },
    { id: "soft-skills", label: "Soft Skills", count: 3 },
  ];

  const programs = [
    {
      id: 1,
      title: "Quantitative Aptitude Mastery",
      category: "Aptitude",
      icon: Brain,
      instructor: "Prof. Sharma",
      duration: "6 weeks",
      sessions: 24,
      enrolled: 450,
      progress: 65,
      status: "In Progress",
      description: "Master numerical reasoning, data interpretation, and problem-solving skills essential for placement tests.",
      topics: ["Number Systems", "Percentages", "Probability", "Data Interpretation"],
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      category: "Technical",
      icon: Code,
      instructor: "Dr. Kumar",
      duration: "8 weeks",
      sessions: 32,
      enrolled: 380,
      progress: 40,
      status: "In Progress",
      description: "Comprehensive DSA training covering arrays, trees, graphs, and dynamic programming.",
      topics: ["Arrays & Strings", "Trees & Graphs", "Dynamic Programming", "System Design"],
    },
    {
      id: 3,
      title: "Interview Communication Skills",
      category: "Soft Skills",
      icon: Users,
      instructor: "Ms. Priya",
      duration: "4 weeks",
      sessions: 16,
      enrolled: 520,
      progress: 0,
      status: "Upcoming",
      description: "Build confidence and learn effective communication strategies for HR and technical interviews.",
      topics: ["Body Language", "Storytelling", "Handling Stress", "Mock Interviews"],
    },
    {
      id: 4,
      title: "Logical Reasoning Excellence",
      category: "Aptitude",
      icon: Brain,
      instructor: "Prof. Verma",
      duration: "5 weeks",
      sessions: 20,
      enrolled: 400,
      progress: 100,
      status: "Completed",
      description: "Develop critical thinking and logical reasoning abilities for competitive exams.",
      topics: ["Puzzles", "Seating Arrangement", "Blood Relations", "Coding-Decoding"],
    },
    {
      id: 5,
      title: "Full Stack Web Development",
      category: "Technical",
      icon: Code,
      instructor: "Mr. Rajesh",
      duration: "10 weeks",
      sessions: 40,
      enrolled: 280,
      progress: 25,
      status: "In Progress",
      description: "Learn modern web technologies including React, Node.js, and database management.",
      topics: ["HTML/CSS/JS", "React.js", "Node.js", "MongoDB"],
    },
    {
      id: 6,
      title: "Group Discussion Techniques",
      category: "Soft Skills",
      icon: Users,
      instructor: "Dr. Anita",
      duration: "3 weeks",
      sessions: 12,
      enrolled: 350,
      progress: 0,
      status: "Upcoming",
      description: "Master the art of group discussions with practical sessions and feedback.",
      topics: ["Topic Analysis", "Point Initiation", "Summarization", "Leadership"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-info text-info-foreground";
      case "Completed":
        return "bg-success text-success-foreground";
      case "Upcoming":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-block rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
                Training Programs
              </span>
              <h1 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                Prepare for Success
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Comprehensive training programs designed to enhance your aptitude, technical skills, and soft skills for placement success.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border bg-card py-4">
          <div className="container">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={cat.id === "all" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {cat.label}
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-xs">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="group rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 overflow-hidden"
                >
                  {/* Header */}
                  <div className="border-b border-border bg-muted/30 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <program.icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline">{program.category}</Badge>
                      </div>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="mb-2 font-display text-lg font-semibold">{program.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {program.description}
                    </p>

                    {/* Meta */}
                    <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{program.sessions} sessions</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{program.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{program.enrolled} enrolled</span>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {program.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                      {program.topics.length > 3 && (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                          +{program.topics.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    {program.status !== "Upcoming" && (
                      <div className="mb-4">
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    )}

                    {/* Action */}
                    <Button className="w-full" variant={program.status === "Upcoming" ? "outline" : "default"}>
                      {program.status === "Completed" ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          View Certificate
                        </>
                      ) : program.status === "Upcoming" ? (
                        "Enroll Now"
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Continue Learning
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Training;
