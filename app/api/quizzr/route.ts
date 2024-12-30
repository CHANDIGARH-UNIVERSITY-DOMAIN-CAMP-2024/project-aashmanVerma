import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { parseToken } from "@/utils/token";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }
        const { userId } = parseToken(token);
        const { data, error } = await supabase.from("quizzr-user").select("*").eq("user-id", userId);

        if (error) {
            console.error(error);
            return new Response("Internal server error", { status: 500 });
        }

        return Response.json(data, {
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }
        const { userId } = parseToken(token);

        // Store in db
        const { error } = await supabase.from("quizzr-user").insert([
            {
                "user-id": userId,
                url: body.url,
                limit: body.timeToAttempt,
                status: "active",
                title: body.title,
                domain: body.category,
                guidelines: body.guidelines,
                questions: body.questions,
            }
        ]);

        if (error) {
            console.error(error);
            return new Response("Internal server error", { status: 500 });
        }

        return Response.json({
            message: "Quiz created successfully",
        }, {
            status: 200,
        })
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = createClient();
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }
        const { userId } = parseToken(token);
        const body = await request.json();

        // Delete from db
        (await supabase).from("quizzr-user").delete().eq("url", body.url).eq("user-id", userId);

        return Response.json({
            message: "Quiz deleted successfully",
        }, {
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }
        const { userId } = parseToken(token);
        const body = await request.json();

        // Update in db
        const { error } = await supabase.from("quizzr-user").update({
            status: body.status,
        }).eq("url", body.url).eq("user-id", userId);

        if (error) {
            console.error(error);
            return new Response("Internal server error", { status: 500 });
        }

        return Response.json({
            message: "Quiz updated successfully",
        }, {
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    }
}