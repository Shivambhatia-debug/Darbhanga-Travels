import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    
    // Try different ports - common PHP development server ports
    const ports = [8000, 3001, 8080]
    let lastError: Error | null = null
    
    for (const port of ports) {
      try {
        let url = `http://localhost:${port}/api/admin/bookings.php`
        if (user_id) {
          url += `?user_id=${user_id}`
        }
        
        console.log(`Trying to fetch from: ${url}`)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': authHeader || '',
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(5000),
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`Successfully fetched from port ${port}:`, data)
          return NextResponse.json(data, { status: response.status })
        } else {
          const errorText = await response.text()
          console.error(`Error from port ${port}:`, response.status, errorText)
          lastError = new Error(`HTTP ${response.status}: ${errorText}`)
        }
      } catch (error: any) {
        console.error(`Failed to connect to port ${port}:`, error.message)
        lastError = error
        // Continue to next port
      }
    }
    
    // If all ports failed, return error
    console.error('All connection attempts failed. Last error:', lastError)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to PHP backend. Please ensure the PHP server is running.',
        error: lastError?.message || 'Connection failed'
      },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Bookings API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch bookings',
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()

    const response = await fetch('http://localhost:8000/api/admin/bookings.php', {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Bookings API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()

    const response = await fetch('http://localhost:8000/api/admin/bookings.php', {
      method: 'PUT',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Bookings API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()

    const response = await fetch('http://localhost:8000/api/admin/bookings.php', {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Bookings API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete booking' },
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







