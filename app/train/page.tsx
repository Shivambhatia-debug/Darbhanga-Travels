"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Train, CalendarIcon, MapPin, User, Phone, Mail, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import stationList from "../../stationlist.json"
import trainData from "../../train_data.js"

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


interface PassengerDetails {
  name: string;
  age: string;
  gender: string;
}

export default function TrainBookingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [departureDate, setDepartureDate] = useState<Date>()
  const [departureDateOpen, setDepartureDateOpen] = useState(false)
  const [bookingData, setBookingData] = useState({
    from: "",
    to: "",
    class: "",
    customerName: "",
    phone: "",
    email: "",
    train: "",
    // Optional Train Details
    trainNumber: "",
    trainName: ""
  })
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>([{
    name: "",
    age: "",
    gender: ""
  }])
  const [fromSuggestions, setFromSuggestions] = useState<Station[]>([])
  const [toSuggestions, setToSuggestions] = useState<Station[]>([])
  const [fromStation, setFromStation] = useState<string>("")  // For display
  const [toStation, setToStation] = useState<string>("")      // For display
  const [isLoading, setIsLoading] = useState(false)
  const [submittedBooking, setSubmittedBooking] = useState<any>(null) // Store submitted booking details

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
  }

  const handleStationSearch = (value: string, type: 'from' | 'to') => {
    if (!value.trim()) {
      if (type === 'from') {
        setFromSuggestions([])
        setBookingData(prev => ({ ...prev, from: '' }))
      } else {
        setToSuggestions([])
        setBookingData(prev => ({ ...prev, to: '' }))
      }
      return
    }

    const searchValue = value.toUpperCase()
    const suggestions = stationList.filter(station => 
      station.name.toUpperCase().includes(searchValue) || 
      station.code.toUpperCase().includes(searchValue)
    ).slice(0, 10) // Increased to 10 for better suggestions
    
    if (type === 'from') {
      setFromSuggestions(suggestions)
    } else {
      setToSuggestions(suggestions)
    }
  }

  const handleStationSelect = (station: Station, type: 'from' | 'to') => {
    setBookingData(prev => ({
      ...prev,
      [type]: station.code  // Use station code for API compatibility
    }))
    if (type === 'from') {
      setFromStation(station.name)  // Display name in input field
      setFromSuggestions([])
    } else {
      setToStation(station.name)    // Display name in input field
      setToSuggestions([])
    }
    
  }


  const handleSubmit = async () => {
    // Validate required fields
    if (!bookingData.from || !bookingData.to || !departureDate) {
      toast({
        title: "Missing Information",
        description: "Please select departure and destination stations from the dropdown list, and choose a travel date",
        variant: "destructive"
      })
      return
    }

    // Validate passenger details
    const invalidPassengers = passengerDetails.some(passenger => 
      !passenger.name.trim() || !passenger.age.trim() || !passenger.gender.trim()
    )
    
    if (invalidPassengers) {
      toast({
        title: "Missing Passenger Information",
        description: "Please fill in all passenger details (Name, Age, Gender)",
        variant: "destructive"
      })
      return
    }

    // Validate customer name
    if (!bookingData.customerName.trim()) {
      toast({
        title: "Missing Customer Name",
        description: "Please enter customer name",
        variant: "destructive"
      })
      return
    }

    // Validate contact information
    if (!bookingData.phone.trim() || bookingData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      // Create booking directly via API
      const bookingPayload = {
        service: "train",
        from: bookingData.from,
        to: bookingData.to,
        date: departureDate.toISOString().split('T')[0],
        passengers: passengerDetails.length,
        class: bookingData.class,
        customer_name: bookingData.customerName || passengerDetails[0]?.name || "",
        customer_phone: bookingData.phone,
        customer_email: bookingData.email || "",
        passenger_details: passengerDetails,
        train_number: bookingData.trainNumber || null,
        train_name: bookingData.trainName || null,
        status: "pending_approval",
        payment_status: "pending",
        amount: 0,
        total_amount: 0
      }

      const response = await fetch('/api/bookings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload)
      })

      const result = await response.json()

      if (result.success) {
        // Store booking details to show on same page
        setSubmittedBooking({
          booking_id: result.booking_id,
          service: "train",
          from: fromStation || bookingData.from,
          to: toStation || bookingData.to,
          date: departureDate,
          passengers: passengerDetails.length,
          class: bookingData.class,
          customer_name: bookingData.customerName || passengerDetails[0]?.name || "",
          customer_phone: bookingData.phone,
          customer_email: bookingData.email || "",
          passenger_details: passengerDetails,
          train_number: bookingData.trainNumber || null,
          train_name: bookingData.trainName || null,
          status: "pending_approval"
        })
        
        toast({
          title: "Booking Created Successfully",
          description: "Your booking request has been submitted. Admin will review and approve it.",
        })
        
        // Scroll to booking details
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create booking. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Booking creation error:', error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewBooking = () => {
    setSubmittedBooking(null)
    setBookingData({
      from: "",
      to: "",
      class: "",
      customerName: "",
      phone: "",
      email: "",
      train: "",
      trainNumber: "",
      trainName: ""
    })
    setPassengerDetails([{ name: "", age: "", gender: "" }])
    setDepartureDate(undefined)
    setFromStation("")
    setToStation("")
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Booking Confirmation Card */}
          {submittedBooking && (
            <Card className="shadow-xl border-0 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Booking Submitted Successfully!</CardTitle>
                      <p className="text-white/80 mt-1">Booking ID: #{submittedBooking.booking_id}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Pending Approval
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Journey Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">From:</span> {submittedBooking.from}</p>
                      <p><span className="font-medium">To:</span> {submittedBooking.to}</p>
                      <p><span className="font-medium">Date:</span> {departureDate ? format(departureDate, "PPP") : submittedBooking.date}</p>
                      <p><span className="font-medium">Class:</span> {submittedBooking.class || "Not specified"}</p>
                      {submittedBooking.train_number && (
                        <p><span className="font-medium">Train Number:</span> {submittedBooking.train_number}</p>
                      )}
                      {submittedBooking.train_name && (
                        <p><span className="font-medium">Train Name:</span> {submittedBooking.train_name}</p>
                      )}
                      {submittedBooking.departure_time && (
                        <p><span className="font-medium">Departure:</span> {submittedBooking.departure_time}</p>
                      )}
                      {submittedBooking.arrival_time && (
                        <p><span className="font-medium">Arrival:</span> {submittedBooking.arrival_time}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Passenger Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Total Passengers:</span> {submittedBooking.passenger_details?.length || 0}</p>
                      {submittedBooking.passenger_details && submittedBooking.passenger_details.map((passenger: any, index: number) => (
                        <div key={index} className="p-3 bg-white rounded-lg">
                          <p className="font-medium">Passenger {index + 1}</p>
                          <p><span className="font-medium">Name:</span> {passenger.name}</p>
                          <p><span className="font-medium">Age:</span> {passenger.age} years</p>
                          <p><span className="font-medium">Gender:</span> {passenger.gender}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Phone:</span> {submittedBooking.customer_phone}</p>
                    {submittedBooking.customer_email && (
                      <p><span className="font-medium">Email:</span> {submittedBooking.customer_email}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> Your booking request has been submitted and is pending admin approval. 
                      You will be contacted soon for confirmation.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                    onClick={handleNewBooking}
                  >
                    Create New Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Form Card */}
          {!submittedBooking && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Train className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Train Booking</CardTitle>
                  <p className="text-white/80 mt-1">Book your train tickets with ease</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <Label htmlFor="train-from" className="text-sm font-semibold text-gray-700">
                    From Station
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="train-from"
                      placeholder="Enter departure station (e.g., New Delhi)"
                      value={fromStation}
                      onChange={(e) => {
                        setFromStation(e.target.value)
                        handleStationSearch(e.target.value, 'from')
                      }}
                      className="pl-12 h-12 md:h-14 border-2 border-gray-200 focus:border-blue-400 transition-colors text-base"
                    />
                    {fromSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                        {fromSuggestions.map((station) => (
                          <div
                            key={station.code}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleStationSelect(station, 'from')}
                          >
                            {station.name} ({station.code})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="train-to" className="text-sm font-semibold text-gray-700">
                    To Station
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="train-to"
                      placeholder="Enter destination station (e.g., Mumbai Central)"
                      value={toStation}
                      onChange={(e) => {
                        setToStation(e.target.value)
                        handleStationSearch(e.target.value, 'to')
                      }}
                      className="pl-12 h-12 md:h-14 border-2 border-gray-200 focus:border-blue-400 transition-colors text-base"
                    />
                    {toSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                        {toSuggestions.map((station) => (
                          <div
                            key={station.code}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleStationSelect(station, 'to')}
                          >
                            {station.name} ({station.code})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Departure Date</Label>
                  <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 md:h-14 border-2 border-gray-200 hover:border-blue-400 transition-colors text-base",
                          !departureDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {departureDate ? format(departureDate, "PPP") : "Select departure date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={departureDate} 
                        onSelect={(date) => {
                          setDepartureDate(date)
                          setDepartureDateOpen(false)
                        }} 
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="train-class" className="text-sm font-semibold text-gray-700">
                    Class
                  </Label>
                  <Select value={bookingData.class} onValueChange={(value) => handleInputChange("class", value)}>
                    <SelectTrigger className="h-12 md:h-14 border-2 border-gray-200 focus:border-blue-400 transition-colors text-base">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sleeper">🛏️ Sleeper (SL)</SelectItem>
                      <SelectItem value="3ac">❄️ Third AC (3A)</SelectItem>
                      <SelectItem value="2ac">❄️ Second AC (2A)</SelectItem>
                      <SelectItem value="1ac">❄️ First AC (1A)</SelectItem>
                      <SelectItem value="cc">💺 Chair Car (CC)</SelectItem>
                      <SelectItem value="2s">💺 Second Sitting (2S)</SelectItem>
                      <SelectItem value="3e">🛏️ 3 Tier Economy (3E)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                </div>
              </div>

              {/* Optional Train Details */}
              <div className="space-y-6 border-t pt-6">
                <div className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-700">Train Details (Optional)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="train-number">Train Number</Label>
                    <Input
                      id="train-number"
                      value={bookingData.trainNumber}
                      onChange={(e) => handleInputChange("trainNumber", e.target.value)}
                      placeholder="e.g., 12301"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="train-name">Train Name</Label>
                    <Input
                      id="train-name"
                      value={bookingData.trainName}
                      onChange={(e) => handleInputChange("trainName", e.target.value)}
                      placeholder="e.g., Rajdhani Express"
                    />
                  </div>
                </div>
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
                  <Label htmlFor="customer-name">Customer Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="customer-name"
                      value={bookingData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      placeholder="Enter customer full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-phone">Your Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => {
                        // Only allow digits and limit to 10 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                        handleInputChange("phone", value)
                      }}
                      placeholder="Enter 10 digit phone number"
                      className="pl-10"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                    />
                    {bookingData.phone && bookingData.phone.length !== 10 && (
                      <p className="text-sm text-red-500">Phone number must be exactly 10 digits</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-email">Your Email Address (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address (optional)"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Booking"}
                </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
} 