"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plane, CalendarIcon, MapPin, Search, User, Phone } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface PassengerDetails {
  name: string;
  age: string;
  gender: string;
}

export default function FlightBookingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [bookingData, setBookingData] = useState({
    from: "",
    to: "",
    passengers: "1",
    class: "",
    tripType: "one-way",
    phone: ""
  })
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>([{
    name: "",
    age: "",
    gender: ""
  }])

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

  const handleSubmit = () => {
    const bookingInfo = {
      from: bookingData.from,
      to: bookingData.to,
      departureDate,
      returnDate: bookingData.tripType === "round-trip" ? returnDate : null,
      passengers: bookingData.passengers,
      class: bookingData.class,
      tripType: bookingData.tripType,
      phone: bookingData.phone,
      passengerDetails: passengerDetails
    }
    localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo))
    router.push('/book/flight')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plane className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Flight Booking</CardTitle>
                  <p className="text-white/80 mt-1">Book your flight tickets with ease</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <Label htmlFor="flight-from" className="text-sm font-semibold text-gray-700">
                    From City
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="flight-from"
                      placeholder="Enter departure city (e.g., Delhi)"
                      value={bookingData.from}
                      onChange={(e) => handleInputChange("from", e.target.value)}
                      className="pl-12 h-12 md:h-14 border-2 border-gray-200 focus:border-green-400 transition-colors text-base"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="flight-to" className="text-sm font-semibold text-gray-700">
                    To City
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="flight-to"
                      placeholder="Enter destination city (e.g., Mumbai)"
                      value={bookingData.to}
                      onChange={(e) => handleInputChange("to", e.target.value)}
                      className="pl-12 h-12 md:h-14 border-2 border-gray-200 focus:border-green-400 transition-colors text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Trip Type</Label>
                  <Select
                    value={bookingData.tripType}
                    onValueChange={(value) => handleInputChange("tripType", value)}
                  >
                    <SelectTrigger className="h-12 md:h-14 border-2 border-gray-200 focus:border-green-400 transition-colors text-base">
                      <SelectValue placeholder="Select trip type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-way">✈️ One Way</SelectItem>
                      <SelectItem value="round-trip">🔄 Round Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="flight-class" className="text-sm font-semibold text-gray-700">
                    Class
                  </Label>
                  <Select value={bookingData.class} onValueChange={(value) => handleInputChange("class", value)}>
                    <SelectTrigger className="h-12 md:h-14 border-2 border-gray-200 focus:border-green-400 transition-colors text-base">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">💺 Economy</SelectItem>
                      <SelectItem value="premium-economy">💺 Premium Economy</SelectItem>
                      <SelectItem value="business">💼 Business</SelectItem>
                      <SelectItem value="first">👑 First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Departure Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 md:h-14 border-2 border-gray-200 hover:border-green-400 transition-colors text-base",
                          !departureDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {departureDate ? format(departureDate, "PPP") : "Select departure date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {bookingData.tripType === "round-trip" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Return Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 md:h-14 border-2 border-gray-200 hover:border-green-400 transition-colors text-base",
                            !returnDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5" />
                          {returnDate ? format(returnDate, "PPP") : "Select return date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          initialFocus
                          disabled={(date) => date < (departureDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="flight-passengers" className="text-sm font-semibold text-gray-700">
                  Passengers
                </Label>
                <Select
                  value={bookingData.passengers}
                  onValueChange={(value) => handleInputChange("passengers", value)}
                >
                  <SelectTrigger className="h-12 md:h-14 border-2 border-gray-200 focus:border-green-400 transition-colors text-base">
                    <SelectValue placeholder="Select passengers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">👤 1 Passenger</SelectItem>
                    <SelectItem value="2">👥 2 Passengers</SelectItem>
                    <SelectItem value="3">👥 3 Passengers</SelectItem>
                    <SelectItem value="4">👥 4 Passengers</SelectItem>
                    <SelectItem value="5">👥 5+ Passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold text-gray-700">
                    Passenger Details
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPassenger}
                    disabled={passengerDetails.length >= 10}
                  >
                    Add Passenger
                  </Button>
                </div>
                
                {passengerDetails.map((passenger, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Passenger {index + 1}</h4>
                      {passengerDetails.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePassenger(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`passenger-${index}-name`}>Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id={`passenger-${index}-name`}
                            value={passenger.name}
                            onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                            placeholder="Enter passenger name"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`passenger-${index}-age`}>Age *</Label>
                        <Input
                          id={`passenger-${index}-age`}
                          type="number"
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                          placeholder="Enter age"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`passenger-${index}-gender`}>Gender *</Label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value) => handlePassengerChange(index, "gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="user-phone">Your Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={handleSubmit}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Flights
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 