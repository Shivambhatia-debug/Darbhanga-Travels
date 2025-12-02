"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Download
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: number
  customer_name: string
  customer_phone: string
  service: string
  from_location: string
  to_location: string
  travel_date: string
  passengers: number
  total_amount: number
  paid_amount: number
  pending_amount: number
  status: string
  payment_status: string
  ticket_pdf_url: string
  train_number: string
  train_name: string
}

export default function UserBookingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBookings(bookings)
    } else {
      const filtered = bookings.filter(booking => 
        booking.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.from_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.to_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.train_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toString().includes(searchQuery)
      )
      setFilteredBookings(filtered)
    }
  }, [searchQuery, bookings])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('user_token')
      if (!token) {
        router.push('/user/login')
        return
      }

      const response = await fetch('/api/user/verify.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        fetchBookings(data.user.id)
      } else {
        localStorage.removeItem('user_token')
        router.push('/user/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/user/login')
    }
  }

  const fetchBookings = async (userId: number) => {
    try {
      const token = localStorage.getItem('user_token')
      const response = await fetch(`/api/user/bookings.php?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
        setFilteredBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      const token = localStorage.getItem('user_token')
      const response = await fetch('/api/admin/bookings.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking deleted successfully"
        })
        setBookings(prev => prev.filter(b => b.id !== id))
        setFilteredBookings(prev => prev.filter(b => b.id !== id))
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
        description: "Network error",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'pending_booking': 'bg-yellow-100 text-yellow-800',
      'ticket_booked': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    }
    return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>{status.replace('_', ' ')}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      'paid': 'bg-green-100 text-green-800',
      'partial': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-red-100 text-red-800'
    }
    return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/user/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600">Manage your travel bookings</p>
            </div>
          </div>
          <Button onClick={() => router.push('/user/bookings/add')} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by booking ID, customer, location, train..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journey</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        {searchQuery ? "No bookings found matching your search" : "No bookings yet. Create your first booking!"}
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                          <div className="text-sm text-gray-500">{booking.customer_phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.from_location} → {booking.to_location}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.service.toUpperCase()} • {booking.passengers} pax
                            {booking.train_number && ` • ${booking.train_number}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.travel_date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{booking.total_amount}</div>
                          {booking.pending_amount > 0 && (
                            <div className="text-xs text-red-600">Pending: ₹{booking.pending_amount}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(booking.status)}
                            {getPaymentBadge(booking.payment_status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/user/bookings/${booking.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {booking.ticket_pdf_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(booking.ticket_pdf_url, '_blank')}
                                title="View Ticket PDF"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/user/bookings/add?bookingId=${booking.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(booking.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredBookings.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} booking(s)
          </div>
        )}
      </div>
    </div>
  )
}
