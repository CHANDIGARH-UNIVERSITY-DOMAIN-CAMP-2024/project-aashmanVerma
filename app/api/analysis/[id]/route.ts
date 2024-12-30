import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }
        const url: any = new URL(request.url);
        const id = url.pathname.split('/')[url.pathname.split('/').length - 1];

        // Fetch quizzes first
        const { data, error } = await supabase.from("quizzr-responses").select("*").eq("url", id);

        if (error) {
            console.error(error);
            return new Response("Internal server error", { status: 500 });
        }
        
        return Response.json({
            data,
        }, {
            status: 200,
        })
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    }
}