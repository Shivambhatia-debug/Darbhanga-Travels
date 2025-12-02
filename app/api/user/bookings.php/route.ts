import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://localhost:8000'
    
    // Get Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const bookingId = searchParams.get('booking_id')

    const queryParams = new URLSearchParams()
    if (userId) queryParams.set('user_id', userId)
    if (bookingId) queryParams.set('booking_id', bookingId)
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
    
    const response = await fetch(`${phpBackendUrl}/api/user/bookings.php${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    })
    
    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      console.error('Failed to parse user bookings response:', parseError)
      return NextResponse.json({ message: 'Invalid response from server' }, { status: 500 })
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('User Bookings API error:', error)
    return NextResponse.json(
      { message: 'Network error. Please try again.', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://localhost:8000'
    
    // Get Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    const response = await fetch(`${phpBackendUrl}/api/user/bookings.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })
    
    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      console.error('Failed to parse user bookings response:', parseError)
      return NextResponse.json({ message: 'Invalid response from server' }, { status: 500 })
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('User Bookings POST API error:', error)
    return NextResponse.json(
      { message: 'Network error. Please try again.', error: error.message },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

