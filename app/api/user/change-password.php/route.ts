import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://localhost:8000'
    
    const body = await request.json()
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    
    const response = await fetch(`${phpBackendUrl}/api/user/change-password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(body),
    })
    
    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      console.error('Failed to parse password change response:', parseError)
      return NextResponse.json({ success: false, message: 'Invalid response from server' }, { status: 500 })
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
    console.error('Password Change API error:', error)
    return NextResponse.json(
      { success: false, message: 'Network error. Please try again.', error: error.message },
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

