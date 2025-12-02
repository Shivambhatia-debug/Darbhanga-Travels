import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    // Get the form data from the request
    const formData = await request.formData()
    
    // Forward the form data to PHP backend
    const response = await fetch('http://localhost:8000/api/admin/upload-ticket.php', {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
      },
      body: formData, // Forward the FormData directly
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Upload Ticket API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload ticket: ' + (error as Error).message },
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








