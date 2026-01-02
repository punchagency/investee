import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  TrendingUp,
  Home,
  DollarSign,
  Target,
  Hammer,
  Play,
  Clock,
  Users,
  Award,
  ChevronRight,
  GraduationCap,
  FileText,
  Video
} from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  {
    id: 1,
    title: "The Complete Guide to DSCR Loans for Rental Investors",
    category: "DSCR",
    description: "Learn how Debt Service Coverage Ratio works and why it matters for rental property financing.",
    icon: Home,
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
  },
  {
    id: 2,
    title: "Fix & Flip Financing: What Lenders Look For",
    category: "Fix & Flip",
    description: "Understand ARV calculations, rehab budgets, and how to get approved for flip loans faster.",
    icon: Hammer,
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
  },
  {
    id: 3,
    title: "Understanding LTV and How It Affects Your Loan Rate",
    category: "Financing Basics",
    description: "Loan-to-Value ratios explained: why lenders care and how to optimize yours for better terms.",
    icon: Target,
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
  },
  {
    id: 4,
    title: "Building a Portfolio: From 1 Property to 10+",
    category: "Investing Strategy",
    description: "Strategies for scaling your real estate portfolio and managing multiple properties with leverage.",
    icon: TrendingUp,
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
  },
  {
    id: 5,
    title: "Credit Score and Its Impact on Investment Financing",
    category: "Financing Basics",
    description: "How credit scores affect your rates, loan approval odds, and bottom-line returns.",
    icon: DollarSign,
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80",
  },
  {
    id: 6,
    title: "20 Biggest Mistakes First-Time Investors Make",
    category: "Investing Strategy",
    description: "Common pitfalls in deal analysis, financing, and property management—and how to avoid them.",
    icon: BookOpen,
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
  },
];

const featuredVideo = {
  title: "Real Estate Investing 101: Getting Started with Your First Deal",
  duration: "45 min",
  thumbnail: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80",
  instructor: "Sarah Chen",
  views: "12.5k",
};

const courses = [
  {
    id: 1,
    title: "Fix & Flip Mastery",
    lessons: 24,
    duration: "6 hours",
    level: "Intermediate",
    students: 1840,
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80",
  },
  {
    id: 2,
    title: "DSCR Loan Fundamentals",
    lessons: 12,
    duration: "3 hours",
    level: "Beginner",
    students: 2350,
    image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=400&q=80",
  },
  {
    id: 3,
    title: "Advanced Deal Analysis",
    lessons: 18,
    duration: "4.5 hours",
    level: "Advanced",
    students: 890,
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400&q=80",
  },
];

export default function Learning() {
  const categories = ["All", "DSCR", "Fix & Flip", "Financing Basics", "Investing Strategy"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <GraduationCap className="h-3 w-3 mr-1" />
              Learning Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Master Real Estate
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent"> Investing</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Education-first approach to real estate investing. Learn strategies, understand financing, and make better deals.
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span><strong className="text-slate-900">50+</strong> Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                <span><strong className="text-slate-900">15+</strong> Video Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span><strong className="text-slate-900">10k+</strong> Students</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Featured Video</h2>
            <button className="text-primary text-sm font-semibold hover:text-primary/80 flex items-center gap-1">
              View All Videos <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[21/9] group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${featuredVideo.thumbnail}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-5 shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="h-10 w-10 text-primary fill-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-3">
                <Clock className="h-3 w-3 mr-1" />
                {featuredVideo.duration}
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{featuredVideo.title}</h3>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>By {featuredVideo.instructor}</span>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                <span>{featuredVideo.views} views</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Popular Courses</h2>
            <button className="text-primary text-sm font-semibold hover:text-primary/80 flex items-center gap-1">
              Browse All Courses <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all border-slate-200 group cursor-pointer h-full">
                  <div className="aspect-video relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${course.image}')` }}
                    ></div>
                    <div className="absolute top-3 left-3">
                      <Badge className={`${
                        course.level === "Beginner" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        course.level === "Intermediate" ? "bg-amber-100 text-amber-700 border-amber-200" :
                        "bg-purple-100 text-purple-700 border-purple-200"
                      } border font-semibold`}>
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{course.students.toLocaleString()} students enrolled</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Articles Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Articles & Guides</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

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
                <Card className="h-full flex flex-col hover:shadow-lg transition-all border-slate-200 group overflow-hidden">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${article.image}')` }}
                    ></div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-slate-700 backdrop-blur-sm border-0 text-xs font-semibold">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <Badge variant="outline" className="w-fit text-xs">{article.category}</Badge>
                    <CardTitle className="text-lg leading-tight mt-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <p className="text-slate-600 text-sm mb-6 flex-1">{article.description}</p>
                    <Button variant="ghost" className="justify-start pl-0 text-primary hover:text-primary/90 hover:bg-transparent font-semibold">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 bg-white/10 rounded-full w-64 h-64 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 bg-white/10 rounded-full w-64 h-64 blur-3xl"></div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <Award className="h-12 w-12 mx-auto mb-4 text-white/80" />
            <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Deal?</h2>
            <p className="text-lg text-white/90 mb-8">
              Use what you've learned to evaluate your next investment. Get a professional analysis and funding quote instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                  Use Calculator
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/property-search">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
