"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Calendar,
  IndianRupee,
  LogOut
} from "lucide-react"
import { motion } from "framer-motion"

interface Stats {
  totalBookings: number
  totalRevenue: number
}

export default function UserDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    checkAuth()
  }, [])

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
        setUserName(data.user.full_name || data.user.username)
        fetchStats(data.user.id)
      } else {
        localStorage.removeItem('user_token')
        router.push('/user/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/user/login')
    }
  }

  const fetchStats = async (userId: number) => {
    try {
      const token = localStorage.getItem('user_token')
      
      // Fetch bookings for this user only
      const bookingsResponse = await fetch(`/api/user/bookings.php?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        const bookings = bookingsData.bookings || []
        
        const totalRevenue = bookings.reduce((sum: number, booking: any) => 
          sum + parseFloat(booking.total_amount || booking.amount || 0), 0
        )
        
        setStats({
          totalBookings: bookings.length,
          totalRevenue: totalRevenue
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user_token')
    router.push('/user/login')
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Darbhanga Travels</h1>
              <p className="text-sm text-gray-600">Welcome, {userName}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Overview of your bookings and activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <IndianRupee className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => router.push('/user/bookings')}
                className="h-20 text-lg"
                variant="outline"
              >
                <BookOpen className="h-6 w-6 mr-3" />
                View All Bookings
              </Button>
              <Button 
                onClick={() => router.push('/user/bookings/add')}
                className="h-20 text-lg bg-green-600 hover:bg-green-700"
              >
                <Calendar className="h-6 w-6 mr-3" />
                Create New Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


