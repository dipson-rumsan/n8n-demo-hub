import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get optional metadata from request body
    const body = await request.json().catch(() => ({})) as { 
      metadata?: Record<string, any>; 
      dynamicVariables?: Record<string, any> 
    };
    const { metadata = {}, dynamicVariables = {} } = body;
    
    const apiKey = process.env.RETELL_API_KEY;
    const agentId = process.env.AGENT_ID;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Retell API key not configured" },
        { status: 500 }
      );
    }
    
    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID not configured" },
        { status: 500 }
      );
    }

    // Create web call using direct fetch (Cloudflare Workers compatible)
    const payload = {
      agent_id: agentId,
      // Optional: Add metadata for tracking
      metadata: {
        timestamp: new Date().toISOString(),
        source: "web-app",
        ...metadata,
      },
      // Optional: Add dynamic variables for the LLM
      retell_llm_dynamic_variables: {
        current_time: new Date().toLocaleString(),
        ...dynamicVariables,
      },
    };

    const response = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Retell API error:", response.status, errorText);
      return NextResponse.json(
        { 
          error: "Failed to create web call",
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const webCallResponse = await response.json() as {
      access_token?: string;
      call_id?: string;
      [key: string]: any;
    };

    // Validate response structure
    if (!webCallResponse.access_token) {
      console.error("Missing access_token in Retell response:", webCallResponse);
      return NextResponse.json(
        { error: "Invalid response from Retell API - missing access token" },
        { status: 500 }
      );
    }
    
    // Return token to frontend
    return NextResponse.json({
      access_token: webCallResponse.access_token,
      call_id: webCallResponse.call_id || null,
      message: "Token generated successfully",
    });
  } catch (error) {
    console.error("Error generating Retell token:", error);
    
    // Handle specific errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to generate access token",
          details: error.message,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 }
    );
  }
}

// Optional: Handle different HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate tokens." },
    { status: 405 }
  );
}