"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Train,
  Bus,
  Plane,
  Car,
  CalendarIcon,
  MapPin,
  Search,
  Sparkles,
  Shield,
  CreditCard,
  Headphones,
  CheckCircle,
  User,
  Phone,
  Mail,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import stationList from "../stationlist.json"
import trainData from "../train_data.js"
import { useRouter } from "next/navigation"

interface Station {
  name: string;
  code: string;
}

interface Train {
  number: string;
  name: string;
  from: string;
  to: string;
  type: string;
  classes: string[];
}

interface TrainSuggestion {
  number: string;
  name: string;
}

interface PassengerDetails {
  name: string;
  age: string;
  gender: string;
}

export default function BookingSection() {
  const router = useRouter()
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [activeTab, setActiveTab] = useState("train")
  const [bookingData, setBookingData] = useState({
    from: "",
    to: "",
    passengers: "1",
    class: "",
    type: "",
    phone: "",
    train: ""
  })
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>([{
    name: "",
    age: "",
    gender: ""
  }])
  const [fromSuggestions, setFromSuggestions] = useState<Station[]>([])
  const [toSuggestions, setToSuggestions] = useState<Station[]>([])
  const [trainSuggestions, setTrainSuggestions] = useState<TrainSuggestion[]>([])
  const { toast } = useToast()

  const tabVariants = {
    inactive: { scale: 0.95, opacity: 0.7 },
    active: { scale: 1, opacity: 1 },
  }

  const handleInputChange = (field: string, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string) => {
    const newPassengerDetails = [...passengerDetails]
    newPassengerDetails[index] = {
      ...newPassengerDetails[index],
      [field]: value
    }
    setPassengerDetails(newPassengerDetails)
  }

  const addPassenger = () => {
    if (passengerDetails.length >= 10) {
      toast({
        title: "Maximum Passengers Reached",
        description: "You can only add up to 10 passengers.",
        variant: "destructive",
      })
      return
    }
    setPassengerDetails([...passengerDetails, {
      name: "",
      age: "",
      gender: "",
    }])
  }

  const removePassenger = (index: number) => {
    if (passengerDetails.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one passenger is required.",
        variant: "destructive",
      })
      return
    }
    const newPassengerDetails = passengerDetails.filter((_, i) => i !== index)
    setPassengerDetails(newPassengerDetails)
    setBookingData(prev => ({ ...prev, passengers: newPassengerDetails.length.toString() }))
  }

  const validatePassengerDetails = () => {
    if (!bookingData.phone) {
      return false;
    }
    for (const passenger of passengerDetails) {
      if (!passenger.name || !passenger.age || !passenger.gender) {
        return false
      }
    }
    return true
  }

  const handleCardClick = (service: string) => {
    // Store the booking data in localStorage before navigation
    const bookingInfo = {
      from: "",
      to: "",
      date: new Date(),
      passengers: "1",
      class: "",
      type: "",
      phone: "",
      train: "",
      passengerDetails: [{
        name: "",
        age: "",
        gender: ""
      }]
    }
    localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo))
    
    // Navigate to the respective service page
    router.push(`/${service.toLowerCase()}`)
  }

  const handleStationSearch = (value: string, type: 'from' | 'to') => {
    const searchValue = value.toUpperCase()
    const suggestions = stationList.filter(station => 
      station.name.includes(searchValue) || 
      station.code.includes(searchValue)
    ).slice(0, 5)
    
    if (type === 'from') {
      setFromSuggestions(suggestions)
    } else {
      setToSuggestions(suggestions)
    }
  }

  const handleStationSelect = (station: Station, type: 'from' | 'to') => {
    setBookingData(prev => ({
      ...prev,
      [type]: station.name
    }))
    if (type === 'from') {
      setFromSuggestions([])
    } else {
      setToSuggestions([])
    }
    
    // If both stations are selected, show train suggestions
    if (type === 'to' && bookingData.from) {
      const fromCode = stationList.find(s => s.name === bookingData.from)?.code
      const toCode = station.code
      if (fromCode && toCode) {
        // Filter trains that might operate between these stations
        const suggestions = (trainData as Train[])
          .filter(train => train.name.includes(fromCode) || train.name.includes(toCode))
          .map(train => ({ number: train.number, name: train.name }))
          .slice(0, 5)
        setTrainSuggestions(suggestions)
      }
    }
  }

  const handleTrainSelect = (train: TrainSuggestion) => {
    setBookingData(prev => ({
      ...prev,
      train: train.number
    }))
    setTrainSuggestions([])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-6xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50"></div>

        <CardHeader className="text-center pb-6 md:pb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex justify-center items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-pink-500" />
              </motion.div>
              <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Quick Booking System
              </CardTitle>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-blue-500" />
              </motion.div>
            </div>
            <CardDescription className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Experience seamless travel booking with our smart system. Choose your preferred mode of transport and let us handle the rest!
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                value: "train", 
                icon: Train, 
                label: "Train", 
                color: "from-blue-500 to-blue-600", 
                description: "Book train tickets with ease",
                features: ["Instant Confirmation", "Multiple Classes", "PNR Status"],
                gradient: "from-blue-50 to-blue-100"
              },
              { 
                value: "bus", 
                icon: Bus, 
                label: "Bus", 
                color: "from-green-500 to-green-600", 
                description: "Find and book bus tickets",
                features: ["Live Tracking", "Comfortable Seats", "On-time Service"],
                gradient: "from-green-50 to-green-100"
              },
              { 
                value: "flight", 
                icon: Plane, 
                label: "Flight", 
                color: "from-purple-500 to-purple-600", 
                description: "Book flights to any destination",
                features: ["Best Prices", "Flexible Dates", "Priority Boarding"],
                gradient: "from-purple-50 to-purple-100"
              },
              { 
                value: "cab", 
                icon: Car, 
                label: "Cab", 
                color: "from-pink-500 to-pink-600", 
                description: "Book cabs for your journey",
                features: ["24/7 Service", "Multiple Car Types", "Cashless Payment"],
                gradient: "from-pink-50 to-pink-100"
              },
            ].map((card) => (
              <motion.div
                key={card.value}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card.value)}
                className="cursor-pointer"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`bg-gradient-to-br ${card.gradient} p-6`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} shadow-lg`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-800">{card.label}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">{card.description}</CardDescription>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {card.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full bg-gradient-to-r ${card.color} hover:opacity-90 text-white font-semibold py-4 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300`}
                      size="lg"
                    >
                      Book Now
                      <Sparkles className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-3xl border border-pink-200"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              {[
                { icon: CheckCircle, text: "Instant Confirmation", color: "text-green-600", description: "Get confirmed bookings instantly" },
                { icon: Shield, text: "Secure Payment", color: "text-blue-600", description: "100% safe & secure transactions" },
                { icon: Headphones, text: "24/7 Support", color: "text-purple-600", description: "Round the clock assistance" },
                { icon: CreditCard, text: "Best Prices", color: "text-pink-600", description: "Guaranteed lowest fares" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex flex-col items-center space-y-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`p-3 md:p-4 rounded-full bg-white shadow-lg ${feature.color}`}>
                    <feature.icon className="h-6 md:h-7 w-6 md:w-7" />
                  </div>
                  <div>
                    <span className="text-sm md:text-base font-semibold text-gray-800">{feature.text}</span>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
