"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import stationList from "../stationlist.json"

export default function StationTest() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<any[]>([])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    
    if (value.length < 2) {
      setResults([])
      return
    }

    const filtered = stationList
      .filter((station: any) =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.code.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 10)

    setResults(filtered)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Station Search Test</CardTitle>
        <p className="text-sm text-gray-600">
          Testing integration with stationlist.json ({stationList.length} stations)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search stations (e.g., Darbhanga, Delhi, Mumbai)..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
        />
        
        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Results ({results.length}):</h4>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {results.map((station, index) => (
                <div key={index} className="p-2 border rounded bg-gray-50">
                  <div className="font-medium">{station.name}</div>
                  <div className="text-sm text-gray-600">Code: {station.code}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchTerm.length >= 2 && results.length === 0 && (
          <p className="text-gray-500">No stations found for "{searchTerm}"</p>
        )}
      </CardContent>
    </Card>
  )
}




































