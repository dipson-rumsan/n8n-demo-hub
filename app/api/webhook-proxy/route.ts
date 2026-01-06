import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData()

    const targetUrl = body.get("targetUrl") as string
    const webhookUrl = targetUrl || "https://n8n-webhook.rumsan.net/webhook/customer-support"

    // Remove targetUrl from formData before forwarding
    if (targetUrl) {
      body.delete("targetUrl")
    }

    // Forward the request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: body,
    })

    const responseText = await response.text()

    // Return the response with proper CORS headers
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Webhook proxy error:", error)
    return NextResponse.json({ error: "Failed to forward request" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
