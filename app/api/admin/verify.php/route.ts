import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get Authorization header from request
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }
    
    // Proxy request to PHP backend
    const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://localhost:8000'
    
    const response = await fetch(`${phpBackendUrl}/api/admin/verify.php`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('Verify API error:', error)
    return NextResponse.json(
      { message: 'Network error. Please try again.', error: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}









