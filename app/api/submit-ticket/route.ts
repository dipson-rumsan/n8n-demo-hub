import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const priority = formData.get("priority") as string
    const description = formData.get("description") as string

    // Extract files
    const files: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file_") && value instanceof File) {
        files.push(value)
      }
    }

    // Generate ticket ID
    const ticketId = `TKT-${Date.now().toString().slice(-6)}`

    // Prepare data for n8n webhook
    const ticketData = {
      ticketId,
      title,
      category,
      priority,
      description,
      submittedAt: new Date().toISOString(),
      fileCount: files.length,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    }

    // In a real implementation, you would:
    // 1. Upload files to a storage service (Vercel Blob, S3, etc.)
    // 2. Send the ticket data to your n8n webhook
    // 3. Store ticket metadata in a database

    // Simulate n8n webhook response
    const n8nResponse = {
      success: true,
      ticketId,
      status: "submitted",
      message: "Ticket received and queued for review",
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Ticket submitted successfully",
      n8nResponse,
    })
  } catch (error) {
    console.error("Error submitting ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to submit ticket" }, { status: 500 })
  }
}
