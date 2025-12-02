"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { StampBadge } from "@/components/ui/stamp-badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  Phone,
  Mail,
  Plus,
  X,
  MapPin,
  Train,
  Users
} from "lucide-react"
// import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfDay, endOfDay, subDays, addDays, isYesterday, isTomorrow } from "date-fns"
import { cn } from "@/lib/utils"

interface Booking {
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
  updated_at: string
  // Customer details
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  // User details (who created the booking)
  user_id?: number
  user_username?: string
  user_full_name?: string
  user_email?: string
  // Passenger details
  passenger_details?: Array<{
    name: string
    age: string
    gender: string
  }>
  // Train details
  train_number?: string
  train_name?: string
  class?: string
  departure_time?: string
  arrival_time?: string
  duration?: string
  fare_per_person?: number
  ticket_pdf_url?: string | null
}

export default function BookingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday" | "tomorrow">("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [action, setAction] = useState<string | null>(null)
  const [expandedBookings, setExpandedBookings] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    fetchBookings()
    
    // Handle URL parameters for edit/view actions
    const bookingId = searchParams.get('id')
    const actionParam = searchParams.get('action')
    const statusParam = searchParams.get('status')
    
    if (bookingId && actionParam) {
      setAction(actionParam)
      // Find the booking by ID
      const booking = bookings.find(b => b.id.toString() === bookingId)
      if (booking) {
        setSelectedBooking(booking)
      }
    }
    
    // Handle status filter from URL
    if (statusParam) {
      setStatusFilter(statusParam)
    }
    
    // Handle date filter from URL
    const dateParam = searchParams.get('date')
    if (dateParam && ['today', 'yesterday', 'tomorrow'].includes(dateParam)) {
      setDateFilter(dateParam as "today" | "yesterday" | "tomorrow")
    }
    
    // Handle user_id filter from URL
    const userIdParam = searchParams.get('user_id')
    if (userIdParam) {
      // Filter bookings by user_id
      const filtered = bookings.filter(b => b.user_id?.toString() === userIdParam)
      setFilteredBookings(filtered)
    }
  }, [searchParams, bookings])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter, serviceFilter, dateFilter])

  const normalizeStatus = (status: string | undefined | null) => {
    if (!status) return 'new_booking'
    const normalized = status.toLowerCase().replace(/\s+/g, '_')
    const statusMapping: Record<string, string> = {
      pending: 'pending_booking',
      pending_booking: 'pending_booking',
      confirmed: 'ticket_booked',
      booked: 'ticket_booked',
      ticket_booked: 'ticket_booked',
      completed: 'ticket_booked',
      partial_booking: 'pending_booking',
      not_booked: 'not_booked', // Preserve not_booked status
      cancelled: 'cancelled', // Preserve cancelled status
      refund_amount: 'refund_amount', // Preserve refund_amount status
      ticket_delivery_paid_amount: 'ticket_delivery_paid_amount',
      ticket_delivery_duse_amount: 'ticket_delivery_duse_amount',
      pending_amount_by_customer: 'pending_amount_by_customer',
    }
    return statusMapping[normalized] || normalized
  }

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/bookings.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const apiBookings = data.data || data.bookings || []
        const normalizedBookings: Booking[] = apiBookings.map((booking: any) => ({
          ...booking,
          status: booking.status || 'new_booking', // Keep original status, don't normalize
          ticket_pdf_url: booking.ticket_pdf_url ?? booking.ticketPdfUrl ?? null,
        }))
        setBookings(normalizedBookings)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.from_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.to_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    if (serviceFilter !== "all") {
      filtered = filtered.filter(booking => booking.service === serviceFilter)
    }

    // Date filter - filter by booking_date (priority), travel_date, or created_at
    if (dateFilter !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset to start of day
      
      const todayDateStr = format(today, 'yyyy-MM-dd')
      const yesterdayDateStr = format(subDays(today, 1), 'yyyy-MM-dd')
      const tomorrowDateStr = format(addDays(today, 1), 'yyyy-MM-dd')

      filtered = filtered.filter(booking => {
        // Priority: booking_date > travel_date > created_at
        const bookingDate = booking.booking_date || booking.travel_date || booking.created_at
        if (!bookingDate) return false
        
        try {
          const date = new Date(bookingDate)
          
          // Validate date
          if (isNaN(date.getTime())) {
            return false
          }
          
          // Normalize both dates to YYYY-MM-DD for comparison (ignoring time)
          const bookingDateStr = format(date, 'yyyy-MM-dd')
          
          if (dateFilter === "today") {
            return bookingDateStr === todayDateStr
          } else if (dateFilter === "yesterday") {
            return bookingDateStr === yesterdayDateStr
          } else if (dateFilter === "tomorrow") {
            return bookingDateStr === tomorrowDateStr
          }
        } catch (error) {
          console.error('Error parsing booking date:', bookingDate, error)
          return false
        }
        return true
      })
    }

    setFilteredBookings(filtered)
  }

  // Calendar helper functions
  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date || booking.travel_date || booking.created_at)
      return isSameDay(bookingDate, date)
    })
  }

  const getBookingCountsForDate = (date: Date) => {
    const dayBookings = getBookingsForDate(date)
    const counts = {
      total: dayBookings.length,
      new_booking: dayBookings.filter(b => b.status === 'new_booking').length,
      ticket_booked: dayBookings.filter(b => b.status === 'ticket_booked').length,
      not_booked: dayBookings.filter(b => b.status === 'not_booked').length,
      cancelled: dayBookings.filter(b => b.status === 'cancelled').length,
      refund_amount: dayBookings.filter(b => b.status === 'refund_amount').length,
      pending_booking: dayBookings.filter(b => b.status === 'pending_booking').length,
      ticket_delivery_paid_amount: dayBookings.filter(b => b.status === 'ticket_delivery_paid_amount').length,
      ticket_delivery_duse_amount: dayBookings.filter(b => b.status === 'ticket_delivery_duse_amount').length,
      pending_amount_by_customer: dayBookings.filter(b => b.status === 'pending_amount_by_customer').length
    }
    return counts
  }

  const getCalendarDays = () => {
    const start = startOfMonth(selectedDate)
    const end = endOfMonth(selectedDate)
    return eachDayOfInterval({ start, end })
  }

  const getStatusBadge = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      new_booking: "New Booking",
      ticket_booked: "Ticket Booked",
      not_booked: "Not Booked",
      cancelled: "Cancelled",
      refund_amount: "Refund Amount",
      pending_booking: "Pending Booking",
      ticket_delivery_paid_amount: "Ticket Delivery Paid Amount",
      ticket_delivery_duse_amount: "Ticket Delivery Duse Amount",
      pending_amount_by_customer: "Pending Amount By Customer"
    }
    
    const colors: { [key: string]: string } = {
      new_booking: "bg-blue-100 text-blue-800",
      ticket_booked: "bg-green-100 text-green-800",
      not_booked: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      refund_amount: "bg-purple-100 text-purple-800",
      pending_booking: "bg-yellow-100 text-yellow-800",
      ticket_delivery_paid_amount: "bg-emerald-100 text-emerald-800",
      ticket_delivery_duse_amount: "bg-orange-100 text-orange-800",
      pending_amount_by_customer: "bg-amber-100 text-amber-800"
    }
    
    const displayText = statusLabels[status] || status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {displayText}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      partial: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800"
    }
    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleViewBooking = (bookingId: number) => {
    setExpandedBookings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId)
      } else {
        newSet.add(bookingId)
      }
      return newSet
    })
  }

  const isBookingExpanded = (bookingId: number) => {
    return expandedBookings.has(bookingId)
  }

  const handleEditBooking = (bookingId: number) => {
    const booking = bookings.find(b => b.id === bookingId)
    if (booking) {
      setSelectedBooking(booking)
      setAction('edit')
    }
  }

  const closeModal = () => {
    setSelectedBooking(null)
    setAction(null)
    // Clear URL parameters
    router.push('/admin/bookings')
  }

  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/bookings.php`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: bookingId })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking deleted successfully",
        })
        fetchBookings()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSaveBooking = async () => {
    if (!selectedBooking) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/bookings.php`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedBooking.id,
          service: selectedBooking.service,
          from_location: selectedBooking.from_location,
          to_location: selectedBooking.to_location,
          travel_date: selectedBooking.travel_date,
          booking_date: selectedBooking.booking_date,
          passengers: selectedBooking.passengers,
          amount: selectedBooking.amount,
          total_amount: selectedBooking.total_amount ?? selectedBooking.amount,
          paid_amount: selectedBooking.paid_amount ?? 0,
          pending_amount: (selectedBooking.total_amount ?? selectedBooking.amount) - (selectedBooking.paid_amount ?? 0),
          status: selectedBooking.status,
          payment_status: selectedBooking.payment_status,
          notes: selectedBooking.notes,
          ticket_pdf_url: selectedBooking.ticket_pdf_url ?? null,
          // Customer details
          customer_name: selectedBooking.customer_name,
          customer_phone: selectedBooking.customer_phone,
          customer_email: selectedBooking.customer_email,
          // Train details
          train_number: selectedBooking.train_number,
          train_name: selectedBooking.train_name,
          class: selectedBooking.class,
          departure_time: selectedBooking.departure_time,
          arrival_time: selectedBooking.arrival_time,
          duration: selectedBooking.duration,
          fare_per_person: selectedBooking.fare_per_person,
          // Passenger details
          passenger_details: selectedBooking.passenger_details
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking updated successfully",
        })
        fetchBookings()
        closeModal()
      } else {
        toast({
          title: "Error",
          description: "Failed to update booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUpdatePayment = async () => {
    if (!selectedBooking) return

    try {
      const token = localStorage.getItem('admin_token')
      const pending = Math.max(
        (selectedBooking.total_amount ?? selectedBooking.amount ?? 0) - (selectedBooking.paid_amount ?? 0),
        0
      )
      const response = await fetch(`/api/admin/bookings.php`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedBooking.id,
          total_amount: selectedBooking.total_amount ?? selectedBooking.amount ?? 0,
          paid_amount: selectedBooking.paid_amount ?? 0,
          pending_amount: pending,
          payment_status: selectedBooking.payment_status ?? 'pending',
          // Send minimal required fields to avoid overwriting others
          service: selectedBooking.service,
          from_location: selectedBooking.from_location,
          to_location: selectedBooking.to_location,
          travel_date: selectedBooking.travel_date,
          booking_date: selectedBooking.booking_date,
          passengers: selectedBooking.passengers,
          amount: selectedBooking.amount,
          status: selectedBooking.status,
          notes: selectedBooking.notes,
          ticket_pdf_url: selectedBooking.ticket_pdf_url ?? null
        })
      })

      if (response.ok) {
        toast({ title: 'Success', description: 'Payment updated successfully' })
        fetchBookings()
        closeModal()
      } else {
        toast({ title: 'Error', description: 'Failed to update payment', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' })
    }
  }

  const handleExport = () => {
    if (filteredBookings.length === 0) {
      toast({
        title: "No Data",
        description: "No bookings to export",
        variant: "destructive"
      })
      return
    }

    // Create CSV content
    const headers = ['ID', 'Service', 'From', 'To', 'Travel Date', 'Booking Date', 'Passengers', 'Total Amount', 'Paid Amount', 'Pending Amount', 'Status', 'Payment Status', 'Notes', 'Created At']
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(booking => [
        booking.id,
        booking.service,
        `"${booking.from_location}"`,
        `"${booking.to_location}"`,
        booking.travel_date,
        booking.booking_date || '',
        booking.passengers,
        booking.total_amount || booking.amount,
        booking.paid_amount || 0,
        booking.pending_amount || 0,
        booking.status,
        booking.payment_status,
        `"${booking.notes || ''}"`,
        booking.created_at
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: `Exported ${filteredBookings.length} bookings`,
    })
  }

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    console.log('🔄 Status Update Started:', { bookingId, newStatus })
    
    try {
      const token = localStorage.getItem('admin_token')
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) {
        console.error('❌ Booking not found:', bookingId)
        return
      }

      console.log('📤 Sending update request...')
      
      const response = await fetch(`/api/admin/bookings.php`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: bookingId,
          service: booking.service,
          from_location: booking.from_location,
          to_location: booking.to_location,
          travel_date: booking.travel_date,
          booking_date: booking.booking_date,
          passengers: booking.passengers,
          amount: booking.amount,
          total_amount: booking.total_amount ?? booking.amount,
          paid_amount: booking.paid_amount ?? 0,
          pending_amount: booking.pending_amount ?? 0,
          status: newStatus,
          payment_status: booking.payment_status,
          notes: booking.notes,
          ticket_pdf_url: booking.ticket_pdf_url ?? null,
          customer_name: booking.customer_name,
          customer_phone: booking.customer_phone,
          customer_email: booking.customer_email,
          train_number: booking.train_number,
          train_name: booking.train_name,
          class: booking.class,
          departure_time: booking.departure_time,
          arrival_time: booking.arrival_time,
          duration: booking.duration,
          fare_per_person: booking.fare_per_person,
          passenger_details: booking.passenger_details
        })
      })

      console.log('📥 Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Update successful:', result)
        
        // Immediately update local state with the new status (preserve exact status)
        setBookings(prevBookings => 
          prevBookings.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
          )
        )
        
        const statusDisplayName = newStatus === 'new_booking' ? 'New Booking' :
                                  newStatus === 'not_booked' ? 'Not Booked' :
                                  newStatus === 'ticket_booked' ? 'Ticket Booked' :
                                  newStatus === 'pending_booking' ? 'Pending Booking' :
                                  newStatus === 'cancelled' ? 'Cancelled' :
                                  newStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        
        toast({
          title: "Status Updated",
          description: `Changed to ${statusDisplayName}`,
        })
        
        // Don't refresh - status is already updated in local state
        // The server has the correct status, we'll get it on next page load
      } else {
        const errorData = await response.json()
        console.error('❌ Update failed:', errorData)
        toast({
          title: "Error",
          description: errorData.message || "Failed to update booking status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('❌ Status update error:', error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handlePaymentStatusUpdate = async (bookingId: number, newPaymentStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) return

      const response = await fetch(`/api/admin/bookings.php`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: bookingId,
          service: booking.service,
          from_location: booking.from_location,
          to_location: booking.to_location,
          travel_date: booking.travel_date,
          booking_date: booking.booking_date,
          passengers: booking.passengers,
          amount: booking.amount,
          total_amount: booking.total_amount,
          paid_amount: booking.paid_amount,
          pending_amount: booking.pending_amount,
          status: booking.status,
          payment_status: newPaymentStatus,
          notes: booking.notes,
          ticket_pdf_url: booking.ticket_pdf_url ?? null
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment status updated successfully",
        })
        fetchBookings()
      } else {
        toast({
          title: "Error",
          description: "Failed to update payment status",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bookings Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <p className="text-gray-600">Manage all customer bookings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/admin/customers/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new_booking">New Booking</SelectItem>
                <SelectItem value="ticket_booked">Ticket Booked</SelectItem>
                <SelectItem value="not_booked">Not Booked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refund_amount">Refund Amount</SelectItem>
                <SelectItem value="pending_booking">Pending Booking</SelectItem>
                <SelectItem value="ticket_delivery_paid_amount">Ticket Delivery Paid Amount</SelectItem>
                <SelectItem value="ticket_delivery_duse_amount">Ticket Delivery Duse Amount</SelectItem>
                <SelectItem value="pending_amount_by_customer">Pending Amount By Customer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="cab">Cab</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List or Calendar View */}
      {viewMode === 'list' ? (
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
            <div
              key={booking.id}
            >
              <Card>
                <CardContent className="p-0 bg-white border border-gray-200">
                  <div className="flex gap-4">
                    {/* Left Side - Main Content */}
                    <div className="flex-1 p-4">
                      {/* Header Section */}
                      <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-gray-200 bg-blue-50 px-3 py-2 rounded">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <div className="text-sm">
                              <span className="text-gray-600">Sr No.: </span>
                              <span className="font-bold text-red-600">{booking.id}.</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Order Date: </span>
                            <span className="font-semibold">{format(new Date(booking.created_at), 'dd-MM-yyyy')}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Time: </span>
                            <span className="font-semibold">
                              {format(new Date(booking.created_at), 'HH:mm:ss')}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Booking ID: </span>
                            <span className="font-semibold">{booking.id}</span>
                          </div>
                          {booking.ticket_pdf_url && (
                            <Button 
                              size="sm" 
                              variant="link"
                              className="text-blue-600 h-auto p-0"
                              onClick={() => window.open(booking.ticket_pdf_url as string, '_blank')}
                            >
                              Ticket
                            </Button>
                          )}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            // Convert user_id to number for proper comparison
                            const userId = booking.user_id ? Number(booking.user_id) : 0;
                            
                            // Determine if it's a customer booking or admin/user booking
                            const isCustomerBooking = userId === 0 || !booking.user_full_name || !booking.user_username;
                            
                            return (
                              <>
                                <span className="text-gray-600">
                                  {isCustomerBooking ? 'Booking By Customer: ' : 'Booking By User: '}
                                </span>
                                <span className="font-semibold">
                                  {(() => {
                                    // If user_id exists and is valid (> 0), show user info or Admin
                                    if (userId > 0 && booking.user_full_name) {
                                      return booking.user_full_name || booking.user_username || 'Admin';
                                    }
                                    
                                    // If user_id is null/0/undefined OR user fields are null/empty,
                                    // it's a customer booking from frontend - show customer name
                                    if (userId === 0 || !booking.user_full_name || !booking.user_username) {
                                      return booking.customer_name || 'Customer';
                                    }
                                    
                                    // Fallback
                                    return booking.customer_name || 'Customer';
                                  })()}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Two Column Layout */}
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        {/* Left Column */}
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Customer Name: </span>
                            <span className="font-semibold text-gray-900">{booking.customer_name || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Train No./Name: </span>
                            <span className="font-semibold text-gray-900">{booking.train_name || booking.train_number || 'ANY TRAIN'}</span>
                          </div>
                          {booking.train_number && booking.train_number !== booking.train_name && (
                            <div>
                              <span className="text-gray-600">Train No: </span>
                              <span className="font-semibold text-gray-900">{booking.train_number}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">From: </span>
                            <span className="font-semibold text-gray-900">{booking.from_location}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quota: </span>
                            <span className="font-semibold text-gray-900">{booking.class || 'TQ'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Fair: </span>
                            <span className="font-semibold text-gray-900">₹{(parseFloat(booking.total_amount || booking.amount || 0) || 0).toFixed(2)}</span>
                          </div>
                          {booking.notes && (
                            <div>
                              <span className="text-gray-600">Remarks: </span>
                              <span className="font-semibold text-red-600">{booking.notes}</span>
                            </div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Customer Mobile: </span>
                            <span className="font-semibold text-gray-900">{booking.customer_phone || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Booking Date: </span>
                            <span className="font-semibold text-gray-900">
                              {format(new Date(booking.booking_date || booking.travel_date || booking.created_at), 'dd-MM-yyyy')}
                            </span>
                          </div>
                          {booking.travel_date && (
                            <div>
                              <span className="text-gray-600">Travel Date: </span>
                              <span className="font-semibold text-gray-900">
                                {format(new Date(booking.travel_date), 'dd-MM-yyyy')}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">To: </span>
                            <span className="font-semibold text-gray-900">{booking.to_location}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Class: </span>
                            <span className="font-semibold text-gray-900">{booking.class || 'SL'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Advance Amt: </span>
                            <span className="font-semibold text-green-600">₹{(parseFloat(booking.paid_amount || 0) || 0).toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Next Paid Amt: </span>
                            <span className="font-semibold text-green-600">₹0.00</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Panding Amt: </span>
                            <span className="font-semibold text-red-600">₹{(() => {
                              const total = parseFloat(booking.total_amount || booking.amount || 0) || 0;
                              const paid = parseFloat(booking.paid_amount || 0) || 0;
                              const pending = parseFloat(booking.pending_amount || 0) || (total - paid);
                              return pending.toFixed(2);
                            })()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleViewBooking(booking.id)}
                        >
                          {expandedBookings.has(booking.id) ? "Show less" : "Read more"}
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleEditBooking(booking.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>

                      {/* Expanded Details Section - Only Passenger Details */}
                      {expandedBookings.has(booking.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {/* Passenger Details */}
                          {booking.passenger_details && booking.passenger_details.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Passenger Details
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {booking.passenger_details.map((passenger, idx) => (
                                  <div key={idx} className="p-3 bg-gray-50 rounded-md">
                                    <p className="font-medium text-sm text-gray-900">{passenger.name || `Passenger ${idx + 1}`}</p>
                                    <p className="text-xs text-gray-600">Age: {passenger.age || 'N/A'} | Gender: {passenger.gender || 'N/A'}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="cursor-pointer hover:opacity-80 transition-opacity">
                                  <StampBadge status={booking.status} size="md" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-2">
                                <div className="space-y-1">
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'new_booking')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    New Booking
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'ticket_booked')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Ticket Booked
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'pending_booking')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Pending Booking
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'not_booked')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Not Booked
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Cancelled
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'refund_amount')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Refund Amount
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'ticket_delivery_paid_amount')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Ticket Delivery Paid Amount
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'ticket_delivery_duse_amount')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Ticket Delivery Duse Amount
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'pending_amount_by_customer')}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    Pending Amount By Customer
                                  </button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || serviceFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No bookings have been created yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      ) : (
        /* Calendar View */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Bookings Calendar - {format(selectedDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                  >
                    Next
                  </Button>
    </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((date, index) => {
                  const counts = getBookingCountsForDate(date)
                  const isCurrentMonth = date.getMonth() === selectedDate.getMonth()
                  const isCurrentDay = isToday(date)
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                        !isCurrentMonth && "bg-gray-100 text-gray-400",
                        isCurrentDay && "bg-blue-50 border-blue-200",
                        isSameDay(date, selectedDate) && "bg-blue-100 border-blue-300 ring-2 ring-blue-200"
                      )}
                      onClick={() => {
                        setSelectedDate(date)
                        // Show bookings for this date in the list below
                      }}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(date, 'd')}
                      </div>
                      {counts.total > 0 && (
                        <div className="space-y-1">
                          {counts.new_booking > 0 && (
                            <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                              {counts.new_booking} New
                            </div>
                          )}
                          {counts.ticket_booked > 0 && (
                            <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                              {counts.ticket_booked} Booked
                            </div>
                          )}
                          {counts.pending_booking > 0 && (
                            <div className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                              {counts.pending_booking} Pending
                            </div>
                          )}
                          {counts.cancelled > 0 && (
                            <div className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                              {counts.cancelled} Cancelled
                            </div>
                          )}
                          {counts.pending_amount_by_customer > 0 && (
                            <div className="text-xs bg-amber-100 text-amber-800 px-1 py-0.5 rounded">
                              {counts.pending_amount_by_customer} Pending Amt
                            </div>
                          )}
                        </div>
                      )}
    </div>
  )
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Selected Date Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bookings for {format(selectedDate, 'PPP')}
                <Badge variant="outline" className="ml-2">
                  {getBookingsForDate(selectedDate).length} booking{getBookingsForDate(selectedDate).length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getBookingsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getBookingsForDate(selectedDate).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">#{booking.id}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-lg">{booking.service.charAt(0).toUpperCase() + booking.service.slice(1)} Booking</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {booking.from_location} → {booking.to_location}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Passengers: {booking.passengers}</span>
                            <span>Amount: ₹{booking.total_amount || booking.amount}</span>
                            {booking.customer_name && <span>Customer: {booking.customer_name}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <Select 
                            key={`cal-status-${booking.id}-${booking.status}`}
                            value={booking.status} 
                            onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new_booking">New Booking</SelectItem>
                              <SelectItem value="ticket_booked">Ticket Booked</SelectItem>
                              <SelectItem value="not_booked">Not Booked</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="refund_amount">Refund Amount</SelectItem>
                              <SelectItem value="pending_booking">Pending Booking</SelectItem>
                              <SelectItem value="ticket_delivery_paid_amount">Ticket Delivery Paid</SelectItem>
                              <SelectItem value="ticket_delivery_duse_amount">Ticket Delivery Due</SelectItem>
                              <SelectItem value="pending_amount_by_customer">Pending Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select 
                            value={booking.payment_status} 
                            onValueChange={(value) => handlePaymentStatusUpdate(booking.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBooking(booking.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBooking(booking.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No bookings for this date</p>
                  <p className="text-sm">Click on a date with bookings to see details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal for Edit/View */}
      {selectedBooking && action && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {action === 'edit' ? 'Edit Booking' : 'View Booking'} - #{selectedBooking.id}
                </h2>
                <Button variant="outline" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <Input 
                      value={selectedBooking.service} 
                      disabled={action === 'view'}
                      onChange={(e) => setSelectedBooking({...selectedBooking, service: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select 
                      value={selectedBooking.status} 
                      disabled={action === 'view'}
                      onValueChange={(value) => setSelectedBooking({...selectedBooking, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_booking">New Booking</SelectItem>
                        <SelectItem value="ticket_booked">Ticket Booked</SelectItem>
                        <SelectItem value="not_booked">Not Booked</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refund_amount">Refund Amount</SelectItem>
                        <SelectItem value="pending_booking">Pending Booking</SelectItem>
                        <SelectItem value="ticket_delivery_paid_amount">Ticket Delivery Paid Amount</SelectItem>
                        <SelectItem value="ticket_delivery_duse_amount">Ticket Delivery Duse Amount</SelectItem>
                        <SelectItem value="pending_amount_by_customer">Pending Amount By Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">From</label>
                    <Input 
                      value={selectedBooking.from_location} 
                      disabled={action === 'view'}
                      onChange={(e) => setSelectedBooking({...selectedBooking, from_location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">To</label>
                    <Input 
                      value={selectedBooking.to_location} 
                      disabled={action === 'view'}
                      onChange={(e) => setSelectedBooking({...selectedBooking, to_location: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Travel Date</label>
                    <Input 
                      type="date"
                      value={selectedBooking.travel_date} 
                      disabled={action === 'view'}
                      onChange={(e) => setSelectedBooking({...selectedBooking, travel_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Booking Date</label>
                    <Input 
                      type="date"
                      value={selectedBooking.booking_date || ''}
                      disabled={action === 'view'}
                      onChange={(e) => setSelectedBooking({...selectedBooking, booking_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Passengers</label>
                    <Input 
                      type="number"
                      value={selectedBooking.passengers} 
                      disabled={action === 'view'}
                      onChange={(e) => setSelectedBooking({...selectedBooking, passengers: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Customer Details Section */}
                <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Customer Name</label>
                      <Input 
                        value={selectedBooking.customer_name || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, customer_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input 
                        value={selectedBooking.customer_phone || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, customer_phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input 
                        type="email"
                        value={selectedBooking.customer_email || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, customer_email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Train Details Section */}
                <div className="mt-4 p-4 border rounded-lg bg-purple-50">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Train className="h-5 w-5" />
                    Train Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Train Number</label>
                      <Input 
                        value={selectedBooking.train_number || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, train_number: e.target.value})}
                        placeholder="e.g., 12301"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Train Name</label>
                      <Input 
                        value={selectedBooking.train_name || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, train_name: e.target.value})}
                        placeholder="e.g., Rajdhani Express"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Class</label>
                      <Select 
                        value={selectedBooking.class || ''} 
                        disabled={action === 'view'}
                        onValueChange={(value) => setSelectedBooking({...selectedBooking, class: value})}
                      >
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
                    <div>
                      <label className="block text-sm font-medium mb-1">Fare Per Person</label>
                      <Input 
                        type="number"
                        value={selectedBooking.fare_per_person || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, fare_per_person: parseFloat(e.target.value || '0')})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Departure Time</label>
                      <Input 
                        value={selectedBooking.departure_time || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, departure_time: e.target.value})}
                        placeholder="HH:MM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Arrival Time</label>
                      <Input 
                        value={selectedBooking.arrival_time || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, arrival_time: e.target.value})}
                        placeholder="HH:MM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration</label>
                      <Input 
                        value={selectedBooking.duration || ''} 
                        disabled={action === 'view'}
                        onChange={(e) => setSelectedBooking({...selectedBooking, duration: e.target.value})}
                        placeholder="e.g., 2h 30m"
                      />
                    </div>
                  </div>
                </div>

                {/* Passenger Details Section */}
                {selectedBooking.passenger_details && selectedBooking.passenger_details.length > 0 && (
                  <div className="mt-4 p-4 border rounded-lg bg-green-50">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Passenger Details
                    </h3>
                    <div className="space-y-3">
                      {selectedBooking.passenger_details.map((passenger: any, index: number) => (
                        <div key={index} className="p-3 bg-white rounded border">
                          <div className="font-medium mb-2">Passenger {index + 1}</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <Input 
                                value={passenger.name || ''} 
                                disabled={action === 'view'}
                                onChange={(e) => {
                                  const updatedPassengers = [...selectedBooking.passenger_details]
                                  updatedPassengers[index].name = e.target.value
                                  setSelectedBooking({...selectedBooking, passenger_details: updatedPassengers})
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Age</label>
                              <Input 
                                type="number"
                                value={passenger.age || ''} 
                                disabled={action === 'view'}
                                onChange={(e) => {
                                  const updatedPassengers = [...selectedBooking.passenger_details]
                                  updatedPassengers[index].age = parseInt(e.target.value || '0')
                                  setSelectedBooking({...selectedBooking, passenger_details: updatedPassengers})
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Gender</label>
                              <Select 
                                value={passenger.gender || ''} 
                                disabled={action === 'view'}
                                onValueChange={(value) => {
                                  const updatedPassengers = [...selectedBooking.passenger_details]
                                  updatedPassengers[index].gender = value
                                  setSelectedBooking({...selectedBooking, passenger_details: updatedPassengers})
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
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
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea 
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    value={selectedBooking.notes || ''} 
                    disabled={action === 'view'}
                    onChange={(e) => setSelectedBooking({...selectedBooking, notes: e.target.value})}
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Ticket PDF URL</label>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input 
                      value={selectedBooking.ticket_pdf_url || ''} 
                      disabled={action === 'view'}
                      onChange={(e) => setSelectedBooking({...selectedBooking, ticket_pdf_url: e.target.value})}
                      placeholder="https://example.com/ticket.pdf"
                    />
                    {selectedBooking.ticket_pdf_url && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedBooking.ticket_pdf_url as string, '_blank')}
                      >
                        Open PDF
                      </Button>
                    )}
                  </div>
                </div>

                {/* Payment Section */}
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Total Amount</label>
                      <Input 
                        type="number"
                        value={(selectedBooking.total_amount ?? selectedBooking.amount ?? 0).toString()}
                        disabled={action === 'view' ? false : false}
                        onChange={(e) => {
                          const total = parseFloat(e.target.value || '0')
                          const paid = selectedBooking.paid_amount ?? 0
                          setSelectedBooking({
                            ...selectedBooking,
                            total_amount: total,
                            pending_amount: Math.max(total - paid, 0)
                          })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Paid Amount (Advance)</label>
                      <Input 
                        type="number"
                        value={(selectedBooking.paid_amount ?? 0).toString()}
                        disabled={action === 'view' ? false : false}
                        onChange={(e) => {
                          const paid = parseFloat(e.target.value || '0')
                          const total = selectedBooking.total_amount ?? selectedBooking.amount ?? 0
                          setSelectedBooking({
                            ...selectedBooking,
                            paid_amount: paid,
                            pending_amount: Math.max(total - paid, 0)
                          })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pending Amount</label>
                      <Input 
                        type="number"
                        value={(selectedBooking.pending_amount ?? Math.max((selectedBooking.total_amount ?? selectedBooking.amount ?? 0) - (selectedBooking.paid_amount ?? 0), 0)).toString()}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Payment Status</label>
                      <Select 
                        value={selectedBooking.payment_status}
                        onValueChange={(value) => setSelectedBooking({...selectedBooking, payment_status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {action === 'view' && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUpdatePayment}>Update Payment</Button>
                      <Button variant="outline" onClick={closeModal}>Close</Button>
                    </div>
                  )}
                </div>
                
                {action === 'edit' && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveBooking}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



