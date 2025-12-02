"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar as CalendarIcon,
  CreditCard,
  Users,
  Train,
  Upload,
  FileText,
  X
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import stationList from "../../../../stationlist.json"

interface Station {
  name: string
  code: string
}

interface PassengerDetails {
  name: string
  age: string
  gender: string
}

interface BookingFormData {
  // Customer Details
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  
  // Booking Details
  service: string
  fromLocation: string
  toLocation: string
  travelDate: Date | undefined
  bookingDate: Date | undefined
  passengers: string
  totalAmount: string
  paidAmount: string
  pendingAmount: string
  status: string
  paymentStatus: string
  notes: string
  ticketPdf: File | null
  ticketPdfUrl: string
  
  // Train Details
  trainNumber: string
  trainName: string
  trainClass: string
  farePerPerson: string
  
  // Passenger Details
  passengerDetails: PassengerDetails[]
}

export default function AddCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [travelDate, setTravelDate] = useState<Date | undefined>()
  const [bookingDate, setBookingDate] = useState<Date | undefined>()
  const [travelDateOpen, setTravelDateOpen] = useState(false)
  const [bookingDateOpen, setBookingDateOpen] = useState(false)
  const [fromSuggestions, setFromSuggestions] = useState<Station[]>([])
  const [toSuggestions, setToSuggestions] = useState<Station[]>([])
  const fromInputRef = useRef<HTMLDivElement>(null)
  const toInputRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    service: "",
    fromLocation: "",
    toLocation: "",
    travelDate: undefined,
    bookingDate: undefined,
    passengers: "1",
    totalAmount: "",
    paidAmount: "",
    pendingAmount: "",
    status: "pending_booking",
    paymentStatus: "pending",
    notes: "",
    ticketPdf: null,
    ticketPdfUrl: "",
    // Train Details
    trainNumber: "",
    trainName: "",
    trainClass: "",
    farePerPerson: "",
    passengerDetails: [{
      name: "",
      age: "",
      gender: ""
    }]
  })

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Calculate pending amount when total amount or paid amount changes
      if (field === 'totalAmount' || field === 'paidAmount') {
        const total = parseFloat(newData.totalAmount) || 0
        const paid = parseFloat(newData.paidAmount) || 0
        const pending = total - paid
        newData.pendingAmount = pending >= 0 ? pending.toFixed(2) : "0.00"
        
        // Update payment status based on amounts
        if (paid === 0) {
          newData.paymentStatus = "pending"
        } else if (paid >= total) {
          newData.paymentStatus = "paid"
        } else {
          newData.paymentStatus = "partial"
        }
      }
      
      return newData
    })
    
    // Clear station suggestions when service type changes
    if (field === 'service') {
      setFromSuggestions([])
      setToSuggestions([])
    }
  }

  const handleStationSearch = (value: string, type: 'from' | 'to') => {
    if (formData.service !== 'train') {
      return // Only show station suggestions for train service
    }
    
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
    setFormData(prev => ({
      ...prev,
      [type === 'from' ? 'fromLocation' : 'toLocation']: station.name
    }))
    if (type === 'from') {
      setFromSuggestions([])
    } else {
      setToSuggestions([])
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromInputRef.current && !fromInputRef.current.contains(event.target as Node)) {
        setFromSuggestions([])
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target as Node)) {
        setToSuggestions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string) => {
    const newPassengerDetails = [...formData.passengerDetails]
    newPassengerDetails[index] = {
      ...newPassengerDetails[index],
      [field]: value
    }
    setFormData(prev => ({ ...prev, passengerDetails: newPassengerDetails }))
  }

  const addPassenger = () => {
    if (formData.passengerDetails.length >= 10) {
      toast({
        title: "Maximum Passengers Reached",
        description: "You can only add up to 10 passengers.",
        variant: "destructive",
      })
      return
    }
    setFormData(prev => ({
      ...prev,
      passengerDetails: [...prev.passengerDetails, { name: "", age: "", gender: "" }]
    }))
  }

  const removePassenger = (index: number) => {
    if (formData.passengerDetails.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one passenger is required.",
        variant: "destructive",
      })
      return
    }
    const newPassengerDetails = formData.passengerDetails.filter((_, i) => i !== index)
    setFormData(prev => ({ 
      ...prev, 
      passengerDetails: newPassengerDetails,
      passengers: newPassengerDetails.length.toString()
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.customerPhone || formData.customerPhone.length !== 10) {
      toast({
        title: "Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive"
      })
      return
    }
    
    if (!bookingDate) {
      toast({
        title: "Error",
        description: "Booking date is required",
        variant: "destructive"
      })
      return
    }
    
    if (!travelDate) {
      toast({
        title: "Error", 
        description: "Travel date is required",
        variant: "destructive"
      })
      return
    }
    
    // Validate PDF upload for ticket_booked status
    if ((formData.status === 'ticket_booked' || formData.status === 'confirmed') && !formData.ticketPdf) {
      toast({
        title: "Error",
        description: "Please upload ticket PDF for confirmed bookings",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)

    try {
      const token = localStorage.getItem('admin_token')
      
      // Upload PDF if exists
      let ticketPdfUrl = ''
      if (formData.ticketPdf) {
        const formDataUpload = new FormData()
        formDataUpload.append('ticket_pdf', formData.ticketPdf)
        
        const uploadResponse = await fetch('/api/admin/upload-ticket.php', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          ticketPdfUrl = uploadData.url || uploadData.path || ''
        } else {
          toast({
            title: "Warning",
            description: "PDF upload failed, but continuing with booking creation",
            variant: "destructive"
          })
        }
      }
      
      const bookingData = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail,
        customer_address: formData.customerAddress,
        service: formData.service,
        from: formData.fromLocation,
        to: formData.toLocation,
        date: travelDate?.toISOString().split('T')[0],
        booking_date: bookingDate?.toISOString().split('T')[0],
        passengers: formData.passengerDetails.length,
        amount: parseFloat(formData.totalAmount), // Use total_amount as the main amount
        total_amount: parseFloat(formData.totalAmount),
        paid_amount: parseFloat(formData.paidAmount),
        pending_amount: parseFloat(formData.pendingAmount),
        status: formData.status,
        payment_status: formData.paymentStatus,
        notes: formData.notes,
        // Train details
        train_number: formData.trainNumber,
        train_name: formData.trainName,
        class: formData.trainClass,
        passenger_details: formData.passengerDetails,
        ticket_pdf_url: ticketPdfUrl
      }

      console.log('Sending booking data:', bookingData)

      const response = await fetch('/api/admin/bookings.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('Success response:', result)
        toast({
          title: "Booking Created Successfully! 🎉",
          description: "Customer and booking details have been saved.",
        })
        router.push('/admin/bookings')
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to create booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Catch error:', error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Customer & Booking</h1>
              <p className="text-gray-600 mt-2">Manually add customer details and create a booking</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      placeholder="Enter customer full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => {
                          // Only allow digits and limit to 10 digits
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                          handleInputChange("customerPhone", value)
                        }}
                        placeholder="Enter 10 digit phone number"
                        className="pl-10"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                    {formData.customerPhone && formData.customerPhone.length !== 10 && (
                      <p className="text-sm text-red-500">Phone number must be exactly 10 digits</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      placeholder="Enter email address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerAddress">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="customerAddress"
                      value={formData.customerAddress}
                      onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                      placeholder="Enter customer address"
                      className="pl-10 min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Type *</Label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="train">🚂 Train</SelectItem>
                        <SelectItem value="bus">🚌 Bus</SelectItem>
                        <SelectItem value="flight">✈️ Flight</SelectItem>
                        <SelectItem value="cab">🚗 Cab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fromLocation">From Location *</Label>
                    <div className="relative" ref={fromInputRef}>
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fromLocation"
                        value={formData.fromLocation}
                        onChange={(e) => {
                          handleInputChange("fromLocation", e.target.value)
                          handleStationSearch(e.target.value, 'from')
                        }}
                        placeholder={formData.service === 'train' ? "Enter departure station (e.g., New Delhi)" : "Enter departure location"}
                        className="pl-10"
                        required
                      />
                      {fromSuggestions.length > 0 && formData.service === 'train' && (
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
                  <div className="space-y-2">
                    <Label htmlFor="toLocation">To Location *</Label>
                    <div className="relative" ref={toInputRef}>
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="toLocation"
                        value={formData.toLocation}
                        onChange={(e) => {
                          handleInputChange("toLocation", e.target.value)
                          handleStationSearch(e.target.value, 'to')
                        }}
                        placeholder={formData.service === 'train' ? "Enter destination station (e.g., Mumbai Central)" : "Enter destination location"}
                        className="pl-10"
                        required
                      />
                      {toSuggestions.length > 0 && formData.service === 'train' && (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Travel Date *</Label>
                    <Popover open={travelDateOpen} onOpenChange={setTravelDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !travelDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {travelDate ? format(travelDate, "PPP") : "Select travel date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={travelDate}
                          onSelect={(date) => {
                            setTravelDate(date)
                            setTravelDateOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Booking Date *</Label>
                    <Popover open={bookingDateOpen} onOpenChange={setBookingDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingDate ? format(bookingDate, "PPP") : "Select booking date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookingDate}
                          onSelect={(date) => {
                            setBookingDate(date)
                            setBookingDateOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Amount (₹) *</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                      placeholder="Enter total booking amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="paidAmount">Paid Amount (₹)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const totalAmount = parseFloat(formData.totalAmount) || 0
                          setFormData(prev => ({
                            ...prev,
                            paidAmount: "0",
                            pendingAmount: totalAmount.toString(),
                            paymentStatus: "pending"
                          }))
                        }}
                        className="text-xs"
                      >
                        Reset
                      </Button>
                    </div>
                    <Input
                      id="paidAmount"
                      type="number"
                      value={formData.paidAmount}
                      onChange={(e) => handleInputChange("paidAmount", e.target.value)}
                      placeholder="Enter advance payment"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pendingAmount">Pending Amount (₹)</Label>
                    <Input
                      id="pendingAmount"
                      type="number"
                      value={formData.pendingAmount}
                      placeholder="Auto calculated"
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Booking Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_booking">🆕 New Booking</SelectItem>
                        <SelectItem value="ticket_booked">🎫 Ticket Booked</SelectItem>
                        <SelectItem value="not_booked">❌ Not Booked</SelectItem>
                        <SelectItem value="cancelled">🚫 Cancelled</SelectItem>
                        <SelectItem value="refund_amount">💰 Refund Amount</SelectItem>
                        <SelectItem value="pending_booking">⏳ Pending Booking</SelectItem>
                        <SelectItem value="ticket_delivery_paid_amount">✅ Ticket Delivery Paid Amount</SelectItem>
                        <SelectItem value="ticket_delivery_duse_amount">📦 Ticket Delivery Duse Amount</SelectItem>
                        <SelectItem value="pending_amount_by_customer">💳 Pending Amount By Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select value={formData.paymentStatus} onValueChange={(value) => handleInputChange("paymentStatus", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">⏳ Pending</SelectItem>
                        <SelectItem value="partial">💰 Partial</SelectItem>
                        <SelectItem value="paid">✅ Paid</SelectItem>
                        <SelectItem value="refunded">🔄 Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Enter any additional notes"
                    className="min-h-[100px]"
                  />
                </div>

                {/* PDF Upload - Show when status is ticket_booked or confirmed */}
                {(formData.status === 'ticket_booked' || formData.status === 'confirmed') && (
                  <div className="space-y-2">
                    <Label htmlFor="ticketPdf">Ticket PDF *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {formData.ticketPdf ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{formData.ticketPdf.name}</p>
                              <p className="text-sm text-gray-500">
                                {(formData.ticketPdf.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, ticketPdf: null, ticketPdfUrl: '' }))
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <Label htmlFor="ticketPdf" className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-700 font-medium">
                              Click to upload ticket PDF
                            </span>
                            <span className="text-gray-500 text-sm block mt-1">
                              PDF files only (Max 5MB)
                            </span>
                          </Label>
                          <Input
                            id="ticketPdf"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast({
                                    title: "File too large",
                                    description: "File size must be less than 5MB",
                                    variant: "destructive"
                                  })
                                  return
                                }
                                if (file.type !== 'application/pdf') {
                                  toast({
                                    title: "Invalid file type",
                                    description: "Please upload a PDF file",
                                    variant: "destructive"
                                  })
                                  return
                                }
                                setFormData(prev => ({ ...prev, ticketPdf: file }))
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Train Details - Only show when service is train */}
            {formData.service === 'train' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5" />
                    Train Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="trainNumber">Train Number</Label>
                      <Input
                        id="trainNumber"
                        value={formData.trainNumber}
                        onChange={(e) => handleInputChange("trainNumber", e.target.value)}
                        placeholder="e.g., 12301"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trainName">Train Name</Label>
                      <Input
                        id="trainName"
                        value={formData.trainName}
                        onChange={(e) => handleInputChange("trainName", e.target.value)}
                        placeholder="e.g., Rajdhani Express"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="trainClass">Class</Label>
                      <Select value={formData.trainClass} onValueChange={(value) => handleInputChange("trainClass", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1A">1A - First AC</SelectItem>
                          <SelectItem value="2A">2A - Second AC</SelectItem>
                          <SelectItem value="3A">3A - Third AC</SelectItem>
                          <SelectItem value="SL">SL - Sleeper</SelectItem>
                          <SelectItem value="CC">CC - Chair Car</SelectItem>
                          <SelectItem value="2S">2S - Second Sitting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Passenger Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Passenger Details
                  </div>
                  <Button type="button" onClick={addPassenger} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Passenger
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.passengerDetails.map((passenger, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Passenger {index + 1}</h4>
                      {formData.passengerDetails.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePassenger(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`passenger-${index}-name`}>Name *</Label>
                        <Input
                          id={`passenger-${index}-name`}
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                          placeholder="Enter passenger name"
                          required
                        />
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
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}









