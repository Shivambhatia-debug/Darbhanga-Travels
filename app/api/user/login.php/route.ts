import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://localhost:8000'
    
    const body = await request.json()
    
    const response = await fetch(`${phpBackendUrl}/api/user/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      console.error('Failed to parse user login response:', parseError)
      return NextResponse.json({ message: 'Invalid response from server' }, { status: 500 })
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('User Login API error:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}


