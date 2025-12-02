// Train Service for integrating with real train data sources
// This integrates with Indian Railways train data

export interface Station {
  code: string
  name: string
  state: string
  zone?: string
}

export interface TrainClass {
  code: string
  name: string
  fare: number
  availability: string
  seats?: number
}

export interface Train {
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
  distance?: number
  amenities?: string[]
}

export interface TrainSearchParams {
  from: string
  to: string
  date: string
  class?: string
  quota?: string
}

export interface TrainSearchResponse {
  success: boolean
  trains: Train[]
  searchParams: TrainSearchParams
  totalTrains: number
  lastUpdated: string
}

class TrainService {
  // IndianRailAPI.com endpoint (Simple & Working!)
  private indianRailApiUrl = 'http://indianrailapi.com/api/v2'
  private apiKey = process.env.NEXT_PUBLIC_INDIAN_RAIL_API_KEY || ''
  
  private cache = new Map<string, any>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes
  private useRealApi = true // Enable by default if API key is available

  // Search trains based on route
  async searchTrains(params: TrainSearchParams): Promise<TrainSearchResponse> {
    const cacheKey = `trains_${params.from}_${params.to}_${params.date}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      let trains: Train[] = []
      
      // Try to fetch from IndianRailAPI if API key is available
      if (this.useRealApi && this.apiKey) {
        try {
          trains = await this.fetchFromIndianRailAPI(params)
          console.log('✅ Real-time data fetched from IndianRailAPI')
        } catch (apiError) {
          console.warn('⚠️ IndianRailAPI failed, using local database:', apiError)
          trains = await this.generateDynamicTrainData(params)
        }
      } else {
        // Use local database
        trains = await this.generateDynamicTrainData(params)
        console.log('📊 Using local train database (add API key for real-time data)')
      }
      
      const response: TrainSearchResponse = {
        success: true,
        trains,
        searchParams: params,
        totalTrains: trains.length,
        lastUpdated: new Date().toISOString()
      }

      // Cache the response
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      })

      return response
    } catch (error) {
      console.error('Train search error:', error)
      return {
        success: false,
        trains: [],
        searchParams: params,
        totalTrains: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  }

  // Fetch real-time data from IndianRailAPI
  private async fetchFromIndianRailAPI(params: TrainSearchParams): Promise<Train[]> {
    try {
      // IndianRailAPI endpoint: /TrainBetweenStation/apikey/{key}/From/{from}/To/{to}
      const url = `${this.indianRailApiUrl}/TrainBetweenStation/apikey/${this.apiKey}/From/${params.from}/To/${params.to}`
      
      console.log('🚂 Fetching from IndianRailAPI:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('IndianRailAPI error response:', errorText)
        throw new Error(`IndianRailAPI error: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ IndianRailAPI response:', data)
      
      // Check if API returned success
      if (data.ResponseCode !== "200" || data.Status !== "SUCCESS") {
        throw new Error(`API Error: ${data.Message || 'Unknown error'}`)
      }
      
      return this.mapIndianRailAPIResponse(data, params)
    } catch (error) {
      console.error('❌ IndianRailAPI error:', error)
      throw error
    }
  }

  // Map IndianRailAPI response to our format
  private mapIndianRailAPIResponse(data: any, params: TrainSearchParams): Train[] {
    if (!data.Trains || !Array.isArray(data.Trains)) return []

    console.log(`📊 Found ${data.TotalTrains} trains from API`)

    return data.Trains.map((train: any) => ({
      trainNumber: train.TrainNo || '',
      trainName: train.TrainName || '',
      from: params.from,
      to: params.to,
      departureTime: train.DepartureTime || '00:00',
      arrivalTime: train.ArrivalTime || '00:00',
      duration: train.TravelTime || '0h 0m',
      days: ['Daily'], // API doesn't provide this, assume daily
      classes: this.generateDefaultClasses(train.TrainType),
      type: this.getTrainType(train.TrainType),
      runningDays: 'Daily',
      distance: 0,
      amenities: this.getAmenities(train.TrainType || 'EXP')
    }))
  }

  // Generate default classes based on train type
  private generateDefaultClasses(trainType: string): TrainClass[] {
    const isSuperfast = trainType === 'SF' || trainType === 'RAJDHANI' || trainType === 'SHATABDI'
    const isExpress = trainType === 'EXP' || trainType === 'MAIL'
    
    if (isSuperfast) {
      return [
        { code: "1A", name: "AC First Class", fare: 2800, availability: "Available" },
        { code: "2A", name: "AC 2 Tier", fare: 1600, availability: "Available" },
        { code: "3A", name: "AC 3 Tier", fare: 1100, availability: "Available" },
        { code: "SL", name: "Sleeper", fare: 400, availability: "Available" }
      ]
    } else if (isExpress) {
      return [
        { code: "SL", name: "Sleeper", fare: 350, availability: "Available" },
        { code: "3A", name: "AC 3 Tier", fare: 950, availability: "Available" },
        { code: "2A", name: "AC 2 Tier", fare: 1400, availability: "Available" }
      ]
    }
    
    return [
      { code: "SL", name: "Sleeper", fare: 300, availability: "Available" },
      { code: "GN", name: "General", fare: 150, availability: "Available" }
    ]
  }

  // Get full train type name
  private getTrainType(typeCode: string): string {
    const typeMap: { [key: string]: string } = {
      'SF': 'Superfast',
      'EXP': 'Express',
      'MAIL': 'Mail Express',
      'RAJDHANI': 'Rajdhani',
      'SHATABDI': 'Shatabdi',
      'DURONTO': 'Duronto',
      'HUMSAFAR': 'Humsafar'
    }
    return typeMap[typeCode] || 'Express'
  }

  // Map RailwayAPI.com response to our format (fallback)
  private mapRailwayApiResponse(data: any, params: TrainSearchParams): Train[] {
    if (!data.trains || !Array.isArray(data.trains)) return []

    return data.trains.map((train: any) => ({
      trainNumber: train.number || train.train_num,
      trainName: train.name || train.train_name,
      from: params.from,
      to: params.to,
      departureTime: train.src_departure_time || train.from_time,
      arrivalTime: train.dest_arrival_time || train.to_time,
      duration: train.travel_time || this.calculateDuration(train.src_departure_time, train.dest_arrival_time),
      days: this.parseDays(train.days),
      classes: this.parseClasses(train.classes),
      type: train.train_type || 'Express',
      runningDays: train.days || 'Daily',
      distance: train.distance,
      amenities: []
    }))
  }

  // Map RapidAPI response to our format
  private mapRapidApiResponse(data: any, params: TrainSearchParams): Train[] {
    if (!data.data || !Array.isArray(data.data)) return []

    return data.data.map((train: any) => ({
      trainNumber: train.train_no,
      trainName: train.train_name,
      from: params.from,
      to: params.to,
      departureTime: train.from_time,
      arrivalTime: train.to_time,
      duration: train.travel_time || '12h 00m',
      days: ['Daily'],
      classes: [],
      type: train.train_type || 'Express',
      runningDays: 'Daily',
      distance: 0,
      amenities: []
    }))
  }

  // Helper: Parse running days
  private parseDays(daysString: string): string[] {
    if (!daysString) return ['Daily']
    
    const dayMap: { [key: string]: string } = {
      'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu',
      'Fri': 'Fri', 'Sat': 'Sat', 'Sun': 'Sun'
    }
    
    return Object.keys(dayMap).filter(day => daysString.includes(day))
  }

  // Helper: Parse train classes
  private parseClasses(classesData: any): TrainClass[] {
    if (!classesData || !Array.isArray(classesData)) {
      return [
        { code: "SL", name: "Sleeper", fare: 350, availability: "Available" },
        { code: "3A", name: "AC 3 Tier", fare: 950, availability: "Available" }
      ]
    }

    return classesData.map((cls: any) => ({
      code: cls.class_code || cls.code,
      name: cls.class_name || cls.name,
      fare: cls.fare || 0,
      availability: cls.availability || 'Available'
    }))
  }

  // Helper: Calculate duration
  private calculateDuration(fromTime: string, toTime: string): string {
    // Simple calculation - in real scenario, use proper date/time library
    return '12h 30m'
  }

  // Helper: Get class name from code
  private getClassName(classCode: string): string {
    const classMap: { [key: string]: string } = {
      'SL': 'Sleeper',
      '3A': 'AC 3 Tier',
      '2A': 'AC 2 Tier',
      '1A': 'AC First Class',
      'CC': 'Chair Car',
      'EC': 'Executive Class',
      '2S': 'Second Sitting',
      '3E': '3 Tier Economy'
    }
    return classMap[classCode] || classCode
  }

  // Helper: Estimate fare based on class and travel time
  private estimateFare(classCode: string, travelTime: string): number {
    // Base fare per hour for different classes
    const baseFares: { [key: string]: number } = {
      'SL': 35,
      '3A': 95,
      '2A': 140,
      '1A': 280,
      'CC': 120,
      'EC': 200,
      '2S': 25,
      '3E': 40
    }
    
    // Extract hours from travel time (e.g., "12h 30m" -> 12.5)
    const hours = travelTime.match(/(\d+)h/)?.[1] || '10'
    const baseFare = baseFares[classCode] || 50
    
    return Math.round(parseInt(hours) * baseFare)
  }

  // Helper: Get amenities based on train type
  private getAmenities(trainType: string): string[] {
    const type = trainType.toUpperCase()
    
    if (type.includes('RAJDHANI') || type.includes('SHATABDI') || type.includes('VANDE')) {
      return ['Wifi', 'Food', 'Bedding', 'Newspaper']
    } else if (type.includes('DURONTO') || type.includes('SUPERFAST')) {
      return ['Food', 'Bedding']
    } else if (type.includes('HMSAFAR')) {
      return ['Wifi', 'Food', 'Bedding']
    }
    
    return ['Food']
  }

  // Enable/Disable real API
  public setUseRealApi(enabled: boolean): void {
    this.useRealApi = enabled
    console.log(`🔄 Real API mode: ${enabled ? 'ENABLED' : 'DISABLED'}`)
  }

  // Set API key programmatically
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    console.log('🔑 IndianRailAPI key updated')
  }

  // Generate dynamic train data based on actual route
  private async generateDynamicTrainData(params: TrainSearchParams): Promise<Train[]> {
    // Create route key (normalize station codes)
    const routeKey = `${params.from.toUpperCase()}-${params.to.toUpperCase()}`
    const reverseRouteKey = `${params.to.toUpperCase()}-${params.from.toUpperCase()}`
    
    // Get trains for this specific route
    const routeTrains = this.getTrainsForRoute(routeKey, params) || 
                        this.getTrainsForRoute(reverseRouteKey, params) ||
                        this.getGenericTrains(params)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Filter trains based on class if specified
    if (params.class && params.class !== 'all') {
      const classMapping: { [key: string]: string } = {
        'sleeper': 'SL',
        '3ac': '3A',
        '2ac': '2A', 
        '1ac': '1A',
        'cc': 'CC',
        '2s': '2S',
        '3e': '3E'
      }
      
      const classCode = classMapping[params.class.toLowerCase()] || params.class.toUpperCase()
      return routeTrains.filter(train => 
        train.classes.some(cls => cls.code === classCode)
      )
    }

    return routeTrains
  }

  // Get trains for specific routes (Dynamic Route Database)
  private getTrainsForRoute(routeKey: string, params: TrainSearchParams): Train[] | null {
    const routeDatabase: { [key: string]: any[] } = {
      // Darbhanga to New Delhi (Real data from erail.in)
      'DBG-NDLS': [
        {
          trainNumber: "02569",
          trainName: "DBG NDLS SPL",
          departureTime: "06:30",
          arrivalTime: "04:00",
          duration: "21h 30m",
          days: ["Tue"],
          type: "Special",
          classes: [
            { code: "SL", name: "Sleeper", fare: 450, availability: "Available" },
            { code: "3A", name: "AC 3 Tier", fare: 1200, availability: "Available" },
            { code: "2A", name: "AC 2 Tier", fare: 1850, availability: "Available" }
          ],
          distance: 1184,
          amenities: ["Food", "Bedding"]
        },
        {
          trainNumber: "12565",
          trainName: "BIHAR S KRANTI",
          departureTime: "08:20",
          arrivalTime: "05:05",
          duration: "20h 45m",
          days: ["Daily"],
          type: "Superfast",
          classes: [
            { code: "SL", name: "Sleeper", fare: 380, availability: "Available" },
            { code: "3A", name: "AC 3 Tier", fare: 1150, availability: "Available" },
            { code: "2A", name: "AC 2 Tier", fare: 1700, availability: "Available" }
          ],
          distance: 1184,
          amenities: ["Food", "Bedding"]
        },
        {
          trainNumber: "04449",
          trainName: "DBG NDLS SPL Till 2-Jan",
          departureTime: "18:15",
          arrivalTime: "23:00",
          duration: "28h 45m",
          days: ["Mon", "Wed", "Fri"],
          type: "Special",
          classes: [
            { code: "SL", name: "Sleeper", fare: 420, availability: "Available" },
            { code: "3A", name: "AC 3 Tier", fare: 1100, availability: "Available" }
          ],
          distance: 1184,
          amenities: ["Food"]
        },
        {
          trainNumber: "12561",
          trainName: "SWATANTRA S EXP",
          departureTime: "19:08",
          arrivalTime: "15:45",
          duration: "20h 37m",
          days: ["Daily"],
          type: "Superfast",
          classes: [
            { code: "SL", name: "Sleeper", fare: 400, availability: "WL/10" },
            { code: "3A", name: "AC 3 Tier", fare: 1100, availability: "Available" },
            { code: "2A", name: "AC 2 Tier", fare: 1600, availability: "Available" }
          ],
          distance: 1184,
          amenities: ["Food", "Bedding"]
        },
        {
          trainNumber: "04651",
          trainName: "JYG ASR SPL",
          departureTime: "05:30",
          arrivalTime: "07:00",
          duration: "25h 30m",
          days: ["Tue", "Fri", "Sun"],
          type: "Special",
          classes: [
            { code: "3A", name: "AC 3 Tier", fare: 1250, availability: "Available" },
            { code: "2A", name: "AC 2 Tier", fare: 1850, availability: "Available" }
          ],
          distance: 1184,
          amenities: ["Food", "Bedding"]
        },
        {
          trainNumber: "15557",
          trainName: "AMRIT BHARAT EXP",
          departureTime: "15:00",
          arrivalTime: "12:45",
          duration: "21h 45m",
          days: ["Mon", "Thu"],
          type: "Express",
          classes: [
            { code: "SL", name: "Sleeper", fare: 380, availability: "RAC/5" },
            { code: "3A", name: "AC 3 Tier", fare: 1050, availability: "Available" }
          ],
          distance: 1184,
          amenities: ["Food"]
        },
        {
          trainNumber: "04059",
          trainName: "JYG ANVT SPL Till 29-Nov",
          departureTime: "11:30",
          arrivalTime: "08:40",
          duration: "21h 10m",
          days: ["Fri"],
          type: "Special",
          classes: [
            { code: "SL", name: "Sleeper", fare: 450, availability: "Available" },
            { code: "3A", name: "AC 3 Tier", fare: 1200, availability: "Available" }
          ],
          distance: 1184,
          amenities: ["Food"]
        },
        {
          trainNumber: "12435",
          trainName: "GARIB RATH EXP",
          departureTime: "13:30",
          arrivalTime: "09:00",
          duration: "19h 30m",
          days: ["Mon", "Fri"],
          type: "Superfast",
          classes: [
            { code: "3A", name: "AC 3 Tier", fare: 800, availability: "Available" },
            { code: "SL", name: "Sleeper", fare: 350, availability: "WL/50" }
          ],
          distance: 1184,
          amenities: ["Food"]
        }
      ],
      // Darbhanga to Jharkhand (Ranchi)
      'DBG-RNC': [
        {
          trainNumber: "13245",
          trainName: "CAPITAL EXPRESS",
          departureTime: "14:20",
          arrivalTime: "03:15",
          duration: "12h 55m",
          days: ["Daily"],
          type: "Express",
          classes: [
            { code: "SL", name: "Sleeper", fare: 280, availability: "Available" },
            { code: "3A", name: "AC 3 Tier", fare: 750, availability: "Available" },
            { code: "2A", name: "AC 2 Tier", fare: 1100, availability: "Available" }
          ],
          distance: 480,
          amenities: ["Food", "Bedding"]
        }
      ],
      // Mumbai to Delhi
      'MUMBAI-NDLS': [
        {
          trainNumber: "12951",
          trainName: "MUMBAI RAJDHANI",
          departureTime: "16:55",
          arrivalTime: "08:35",
          duration: "15h 40m",
          days: ["Daily"],
          type: "Rajdhani",
          classes: [
            { code: "1A", name: "AC First", fare: 5200, availability: "Available" },
            { code: "2A", name: "AC 2 Tier", fare: 3800, availability: "Available" },
            { code: "3A", name: "AC 3 Tier", fare: 2400, availability: "WL/5" }
          ],
          distance: 1384,
          amenities: ["Wifi", "Food", "Bedding", "Newspaper"]
        }
      ],
      // Patna to Delhi
      'PNBE-NDLS': [
        {
          trainNumber: "12301",
          trainName: "HOWRAH RAJDHANI",
          departureTime: "07:05",
          arrivalTime: "14:50",
          duration: "7h 45m",
          days: ["Daily"],
          type: "Rajdhani",
          classes: [
            { code: "1A", name: "AC First", fare: 3500, availability: "Available" },
            { code: "2A", name: "AC 2 Tier", fare: 2100, availability: "Available" },
            { code: "3A", name: "AC 3 Tier", fare: 1450, availability: "RAC/8" }
          ],
          distance: 1000,
          amenities: ["Wifi", "Food", "Bedding"]
        }
      ]
    }

    const trains = routeDatabase[routeKey]
    if (!trains) return null

    // Map to full train objects with route params
    return trains.map(t => ({
      ...t,
      from: params.from,
      to: params.to,
      runningDays: t.days.join(', ')
    }))
  }

  // Generate generic trains for routes not in database
  private getGenericTrains(params: TrainSearchParams): Train[] {
    return [
      {
        trainNumber: "12345",
        trainName: "PASSENGER EXPRESS",
        from: params.from,
        to: params.to,
        departureTime: "06:00",
        arrivalTime: "18:30",
        duration: "12h 30m",
        days: ["Daily"],
        classes: [
          { code: "SL", name: "Sleeper", fare: 350, availability: "Available" },
          { code: "3A", name: "AC 3 Tier", fare: 950, availability: "Available" },
          { code: "2A", name: "AC 2 Tier", fare: 1400, availability: "Available" }
        ],
        type: "Express",
        runningDays: "Daily",
        distance: 600,
        amenities: ["Food"]
      },
      {
        trainNumber: "54321",
        trainName: "SUPERFAST EXPRESS",
        from: params.from,
        to: params.to,
        departureTime: "14:20",
        arrivalTime: "04:50",
        duration: "14h 30m",
        days: ["Mon", "Wed", "Fri"],
        classes: [
          { code: "SL", name: "Sleeper", fare: 420, availability: "WL/10" },
          { code: "3A", name: "AC 3 Tier", fare: 1100, availability: "Available" },
          { code: "2A", name: "AC 2 Tier", fare: 1650, availability: "Available" }
        ],
        type: "Superfast",
        runningDays: "Mon, Wed, Fri",
        distance: 700,
        amenities: ["Food", "Bedding"]
      }
    ]
  }

  // Station search using real station data
  async searchStations(query: string): Promise<Station[]> {
    const cacheKey = `stations_${query}`
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      const stations = await this.simulateStationSearch(query)
      
      this.cache.set(cacheKey, {
        data: stations,
        timestamp: Date.now()
      })

      return stations
    } catch (error) {
      console.error('Station search error:', error)
      return []
    }
  }

  // Station search using real station data
  private async simulateStationSearch(query: string): Promise<Station[]> {
    // Import the real station list
    const stationList = require('../stationlist.json')
    
    // Simulate API delay for consistency
    await new Promise(resolve => setTimeout(resolve, 100))

    // Filter stations based on query
    const filteredStations = stationList
      .filter((station: any) =>
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.code.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 15) // Limit to 15 results for performance
      .map((station: any) => ({
        code: station.code,
        name: station.name,
        state: this.getStateFromStationName(station.name),
        zone: this.getZoneFromStationCode(station.code)
      }))

    return filteredStations
  }

  // Helper method to determine state from station name
  private getStateFromStationName(stationName: string): string {
    const stateMap: { [key: string]: string } = {
      'DELHI': 'Delhi',
      'MUMBAI': 'Maharashtra',
      'CHENNAI': 'Tamil Nadu',
      'BANGALORE': 'Karnataka',
      'KOLKATA': 'West Bengal',
      'HYDERABAD': 'Telangana',
      'PUNE': 'Maharashtra',
      'AHMEDABAD': 'Gujarat',
      'JAIPUR': 'Rajasthan',
      'LUCKNOW': 'Uttar Pradesh',
      'KANPUR': 'Uttar Pradesh',
      'NAGPUR': 'Maharashtra',
      'INDORE': 'Madhya Pradesh',
      'BHOPAL': 'Madhya Pradesh',
      'PATNA': 'Bihar',
      'DARBHANGA': 'Bihar',
      'MUZAFFARPUR': 'Bihar',
      'GAYA': 'Bihar',
      'BARAUNI': 'Bihar'
    }

    for (const [key, state] of Object.entries(stateMap)) {
      if (stationName.includes(key)) {
        return state
      }
    }
    return 'India'
  }

  // Helper method to determine railway zone from station code
  private getZoneFromStationCode(stationCode: string): string {
    const zoneMap: { [key: string]: string } = {
      'NDLS': 'NR',
      'DBG': 'ECR',
      'HWH': 'ER',
      'BCT': 'WR',
      'MAS': 'SR',
      'SBC': 'SWR',
      'PNBE': 'ECR',
      'GAYA': 'ECR',
      'MFP': 'ECR',
      'BJU': 'ECR'
    }

    return zoneMap[stationCode] || 'Unknown'
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
export const trainService = new TrainService()
export default trainService
