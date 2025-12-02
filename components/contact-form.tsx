"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Send, CheckCircle, Sparkles, Download, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    travelDate: "",
    budget: "",
    message: "",
    newsletter: false,
    terms: false,
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.terms) {
      toast({
        title: "Terms & Conditions Required",
        description: "Please accept our terms and conditions to proceed.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    toast({
      title: "Message Sent Successfully! 🎉",
      description: "Our travel experts will contact you within 2 hours.",
    })

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        travelDate: "",
        budget: "",
        message: "",
        newsletter: false,
        terms: false,
      })
    }, 5000)
  }

  const handleDownloadBrochure = () => {
    toast({
      title: "Brochure Download Started! 📄",
      description: "Your travel brochure is being prepared...",
    })
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-12 md:p-16 text-center relative">
            {/* Success Animation Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"></div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="mx-auto w-20 md:w-24 h-20 md:h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mb-8 shadow-xl">
                <CheckCircle className="h-10 md:h-12 w-10 md:w-12 text-white" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Sparkles className="h-6 md:h-8 w-6 md:w-8 text-yellow-500 mr-2" />
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
                  Your message has been sent successfully! Our travel experts will contact you within 2 hours to help
                  plan your perfect journey.
                </p>

                <div className="bg-white/80 rounded-2xl p-6 mb-8 border border-green-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>What happens next?</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 text-left">
                    <li>✅ We'll review your requirements</li>
                    <li>✅ Our expert will call you within 2 hours</li>
                    <li>✅ Get personalized travel recommendations</li>
                    <li>✅ Receive the best deals and packages</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-2 border-green-200 hover:bg-green-50"
                  >
                    Send Another Message
                  </Button>
                  <Button onClick={handleDownloadBrochure} className="bg-gradient-to-r from-pink-500 to-purple-500">
                    <Download className="h-4 w-4 mr-2" />
                    Download Brochure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50"></div>

        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Send us a Message
          </CardTitle>
          <CardDescription className="text-base md:text-lg text-gray-600">
            Fill out the form below and we'll get back to you with the best travel solutions.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="border-2 border-gray-200 focus:border-pink-400 transition-colors h-12"
                />
              </motion.div>
              <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="border-2 border-gray-200 focus:border-pink-400 transition-colors h-12"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-2 border-gray-200 focus:border-pink-400 transition-colors h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border-2 border-gray-200 focus:border-pink-400 transition-colors h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-semibold text-gray-700">
                Service Interested In
              </Label>
              <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-pink-400 transition-colors h-12">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="train">🚂 Train Booking</SelectItem>
                  <SelectItem value="bus">🚌 Bus Booking</SelectItem>
                  <SelectItem value="flight">✈️ Flight Booking</SelectItem>
                  <SelectItem value="cab">🚗 Cab Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="travelDate" className="text-sm font-semibold text-gray-700">
                  Preferred Travel Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="travelDate"
                    name="travelDate"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => handleInputChange("travelDate", e.target.value)}
                    className="border-2 border-gray-200 focus:border-pink-400 transition-colors h-12 pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-semibold text-gray-700">
                  Budget Range
                </Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-pink-400 transition-colors h-12">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5000">💰 Under ₹5,000</SelectItem>
                    <SelectItem value="5000-15000">💰 ₹5,000 - ₹15,000</SelectItem>
                    <SelectItem value="15000-30000">💰 ₹15,000 - ₹30,000</SelectItem>
                    <SelectItem value="30000-50000">💰 ₹30,000 - ₹50,000</SelectItem>
                    <SelectItem value="above-50000">💰 Above ₹50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                Tell us about your travel plans *
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Share your travel requirements, destinations you'd like to visit, number of travelers, special needs, or any questions you have..."
                className="min-h-[120px] md:min-h-[140px] border-2 border-gray-200 focus:border-pink-400 transition-colors resize-none"
                required
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="newsletter"
                  name="newsletter"
                  className="border-2"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}
                />
                <Label htmlFor="newsletter" className="text-sm text-gray-600">
                  📧 Subscribe to our newsletter for exclusive travel deals and destination guides
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="terms"
                  name="terms"
                  required
                  className="border-2"
                  checked={formData.terms}
                  onCheckedChange={(checked) => handleInputChange("terms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-pink-600 hover:underline font-medium"
                    onClick={() =>
                      toast({ title: "Terms & Conditions", description: "Legal documents available on request" })
                    }
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-pink-600 hover:underline font-medium"
                    onClick={() => toast({ title: "Privacy Policy", description: "Your privacy is our priority" })}
                  >
                    Privacy Policy
                  </button>{" "}
                  *
                </Label>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 h-14 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    Sending Your Message...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3" />
                    Send Message & Get Free Quote
                    <Sparkles className="h-5 w-5 ml-3" />
                  </>
                )}
              </Button>
            </motion.div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                🚀 <strong>Quick Response Guarantee:</strong> We typically respond within 2 hours during business hours.
                For urgent travel needs, please call us directly at{" "}
                <button
                  type="button"
                  className="text-pink-600 font-semibold hover:underline"
                  onClick={() => window.open("tel:+919876543210", "_self")}
                >
                  +91 9876543210
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
