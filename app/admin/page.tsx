"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  MapPin,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Ticket,
  RefreshCw,
  User
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalBookings: number
  totalUsers: number
  totalRevenue: number
  pendingBookings: number
  recentBookings: any[]
  monthlyStats: any[]
  statusCounts: {
    new_booking: number
    ticket_booked: number
    not_booked: number
    cancelled: number
    refund_amount: number
    pending_booking: number
    ticket_delivery_paid_amount: number
    ticket_delivery_duse_amount: number
    pending_amount_by_customer: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    recentBookings: [],
    monthlyStats: [],
    statusCounts: {
      new_booking: 0,
      ticket_booked: 0,
      not_booked: 0,
      cancelled: 0,
      refund_amount: 0,
      pending_booking: 0,
      ticket_delivery_paid_amount: 0,
      ticket_delivery_duse_amount: 0,
      pending_amount_by_customer: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/dashboard.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats({
            totalBookings: data.data.stats.total_bookings || 0,
            totalUsers: data.data.stats.total_users || 0,
            totalRevenue: data.data.stats.total_revenue || 0,
            pendingBookings: data.data.stats.pending_bookings || 0,
            recentBookings: data.data.recent_bookings || [],
            monthlyStats: [],
            statusCounts: data.data.status_counts || {
              new_booking: 0,
              ticket_booked: 0,
              not_booked: 0,
              cancelled: 0,
              refund_amount: 0,
              pending_booking: 0,
              ticket_delivery_paid_amount: 0,
              ticket_delivery_duse_amount: 0,
              pending_amount_by_customer: 0
            }
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: BookOpen,
      iconBg: "#2563eb",
      borderColor: "#2563eb"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      iconBg: "#16a34a",
      borderColor: "#16a34a"
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "#7c3aed",
      borderColor: "#7c3aed"
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: TrendingUp,
      iconBg: "#ea580c",
      borderColor: "#ea580c"
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Darbhanga Travels Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="bg-white p-6 border-l-4" style={{borderLeftColor: stat.borderColor}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{backgroundColor: stat.iconBg}}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Booking Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: 'new_booking', label: 'New Booking', icon: BookOpen, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', borderColor: 'border-blue-300' },
              { key: 'ticket_booked', label: 'Ticket Booked', icon: Ticket, color: 'bg-green-100 text-green-800 hover:bg-green-200', borderColor: 'border-green-300' },
              { key: 'not_booked', label: 'Not Booked', icon: XCircle, color: 'bg-gray-100 text-gray-800 hover:bg-gray-200', borderColor: 'border-gray-300' },
              { key: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800 hover:bg-red-200', borderColor: 'border-red-300' },
              { key: 'refund_amount', label: 'Refund Amount', icon: RefreshCw, color: 'bg-purple-100 text-purple-800 hover:bg-purple-200', borderColor: 'border-purple-300' },
              { key: 'pending_booking', label: 'Pending Booking', icon: Clock, color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200', borderColor: 'border-yellow-300' },
              { key: 'ticket_delivery_paid_amount', label: 'Ticket Delivery Paid', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200', borderColor: 'border-emerald-300' },
              { key: 'ticket_delivery_duse_amount', label: 'Ticket Delivery Duse', icon: Calendar, color: 'bg-orange-100 text-orange-800 hover:bg-orange-200', borderColor: 'border-orange-300' },
              { key: 'pending_amount_by_customer', label: 'Pending Amount', icon: DollarSign, color: 'bg-amber-100 text-amber-800 hover:bg-amber-200', borderColor: 'border-amber-300' }
            ].map((status) => (
              <motion.div
                key={status.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => router.push(`/admin/bookings?status=${status.key}`)}
                  className={`w-full p-4 rounded-lg border-2 ${status.borderColor} ${status.color} transition-all hover:shadow-md cursor-pointer text-left`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <status.icon className="h-5 w-5" />
                    <span className="text-2xl font-bold">{stats.statusCounts[status.key as keyof typeof stats.statusCounts] || 0}</span>
                  </div>
                  <p className="text-sm font-medium">{status.label}</p>
                </button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((booking, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => router.push('/admin/bookings')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">
                              Booking #{booking.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(() => {
                                const dateStr = booking.created_at || booking.booking_date
                                const d = dateStr ? new Date(dateStr) : null
                                return d && !isNaN(d.getTime()) ? d.toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                }) : 'N/A'
                              })()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-xl font-bold text-gray-900">
                            ₹{(booking.total_amount ?? booking.amount ?? 0).toLocaleString('en-IN')}
                          </p>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            booking.status === 'ticket_booked' || booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status?.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{booking.from_location || booking.from || 'N/A'}</span>
                          <span className="text-gray-400">→</span>
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span className="font-medium">{booking.to_location || booking.to || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {(() => {
                                const dateStr = booking.travel_date || booking.date
                                const d = dateStr ? new Date(dateStr) : null
                                return d && !isNaN(d.getTime()) ? d.toLocaleDateString('en-IN') : 'N/A'
                              })()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{booking.passengers || 1} passenger(s)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium uppercase">
                              {booking.service || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {booking.customer_name && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{booking.customer_name}</span>
                            {booking.customer_phone && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span>{booking.customer_phone}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No recent bookings</p>
                    <p className="text-gray-400 text-sm mt-1">New bookings will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Quick Stats Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2" />
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="font-bold text-blue-600">{stats.totalBookings}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-bold text-yellow-600">{stats.pendingBookings}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-bold text-green-600">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Users</span>
                <span className="font-bold text-purple-600">{stats.totalUsers}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Plus className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => router.push('/admin/bookings')} 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
              <Button 
                onClick={() => router.push('/admin/customers')} 
                className="w-full justify-start" 
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Customers
              </Button>
              <Button 
                onClick={() => router.push('/admin/users')} 
                className="w-full justify-start" 
                variant="outline"
              >
                <User className="h-4 w-4 mr-2" />
                Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}









