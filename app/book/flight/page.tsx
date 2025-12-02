"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, ArrowLeft, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function FlightBookingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookingInfo, setBookingInfo] = useState<any>(null)

  useEffect(() => {
    const storedInfo = localStorage.getItem('bookingInfo')
    if (storedInfo) {
      setBookingInfo(JSON.parse(storedInfo))
    } else {
      router.push('/')
    }
  }, [router])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitBooking = async () => {
    if (!bookingInfo) return

    setIsSubmitting(true)

    try {
      const bookingData = {
        service: 'flight',
        from: bookingInfo.from,
        to: bookingInfo.to,
        date: new Date(bookingInfo.date).toISOString().split('T')[0],
        return_date: bookingInfo.returnDate ? new Date(bookingInfo.returnDate).toISOString().split('T')[0] : null,
        passengers: bookingInfo.passengers,
        customer_name: bookingInfo.passengerDetails[0]?.name || 'Customer',
        customer_phone: bookingInfo.phone,
        customer_email: '',
        amount: 0,
        status: 'pending',
        payment_status: 'pending',
        notes: `Class: ${bookingInfo.class || "Not Selected"}`,
        passenger_details: bookingInfo.passengerDetails,
        flight_number: bookingInfo.flight || '',
        seat_class: bookingInfo.class || ''
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Booking Submitted Successfully! 🎉",
          description: "Your booking request has been sent. We'll contact you soon.",
        })
        
        // Clear localStorage and redirect
        localStorage.removeItem('bookingInfo')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bookingInfo) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plane className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Flight Booking Details</CardTitle>
                  <p className="text-white/80 mt-1">Review and confirm your booking</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Journey Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">From:</span> {bookingInfo.from}</p>
                    <p><span className="font-medium">To:</span> {bookingInfo.to}</p>
                    <p><span className="font-medium">Departure Date:</span> {new Date(bookingInfo.date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Return Date:</span> {bookingInfo.returnDate ? new Date(bookingInfo.returnDate).toLocaleDateString() : "One Way"}</p>
                    <p><span className="font-medium">Class:</span> {bookingInfo.class}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Passenger Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Total Passengers:</span> {bookingInfo.passengers}</p>
                    {bookingInfo.passengerDetails.map((passenger: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">Passenger {index + 1}</p>
                        <p>Name: {passenger.name}</p>
                        <p>Age: {passenger.age} years</p>
                        <p>Gender: {passenger.gender}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={handleSubmitBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5 mr-2" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 