import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// CORS headers helper
const corsHeaders = {
    //"Access-Control-Allow-Origin":"http://localhost:3000",

    "Access-Control-Allow-Origin":
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://ai-voice-agent-interview-platform-two.vercel.app",

    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-vercel-protection-bypass",
};

// GET Route
export async function GET() {
    return new Response(JSON.stringify({
        success: true,
        message: "API is working",
        timestamp: new Date().toISOString()
    }), {
        headers: {
            "Content-Type": "application/json",
            ...corsHeaders
        }
    });
}

// OPTIONS Route (Preflight CORS)
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders
    });
}

// POST Route
export async function POST(request: Request) {
    console.log("POST Request Started");
    console.log("Headers:", Object.fromEntries(request.headers.entries()));
    console.log("Protection header:", request.headers.get("x-vercel-protection-bypass"));

    let body: any;

    try {
        body = await request.json();
    } catch (e) {
        console.warn("⚠️ No valid JSON body found. Using default values.");
        body = {};
    }

    // Defaults if missing
    const {
        type = "technical",
        role = "Frontend Developer",
        level = "Junior",
        techstack = "React, JavaScript",
        amount = 5
    } = body;

    console.log("Using values:", { type, role, level, techstack, amount });

    try {
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Respond with a JSON array of interview questions **only**, like this:
        ["Question 1", "Question 2", "Question 3"]
        DO NOT include any explanation, heading, or preamble. Only return the JSON array.
        Respond with only the JSON array. No code formatting, no "json", no explanation. Do not wrap in backticks.

      `,
        });

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(","),
            questions: JSON.parse(questions.trim().replace(/^`+|`+$/g, "")),

            userId: "vapi-user-" + Date.now(),
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);

        return new Response(JSON.stringify({
            success: true,
            message: "Interview generated successfully"
        }), {
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });
    }
}
