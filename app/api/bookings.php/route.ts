import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://localhost:8000'
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const url = `${phpBackendUrl}/api/bookings.php${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    let data;
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      console.error('Failed to parse bookings response:', parseError)
      return NextResponse.json({ 
        success: false,
        message: 'Invalid response from server' 
      }, { status: 500 })
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('Bookings API GET error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Network error. Please try again.', 
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://localhost:8000'
    
    // Get request body
    const body = await request.json()
    
    const response = await fetch(`${phpBackendUrl}/api/bookings.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    let data;
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      console.error('Failed to parse bookings response:', parseError)
      return NextResponse.json({ 
        success: false,
        message: 'Invalid response from server' 
      }, { status: 500 })
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('Bookings API POST error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Network error. Please try again.', 
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

