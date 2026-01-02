import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Key, Wallet, Wrench, MapPin } from "lucide-react";
import { motion } from "framer-motion";

// Property card images - using placeholder URLs that work
const propertyImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
];

const heroPropertyImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80";

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                The #1 Network for Real Estate Pros
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6 leading-[1.15]">
                The All-in-One Ecosystem for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  Real Estate Transformation
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Connect, Fund, Fix, and Flip. Join the network bridging investors, owners, and service providers to streamline your next project from acquisition to exit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calculator">
                  <Button size="lg" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02]">
                    Find Investment
                  </Button>
                </Link>
                <Link href="/property-search">
                  <Button size="lg" variant="outline" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-base font-bold text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all">
                    List Property
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br from-purple-400 to-purple-600"></div>
                </div>
                <p>Trusted by 2,000+ professionals</p>
              </div>
            </motion.div>

            {/* Hero Property Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:ml-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="absolute -top-12 -right-12 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl opacity-50 pointer-events-none"></div>
              <div className="relative rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
                <div
                  className="aspect-[4/3] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${heroPropertyImage}")` }}
                ></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900">124 Maple Avenue Renovation</h3>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active Project
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Target ROI</p>
                      <p className="font-bold text-primary text-lg">18.5%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Funding</p>
                      <p className="font-bold text-slate-900 text-lg">85%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Timeline</p>
                      <p className="font-bold text-slate-900 text-lg">4 Mo</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-[240px] hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Funding Secured</p>
                    <p className="font-bold text-slate-900">$450,000</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="border-y border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Powering the next generation of real estate
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-xl text-slate-700">ChaseFlip</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-xl text-slate-700">RealtyPro</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-xl text-slate-700">BuildRight</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-xl text-slate-700">FundFlow</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (Roles) */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Tailored for Every Stakeholder
            </h2>
            <p className="text-lg text-slate-600">
              Our platform connects the entire ecosystem to ensure efficiency, transparency, and trust for every role in the deal.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "For Investors",
                desc: "Access vetted inventory and transparent ROI projections for smarter investing.",
                link: "Start Investing",
                color: "blue",
              },
              {
                icon: Key,
                title: "For Owners",
                desc: "Unlock liquidity quickly and find trusted contractors to renovate your property.",
                link: "List Your Property",
                color: "purple",
              },
              {
                icon: Wallet,
                title: "For Lenders",
                desc: "Secure lending opportunities with verified assets and transparent data.",
                link: "Find Opportunities",
                color: "emerald",
              },
              {
                icon: Wrench,
                title: "For Contractors",
                desc: "Enjoy consistent workflow and guaranteed payments for your services.",
                link: "Join Network",
                color: "orange",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl bg-${card.color}-100 text-${card.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{card.desc}</p>
                <Link href="/calculator" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80">
                  {card.link} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Opportunities Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Active Opportunities</h2>
              <p className="text-slate-600 mt-2">Recently listed properties ready for funding or renovation.</p>
            </div>
            <Link href="/property-search">
              <Button variant="outline" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                View All Listings
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: propertyImages[0],
                badge: "Flip Ready",
                price: "$420k",
                title: "Modern Bungalow Fixer",
                location: "Austin, TX",
                profit: "$65,000",
                renovation: "$45k",
              },
              {
                image: propertyImages[1],
                badge: "Funding Open",
                price: "$280k",
                title: "Victorian Revival Project",
                location: "Atlanta, GA",
                profit: "$52,000",
                renovation: "$30k",
              },
              {
                image: propertyImages[2],
                badge: "Contractor Needed",
                price: "$550k",
                title: "Downtown Loft Conversion",
                location: "Chicago, IL",
                profit: "$95,000",
                renovation: "$85k",
              },
            ].map((property, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${property.image}")` }}
                  ></div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {property.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-primary text-white px-2.5 py-1 rounded text-sm font-bold shadow-sm">
                    {property.price}
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{property.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Est. Profit</p>
                      <p className="font-bold text-green-600">{property.profit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Renovation</p>
                      <p className="font-bold text-slate-900">{property.renovation}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How the Ecosystem Works</h2>
            <p className="mt-4 text-lg text-slate-600">From acquisition to exit, we streamline every step.</p>
          </div>
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { num: 1, title: "List & Verify", desc: "Owners list property with verified specs and potential ROI calculations.", filled: true },
                { num: 2, title: "Fund", desc: "Investors and lenders commit capital securely through the platform.", filled: false },
                { num: 3, title: "Fix", desc: "Vetted contractors execute renovations with milestone-based payments.", filled: false },
                { num: 4, title: "Flip & Profit", desc: "Property is sold or rented, and profits are distributed automatically.", filled: false },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl border border-slate-100 text-center shadow-sm"
                >
                  <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-4 ${
                    step.filled
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white border-2 border-primary text-primary"
                  }`}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-primary">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary"></div>
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                Ready to Start Your Next Project?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl">
                Whether you have capital to deploy or a property to transform, Investee is your partner in success.
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link href="/calculator">
                  <Button size="lg" className="w-full sm:w-auto rounded-lg bg-white px-8 py-4 text-base font-bold text-primary hover:bg-slate-50 transition-colors shadow-lg">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/property-search">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-lg border border-white/30 bg-primary/20 backdrop-blur-sm px-8 py-4 text-base font-bold text-white hover:bg-primary/30 transition-colors">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </div>
            {/* Action-oriented image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80"
                  alt="Real estate professionals celebrating a successful deal"
                  className="rounded-2xl shadow-2xl border-4 border-white/20"
                />
                {/* Success indicator overlay */}
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Avg. Return</p>
                      <p className="font-bold text-slate-900">24% ROI</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
