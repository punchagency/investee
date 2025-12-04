import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, TrendingUp, Home, DollarSign, Target, Hammer } from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  {
    id: 1,
    title: "The Complete Guide to DSCR Loans for Rental Investors",
    category: "DSCR",
    description: "Learn how Debt Service Coverage Ratio works and why it matters for rental property financing.",
    icon: Home,
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Fix & Flip Financing: What Lenders Look For",
    category: "Fix & Flip",
    description: "Understand ARV calculations, rehab budgets, and how to get approved for flip loans faster.",
    icon: Hammer,
    readTime: "10 min",
  },
  {
    id: 3,
    title: "Understanding LTV and How It Affects Your Loan Rate",
    category: "Financing Basics",
    description: "Loan-to-Value ratios explained: why lenders care and how to optimize yours for better terms.",
    icon: Target,
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Building a Portfolio: From 1 Property to 10+",
    category: "Investing Strategy",
    description: "Strategies for scaling your real estate portfolio and managing multiple properties with leverage.",
    icon: TrendingUp,
    readTime: "12 min",
  },
  {
    id: 5,
    title: "Credit Score and Its Impact on Investment Financing",
    category: "Financing Basics",
    description: "How credit scores affect your rates, loan approval odds, and bottom-line returns.",
    icon: DollarSign,
    readTime: "7 min",
  },
  {
    id: 6,
    title: "20 Biggest Mistakes First-Time Investors Make",
    category: "Investing Strategy",
    description: "Common pitfalls in deal analysis, financing, and property management—and how to avoid them.",
    icon: BookOpen,
    readTime: "15 min",
  },
];

export default function Learning() {
  const categories = ["All", "DSCR", "Fix & Flip", "Financing Basics", "Investing Strategy"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/30">
      <div className="container max-w-5xl px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Learning Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Education-first approach to real estate investing. Learn strategies, understand financing, and make better deals.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-all border-border/50 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <article.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{article.readTime}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                  <Badge variant="outline" className="w-fit mt-2">{article.category}</Badge>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm mb-6 flex-1">{article.description}</p>
                  <Button variant="ghost" className="justify-start pl-0 text-primary hover:text-primary/90 hover:bg-transparent">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary text-white rounded-xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Analyze Your Deal?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Use what you've learned to evaluate your next investment. Get a professional analysis and funding quote instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                Use Calculator
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                Analyze Properties
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
