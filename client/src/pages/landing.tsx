import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Globe, Clock } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/luxury_modern_kitchen_with_natural_lighting.png";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Luxury home interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 md:px-8 max-w-screen-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-6">
              Business Purpose<br/>
              Investment Mortgage Lender
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
              Direct lenders who actually understand real estate investing. Fast approvals, transparent rates, and a team that gets it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search">
                <Button size="lg" className="text-lg h-12 px-8 shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white font-semibold">
                  Get Your Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg h-12 px-8 border-2 border-white bg-transparent text-white hover:bg-white/10 font-semibold">
                  Get Preapproved
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-8 max-w-screen-2xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Financing Built for Investors Like You
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Whether you're scaling your rental portfolio, flipping your next deal, or building your investment business, Legacy Biz Capital has the financing solutions you need. We work directly with investors nationwide because we understand the opportunities you're chasing.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              From residential rentals to commercial properties—hotels, retail, self-storage, and more—we offer wholesale rates and funding speed that keeps your deals moving.
            </p>
            <Link href="/search">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/20">
        <div className="container px-4 md:px-8 max-w-screen-2xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">Why Investors Choose Us</h2>
            <p className="text-muted-foreground text-lg">
              We're not just another lender. We're partners who understand your deals and want to see you win.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Close Faster",
                desc: "Get pre-approved and funded in days, not months. We know time is money in real estate."
              },
              {
                icon: Globe,
                title: "All Property Types",
                desc: "Rentals, flips, commercial, hotels, self-storage—we fund the deals other lenders pass on."
              },
              {
                icon: ShieldCheck,
                title: "Wholesale Rates",
                desc: "Direct lender pricing without the broker markup. More cash back in your pocket."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg border border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 md:px-8 max-w-screen-2xl text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">Ready to Fund Your Next Deal?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get a quote in minutes. No surprises, no games—just straightforward financing for serious investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                Get Your Quote
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
