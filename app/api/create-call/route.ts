import { NextResponse } from "next/server";
import Retell from "retell-sdk";

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

    // Initialize Retell client
    const retellClient = new Retell({ apiKey });

    // Create a web call and get access token
    const webCallResponse = await retellClient.call.createWebCall({
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
    });
    
    // Return token to frontend
    return NextResponse.json({
      access_token: webCallResponse.access_token,
      call_id: webCallResponse.call_id,
      message: "Token generated successfully",
    });
  } catch (error) {
    console.error("Error generating Retell token:", error);
    
    // Handle specific Retell API errors
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