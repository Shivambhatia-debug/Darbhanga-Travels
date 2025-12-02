"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  IndianRupee,
  MapPin,
  Train,
  Users
} from "lucide-react"
import { motion } from "framer-motion"

interface Passenger {
  name: string
  age: string
  gender: string
}

interface Booking {
  id: number
  service: string
  from_location: string
  to_location: string
  travel_date: string
  booking_date: string
  passengers: number
  total_amount: number
  paid_amount: number
  pending_amount: number
  status: string
  payment_status: string
  notes: string
  customer_name: string
  customer_phone: string
  customer_email: string
  ticket_pdf_url: string
  train_number: string
  train_name: string
  class: string
  departure_time: string
  arrival_time: string
  duration: string
  fare_per_person: number
  passenger_details: Passenger[]
  created_at: string
}

const statusStyles: Record<string, string> = {
  new_booking: "bg-blue-100 text-blue-800",
  pending_booking: "bg-yellow-100 text-yellow-800",
  ticket_booked: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-purple-100 text-purple-800",
}

const paymentStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  partial: "bg-yellow-100 text-yellow-800",
  pending: "bg-red-100 text-red-800",
}

export default function UserBookingDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem("user_token")
      if (!token) {
        router.push("/user/login")
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/user/bookings.php?booking_id=${params.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setBooking(data.booking)
        } else if (response.status === 404) {
          setError("Booking not found")
        } else if (response.status === 401) {
          localStorage.removeItem("user_token")
          router.push("/user/login")
        } else {
          const data = await response.json().catch(() => null)
          setError(data?.message || "Failed to load booking")
        }
      } catch (err) {
        console.error("Failed to load booking", err)
        setError("Network error. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchBooking()
    }
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Unable to load booking</h2>
          <p className="text-gray-600">{error || "Booking details are unavailable."}</p>
          <Button onClick={() => router.push("/user/bookings")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Bookings
          </Button>
        </div>
      </div>
    )
  }

  const amountFormatter = (value: number | string | null | undefined) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`

  const travelDate = booking.travel_date ? new Date(booking.travel_date).toLocaleDateString("en-IN") : "N/A"
  const bookingDate = booking.booking_date ? new Date(booking.booking_date).toLocaleDateString("en-IN") : "N/A"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/user/bookings")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Bookings
          </Button>
          {booking.ticket_pdf_url && (
            <Button onClick={() => window.open(booking.ticket_pdf_url, "_blank")} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Download Ticket
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Booking #{booking.id}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Created on {new Date(booking.created_at).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={statusStyles[booking.status] || "bg-gray-100 text-gray-800"}>
                {booking.status.replace(/_/g, " ")}
              </Badge>
              <Badge className={paymentStyles[booking.payment_status] || "bg-gray-100 text-gray-800"}>
                {booking.payment_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="text-lg font-semibold text-gray-900 uppercase">{booking.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <IndianRupee className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{amountFormatter(booking.total_amount ?? booking.amount)}</p>
                  {booking.pending_amount > 0 && (
                    <p className="text-xs text-red-600 mt-1">Pending: {amountFormatter(booking.pending_amount)}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Journey Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-lg font-semibold text-gray-900">{booking.from_location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="text-lg font-semibold text-gray-900">{booking.to_location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-semibold text-gray-900">{travelDate}</p>
                  <p className="text-xs text-gray-500">Booked on {bookingDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="font-semibold text-gray-900">{booking.passengers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{booking.customer_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{booking.customer_phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{booking.customer_email || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {(booking.train_number || booking.train_name || booking.class) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5 text-purple-600" />
                Train Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.train_number && (
                <div>
                  <p className="text-sm text-gray-500">Train Number</p>
                  <p className="font-semibold text-gray-900">{booking.train_number}</p>
                </div>
              )}
              {booking.train_name && (
                <div>
                  <p className="text-sm text-gray-500">Train Name</p>
                  <p className="font-semibold text-gray-900">{booking.train_name}</p>
                </div>
              )}
              {booking.class && (
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-semibold text-gray-900">{booking.class}</p>
                </div>
              )}
              {booking.departure_time && (
                <div>
                  <p className="text-sm text-gray-500">Departure Time</p>
                  <p className="font-semibold text-gray-900">{booking.departure_time}</p>
                </div>
              )}
              {booking.arrival_time && (
                <div>
                  <p className="text-sm text-gray-500">Arrival Time</p>
                  <p className="font-semibold text-gray-900">{booking.arrival_time}</p>
                </div>
              )}
              {booking.duration && (
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">{booking.duration}</p>
                </div>
              )}
              {booking.fare_per_person && (
                <div>
                  <p className="text-sm text-gray-500">Fare / Passenger</p>
                  <p className="font-semibold text-gray-900">{amountFormatter(booking.fare_per_person)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {booking.passenger_details && booking.passenger_details.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Passenger Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.passenger_details.map((passenger, index) => (
                <motion.div
                  key={`${passenger.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="font-semibold text-gray-900">Passenger {index + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="text-gray-900">{passenger.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p className="text-gray-900">{passenger.age || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="text-gray-900 capitalize">{passenger.gender || "N/A"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {booking.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{booking.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

