"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StampBadge } from "@/components/ui/stamp-badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Search, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Train,
  Users
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { format, startOfDay, endOfDay, subDays, addDays } from "date-fns"
import { cn } from "@/lib/utils"

interface CustomerBooking {
  id: number
  customer_id: number
  service: string
  from_location: string
  to_location: string
  travel_date: string
  booking_date?: string
  passengers: number
  amount: number
  total_amount?: number
  paid_amount?: number
  pending_amount?: number
  status: string
  payment_status: string
  notes: string
  created_at: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  train_number?: string
  train_name?: string
  class?: string
  passenger_details?: Array<{
    name: string
    age: string
    gender: string
  }>
}

export default function CustomerBookingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<CustomerBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday" | "tomorrow">("all")

  useEffect(() => {
    const dateParam = searchParams?.get('date')
    if (dateParam && ['today', 'yesterday', 'tomorrow'].includes(dateParam)) {
      setDateFilter(dateParam as "today" | "yesterday" | "tomorrow")
    }
    fetchCustomerBookings()
  }, [searchParams])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, dateFilter])

  const fetchCustomerBookings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/customer-bookings.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Customer bookings API response:', result)
        
        if (result.success && result.data) {
          console.log('Found bookings:', result.data.length)
          setBookings(result.data)
        } else {
          console.log('No bookings data in response:', result)
          setBookings([])
        }
      } else {
        const errorText = await response.text()
        console.error('API error response:', response.status, errorText)
        toast({
          title: "Error",
          description: `Failed to fetch customer bookings: ${response.status}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to fetch customer bookings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch customer bookings. Please check if PHP backend is running.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_phone?.includes(searchTerm) ||
        booking.from_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.to_location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date()
      const todayStart = startOfDay(today)
      const todayEnd = endOfDay(today)
      const yesterdayStart = startOfDay(subDays(today, 1))
      const yesterdayEnd = endOfDay(subDays(today, 1))
      const tomorrowStart = startOfDay(addDays(today, 1))
      const tomorrowEnd = endOfDay(addDays(today, 1))

      filtered = filtered.filter(booking => {
        const bookingDate = booking.travel_date || booking.booking_date || booking.created_at
        if (!bookingDate) return false
        
        const date = new Date(bookingDate)
        
        if (dateFilter === "today") {
          return date >= todayStart && date <= todayEnd
        } else if (dateFilter === "yesterday") {
          return date >= yesterdayStart && date <= yesterdayEnd
        } else if (dateFilter === "tomorrow") {
          return date >= tomorrowStart && date <= tomorrowEnd
        }
        return true
      })
    }

    setFilteredBookings(filtered)
  }

  const handleAcceptBooking = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/customer-bookings.php`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: bookingId,
          action: 'accept'
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Booking accepted successfully"
        })
        fetchCustomerBookings()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to accept booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to accept booking:', error)
      toast({
        title: "Error",
        description: "Failed to accept booking",
        variant: "destructive"
      })
    }
  }

  const handleRejectBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to reject this booking?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/customer-bookings.php`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: bookingId,
          action: 'reject'
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Booking rejected successfully"
        })
        fetchCustomerBookings()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to reject booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to reject booking:', error)
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Bookings</h1>
          <p className="text-gray-600 mt-1">Review and accept customer bookings from frontend</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search bookings by customer name, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-6">
                  {/* Left Column - Booking Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-red-600">Sr No.: {booking.id}.</span>
                        <span className="text-sm text-gray-600">Order Date: {format(new Date(booking.created_at), 'dd-MM-yyyy')}</span>
                        <span className="text-sm text-gray-600">Booking ID: {booking.id}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Customer Name: </span>
                        <span className="font-semibold text-gray-900">{booking.customer_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Customer Mobile: </span>
                        <span className="font-semibold text-gray-900">{booking.customer_phone || 'N/A'}</span>
                      </div>
                      {booking.train_name && (
                        <div>
                          <span className="text-gray-600">Train No./Name: </span>
                          <span className="font-semibold text-gray-900">{booking.train_name}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Booking Date: </span>
                        <span className="font-semibold text-gray-900">
                          {format(new Date(booking.booking_date || booking.travel_date || booking.created_at), 'dd-MM-yyyy')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">From: </span>
                        <span className="font-semibold text-gray-900">{booking.from_location}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">To: </span>
                        <span className="font-semibold text-gray-900">{booking.to_location}</span>
                      </div>
                      {booking.class && (
                        <div>
                          <span className="text-gray-600">Class: </span>
                          <span className="font-semibold text-gray-900">{booking.class}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Total Fair: </span>
                        <span className="font-semibold text-gray-900">
                          ₹{parseFloat(booking.total_amount || booking.amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAcceptBooking(booking.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleRejectBooking(booking.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  {/* Right Sidebar - Date & Status */}
                  <div className="w-32 flex flex-col items-center bg-gray-100 rounded-lg p-4 my-4 mr-4">
                    {(booking.booking_date || booking.travel_date || booking.created_at) && (
                      <>
                        <div className="text-center mb-6">
                          <div className="text-5xl font-bold text-gray-900 mb-1">
                            {new Date(booking.booking_date || booking.travel_date || booking.created_at).getDate()}
                          </div>
                          <div className="text-sm font-semibold text-gray-700 uppercase">
                            {format(new Date(booking.booking_date || booking.travel_date || booking.created_at), 'MMM yyyy')}
                          </div>
                        </div>
                        <div className="w-full mt-auto flex justify-center">
                          <StampBadge status={booking.status} size="sm" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customer bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || dateFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No pending customer bookings at the moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

