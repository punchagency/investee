import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/abstract_modern_architectural_visualization_with_data_streams.png";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Modern Architecture and Data" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-primary/30" />
        </div>

        <div className="container relative z-10 px-4 md:px-8 max-w-screen-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <Zap className="mr-2 h-4 w-4" />
              AI-Powered Commercial Real Estate
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground mb-6">
              The Future of <br/>
              <span className="text-primary relative">
                Deal Sourcing
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Analyze DSCR and Fix & Flip deals instantly. Get funding quotes in seconds with our proprietary AI engine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search">
                <Button size="lg" className="text-lg h-12 px-8 shadow-xl shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90">
                  Find Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8 bg-background/50 backdrop-blur hover:bg-background/80">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-8 max-w-screen-2xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">Institutional-Grade Analysis</h2>
            <p className="text-muted-foreground text-lg">
              Stop using spreadsheets. Our platform unifies search, analysis, and financing into a single workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Nationwide Coverage",
                desc: "Access off-market inventory across 46 states, filtered by your specific investment criteria."
              },
              {
                icon: TrendingUp,
                title: "Instant Analysis",
                desc: "Real-time DSCR and Fix & Flip calculators that adjust dynamically as you tweak assumptions."
              },
              {
                icon: ShieldCheck,
                title: "Guaranteed Funding",
                desc: "Pre-approved quotes generated alongside every property analysis. Close with confidence."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary-foreground mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
