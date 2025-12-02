"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Train, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Wifi, 
  Utensils,
  Bed,
  Newspaper,
  Star,
  CheckCircle
} from "lucide-react"
// import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { trainService } from "@/lib/train-service"

interface TrainClass {
  code: string
  name: string
  fare: number
  availability: string
}

interface Train {
  trainNumber: string
  trainName: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  duration: string
  days: string[]
  classes: TrainClass[]
  type: string
  runningDays: string
  distance: number
  amenities: string[]
}

function TrainResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [trains, setTrains] = useState<Train[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>("")
  
  const searchData = {
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
    passengers: searchParams.get('passengers') || '1',
    class: searchParams.get('class') || ''
  }

  useEffect(() => {
    if (!searchData.from || !searchData.to || !searchData.date) {
      router.push('/train')
      return
    }
    
    fetchAvailableTrains()
  }, [])

  const fetchAvailableTrains = async () => {
    setIsLoading(true)
    
    try {
      // Use the TrainService API to fetch all available trains
      const response = await trainService.searchTrains({
        from: searchData.from,
        to: searchData.to,
        date: searchData.date,
        class: searchData.class || undefined
      })
      
      if (response.success) {
        setTrains(response.trains)
        toast({
          title: "Trains Found! 🚂",
          description: `Found ${response.trains.length} trains for your journey`,
        })
      } else {
        setTrains([])
        toast({
          title: "No Trains Found",
          description: "No trains available for the selected route and date.",
          variant: "destructive"
        })
      }
      
    } catch (error) {
      console.error('Error fetching trains:', error)
      toast({
        title: "Error",
        description: "Failed to fetch available trains. Please try again.",
        variant: "destructive"
      })
      setTrains([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrainSelect = (train: Train, classCode: string) => {
    setSelectedTrain(train)
    setSelectedClass(classCode)
  }

  const handleProceedToBooking = () => {
    if (!selectedTrain || !selectedClass) {
      toast({
        title: "Selection Required",
        description: "Please select a train and class to proceed.",
        variant: "destructive"
      })
      return
    }

    const selectedClassData = selectedTrain.classes.find(c => c.code === selectedClass)
    if (!selectedClassData) return

    // Get stored booking data from localStorage
    const storedBookingData = localStorage.getItem('bookingInfo')
    let baseBookingData = {}
    
    if (storedBookingData) {
      try {
        baseBookingData = JSON.parse(storedBookingData)
      } catch (error) {
        console.error('Error parsing stored booking data:', error)
      }
    }

    const bookingInfo = {
      ...baseBookingData, // Include all stored data (passenger details, phone, email)
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers,
      class: selectedClassData.name,
      classCode: selectedClass,
      train: selectedTrain.trainNumber,
      trainName: selectedTrain.trainName,
      departureTime: selectedTrain.departureTime,
      arrivalTime: selectedTrain.arrivalTime,
      duration: selectedTrain.duration,
      fare: selectedClassData.fare
    }

    localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo))
    router.push('/book/train')
  }

  const getAvailabilityColor = (availability: string) => {
    if (availability === "Available") return "bg-green-100 text-green-800"
    if (availability.includes("WL")) return "bg-yellow-100 text-yellow-800"
    if (availability.includes("RAC")) return "bg-blue-100 text-blue-800"
    return "bg-red-100 text-red-800"
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />
      case 'food': return <Utensils className="h-4 w-4" />
      case 'bedding': return <Bed className="h-4 w-4" />
      case 'newspaper': return <Newspaper className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div>
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/train')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Trains</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{searchData.from} → {searchData.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(searchData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{searchData.passengers} Passenger(s)</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {trains.map((train, index) => (
              <div
                key={train.trainNumber}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <Train className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{train.trainName}</CardTitle>
                          <p className="text-gray-600">Train No: {train.trainNumber}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{train.type}</Badge>
                            <span className="text-sm text-gray-500">{train.runningDays}</span>
                            <span className="text-sm text-gray-500">{train.distance} km</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {train.departureTime}
                        </div>
                        <div className="text-sm text-gray-500">Departure</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Journey Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Journey Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              <strong>Departure:</strong> {train.departureTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              <strong>Arrival:</strong> {train.arrivalTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              <strong>Duration:</strong> {train.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Available Classes */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Available Classes</h3>
                        <div className="space-y-2">
                          {train.classes.map((trainClass) => (
                            <div
                              key={trainClass.code}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                selectedTrain?.trainNumber === train.trainNumber && selectedClass === trainClass.code
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleTrainSelect(train, trainClass.code)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{trainClass.name}</div>
                                  <div className="text-sm text-gray-600">₹{trainClass.fare}</div>
                                </div>
                                <Badge className={getAvailabilityColor(trainClass.availability)}>
                                  {trainClass.availability}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {train.amenities.map((amenity) => (
                            <div key={amenity} className="flex items-center gap-1 text-sm text-gray-600">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {trains.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Train className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Trains Found</h3>
                <p className="text-gray-600 mb-4">
                  No trains are available for the selected route and date.
                </p>
                <Button onClick={() => router.push('/train')}>
                  Search Again
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedTrain && selectedClass && (
            <div
              className="fixed bottom-6 right-6 z-50"
            >
              <Card className="shadow-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">Selected Train</h3>
                      <p className="text-sm text-gray-600">
                        {selectedTrain.trainName} - {selectedClass}
                      </p>
                    </div>
                    <Button
                      onClick={handleProceedToBooking}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Proceed to Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TrainResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    }>
      <TrainResultsContent />
    </Suspense>
  )
}
