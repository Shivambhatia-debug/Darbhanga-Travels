"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plane,
  Train,
  Bus,
  Car,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Users,
  Star,
  CheckCircle,
  Calendar,
  CreditCard,
  Headphones,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Globe,
  Award,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ContactForm from "@/components/contact-form"
import BookingSection from "@/components/booking-section"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Click handlers for buttons
  const handleCallNow = () => {
    window.open("tel:+919876543210", "_self")
    toast({
      title: "Calling Darbhanga Travels! 📞",
      description: "Connecting you to our travel experts...",
    })
  }

  const handleBookTrip = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
    toast({
      title: "Let's Plan Your Trip! ✈️",
      description: "Scroll down to start booking your journey.",
    })
  }

  const handlePlanTrip = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleGetQuote = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    toast({
      title: "Get Free Quote! 💰",
      description: "Fill the contact form for personalized quote.",
    })
  }

  const handleServiceBooking = (service: string) => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
    toast({
      title: `${service} Booking! 🎯`,
      description: `Let's book your ${service.toLowerCase()} journey.`,
    })
  }

  const handleSocialShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Darbhanga Travels - Your Journey, Our Priority",
        text: "Check out this amazing travel agency!",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied! 📋",
        description: "Share this website with your friends!",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Enhanced Header with New Logo */}
      <motion.header
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrollY > 50 ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: scrollY > 50 ? "1px solid rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                <Image
                  src="/images/darbhanga-logo.jpg"
                  alt="Darbhanga Travels Logo"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Darbhanga Travels
              </h1>
              <p className="text-xs text-gray-600 font-medium">Dil Toh Mushafir Hai ✨</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", href: "#home" },
              { name: "Services", href: "#services" },
              { name: "Book Now", href: "#booking" },
              { name: "Contact", href: "#contact" },
              { name: "User Login", href: "/user/login", isLink: true },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative text-sm font-medium text-gray-700 hover:text-pink-600 transition-all duration-300 group"
                  onClick={(e) => {
                    if (!item.isLink) {
                      e.preventDefault()
                      document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-pink-200 hover:border-pink-300 hover:bg-pink-50"
                onClick={handleCallNow}
              >
                <Phone className="h-4 w-4 mr-2 text-pink-600" />
                <span className="text-pink-600">Call Now</span>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Link href="/user/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-blue-600">User Login</span>
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleBookTrip}
              >
                Book Trip
              </Button>
            </motion.div>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-lg border-t"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {[
                  { name: "Home", href: "#home" },
                  { name: "Services", href: "#services" },
                  { name: "Book Now", href: "#booking" },
                  { name: "Contact", href: "#contact" },
                  { name: "User Login", href: "/user/login", isLink: true },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 px-4 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                    onClick={(e) => {
                      if (!item.isLink) {
                        e.preventDefault()
                        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" })
                      }
                      setIsMenuOpen(false)
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  <Link href="/user/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      User Login
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full border-pink-200 hover:bg-pink-50"
                    onClick={() => {
                      handleCallNow()
                      setIsMenuOpen(false)
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
                    onClick={() => {
                      handleBookTrip()
                      setIsMenuOpen(false)
                    }}
                  >
                    Book Trip
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Quick Booking Section */}
      <section id="booking" className="py-16 md:py-24 bg-gradient-to-br from-white via-pink-50 to-purple-50 relative overflow-hidden min-h-screen flex items-center">
        {/* Background with Parallax Effect */}
        <div className="absolute inset-0">
          <motion.div style={{ y: scrollY * 0.5 }} className="absolute inset-0">
            <Image
              src="/images/darbhanga-palace.jpg"
              alt="Beautiful Darbhanga Palace"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm mb-6 text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted Travel Partner Since 2010
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              Discover the Beauty of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 animate-pulse">
                Darbhanga & Beyond
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto"
            >
              Experience the rich heritage of Darbhanga while we take care of your complete travel needs. From ancient
              palaces to modern destinations - your journey starts here.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                onClick={handlePlanTrip}
              >
                <Calendar className="h-5 w-5 mr-3" />
                Plan Your Dream Trip
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                onClick={handleGetQuote}
              >
                <Phone className="h-5 w-5 mr-3" />
                Get Free Quote
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 max-w-2xl mx-auto">
              {[
                { number: "50K+", label: "Happy Travelers", icon: Heart },
                { number: "15+", label: "Years Experience", icon: Award },
                { number: "24/7", label: "Support", icon: Globe },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <stat.icon className="h-8 w-8 text-pink-400 mx-auto mb-3" />
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Services Section */}
      {/* Removed Complete Travel Solutions section as requested */}

      {/* Enhanced Booking Section */}
      <section
        id="booking"
        className="py-16 md:py-24 bg-gradient-to-br from-white via-pink-50 to-purple-50 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <Badge className="mb-6 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 border-pink-200 px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Quick & Easy Booking
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Book Your Perfect Journey</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Select your preferred mode of transport and let us handle the rest. Your adventure is just a few clicks
              away!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BookingSection />
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Why Choose Darbhanga Travels
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Travel with Complete Confidence
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine traditional Indian hospitality with modern technology to provide you with secure, reliable, and
              memorable travel experiences.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {[
              {
                icon: Shield,
                title: "100% Secure Booking",
                description: "Your payments and personal information are protected with bank-level security.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Clock,
                title: "24/7 Expert Support",
                description: "Round-the-clock customer support from our experienced travel consultants.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: CreditCard,
                title: "Best Price Guarantee",
                description: "We guarantee the best prices with exclusive deals and seasonal offers.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Users,
                title: "50,000+ Happy Customers",
                description: "Join thousands of satisfied travelers who trust us for their journeys.",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: Star,
                title: "Premium Service Quality",
                description: "Experience world-class service with attention to every detail of your trip.",
                color: "from-red-500 to-red-600",
              },
              {
                icon: Headphones,
                title: "Personal Travel Advisor",
                description: "Get personalized travel advice and recommendations from our experts.",
                color: "from-teal-500 to-teal-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="text-center group"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`mx-auto w-16 md:w-20 h-16 md:h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="h-8 md:h-10 w-8 md:w-10 text-white" />
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 group-hover:text-pink-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section
        id="contact"
        className="py-16 md:py-24 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <Badge className="mb-6 bg-white/80 text-pink-800 border-pink-200 px-4 py-2 backdrop-blur-sm">
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Let's Plan Your Next Adventure
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions or ready to book? Our travel experts are here to help you create unforgettable memories.
              Reach out to us anytime!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8 md:space-y-10"
            >
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Connect With Us</h3>
                <div className="space-y-6 md:space-y-8">
                  {[
                    {
                      icon: MapPin,
                      title: "Visit Our Office",
                      content: "Main Road, Near Railway Station\nDarbhanga, Bihar 846004\nIndia",
                      color: "from-blue-500 to-blue-600",
                      action: () => window.open("https://maps.google.com/?q=Darbhanga,Bihar", "_blank"),
                    },
                    {
                      icon: Phone,
                      title: "Call Us Anytime",
                      content: "+91 9876543210\n+91 8765432109\nAvailable 24/7 for emergencies",
                      color: "from-green-500 to-green-600",
                      action: handleCallNow,
                    },
                    {
                      icon: Mail,
                      title: "Email Us",
                      content: "info@darbhangatravels.com\nbooking@darbhangatravels.com\nsupport@darbhangatravels.com",
                      color: "from-purple-500 to-purple-600",
                      action: () => window.open("mailto:info@darbhangatravels.com", "_self"),
                    },
                  ].map((contact, index) => (
                    <motion.div
                      key={contact.title}
                      className="flex items-start space-x-4 md:space-x-6 group cursor-pointer"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.3 }}
                      onClick={contact.action}
                    >
                      <motion.div
                        className={`w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r ${contact.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <contact.icon className="h-6 md:h-8 w-6 md:w-8 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                          {contact.title}
                        </h4>
                        <p className="text-sm md:text-base text-gray-600 whitespace-pre-line leading-relaxed group-hover:text-gray-700 transition-colors">
                          {contact.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-white/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-6 flex items-center">
                  <Clock className="h-6 w-6 mr-3 text-pink-600" />
                  Business Hours
                </h4>
                <div className="space-y-3 md:space-y-4 text-sm">
                  {[
                    { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
                    { day: "Saturday", time: "9:00 AM - 6:00 PM" },
                    { day: "Sunday", time: "10:00 AM - 4:00 PM" },
                    { day: "Emergency Support", time: "24/7 Available", special: true },
                  ].map((schedule) => (
                    <div
                      key={schedule.day}
                      className={`flex justify-between items-center py-2 ${
                        schedule.special ? "border-t-2 border-pink-200 pt-4" : ""
                      }`}
                    >
                      <span className="text-gray-600 font-medium">{schedule.day}</span>
                      <span className={`font-bold ${schedule.special ? "text-green-600" : "text-gray-900"}`}>
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
                  <Image
                    src="/images/darbhanga-logo.jpg"
                    alt="Darbhanga Travels Logo"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Darbhanga Travels
                  </h3>
                  <p className="text-sm text-gray-400">Dil Toh Mushafir Hai ✨</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Your trusted travel partner for over 15 years. We specialize in creating unforgettable journeys that
                blend comfort, safety, and authentic experiences.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  <motion.div
                    key={social}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-500 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onClick={handleSocialShare}
                  >
                    <div className="w-5 h-5 bg-white/70 rounded-sm"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {[
              {
                title: "Quick Links",
                links: [
                  {
                    name: "Home",
                    action: () => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }),
                  },
                  {
                    name: "About Us",
                    action: () => toast({ title: "Coming Soon!", description: "About page under development" }),
                  },
                  {
                    name: "Services",
                    action: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
                  },
                  {
                    name: "Destinations",
                    action: () => toast({ title: "Coming Soon!", description: "Destinations page under development" }),
                  },
                  {
                    name: "Contact",
                    action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
                  },
                  {
                    name: "User Login",
                    action: () => window.location.href = "/user/login",
                  },
                ],
              },
              {
                title: "Our Services",
                links: [
                  { name: "Train Booking", action: () => handleServiceBooking("Train") },
                  { name: "Bus Booking", action: () => handleServiceBooking("Bus") },
                  { name: "Flight Booking", action: () => handleServiceBooking("Flight") },
                  { name: "Cab Services", action: () => handleServiceBooking("Cab") }
                ],
              },
              {
                title: "Support",
                links: [
                  {
                    name: "Help Center",
                    action: () =>
                      toast({ title: "Help Center", description: "Call +91 9876543210 for immediate assistance" }),
                  },
                  {
                    name: "Terms & Conditions",
                    action: () =>
                      toast({ title: "Terms & Conditions", description: "Legal documents available on request" }),
                  },
                  {
                    name: "Privacy Policy",
                    action: () => toast({ title: "Privacy Policy", description: "Your privacy is our priority" }),
                  },
                  {
                    name: "Refund Policy",
                    action: () => toast({ title: "Refund Policy", description: "Easy refund process available" }),
                  },
                  {
                    name: "Travel Insurance",
                    action: () =>
                      toast({ title: "Travel Insurance", description: "Comprehensive travel insurance available" }),
                  },
                ],
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h4 className="font-bold text-lg mb-6 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={link.action}
                        className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group text-left"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-700 mt-12 md:mt-16 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} Darbhanga Travels. All rights reserved.
                <span className="text-pink-400"> Made with ❤️ for travelers</span>
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-green-400" />
                  SSL Secured
                </span>
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-yellow-400" />
                  ISO Certified
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-0"
                  onClick={handleSocialShare}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, duration: 0.3 }}>
          <Button
            size="sm"
            className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 shadow-lg"
            onClick={() => window.open("https://wa.me/919876543210", "_blank")}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, duration: 0.3 }}>
          <Button
            size="sm"
            className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 shadow-lg"
            onClick={handleCallNow}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
