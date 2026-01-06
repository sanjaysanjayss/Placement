import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 sm:p-12 lg:p-16">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Start Your Career Journey Today</span>
            </div>

            <h2 className="mb-6 font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
              Ready to Land Your Dream Job?
            </h2>

            <p className="mb-10 text-lg text-primary-foreground/80">
              Join thousands of students who have successfully secured placements through our platform. Register now and take the first step towards your career.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="heroOutline" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
