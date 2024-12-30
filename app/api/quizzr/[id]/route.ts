import { createClient } from "@/lib/supabase/server";
import { parseToken } from "@/utils/token";
import moment from "moment";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }
        const url = new URL(request.url);
        const id = url.pathname.split('/')[url.pathname.split('/').length - 1];  

        // Fetch quizzes first
        const { data, error } = await supabase.from("quizzr-user").select("*").eq("url", id);

        if (error) {
            console.error(error);
            return new Response("Internal server error", { status: 500 });
        }

        return Response.json({
            data: data.length ? data[0] : null,
            message: "Quiz fetched successfully",
        }, {
            status: 200,
        })
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return new Response("Unauthorized", { status: 401 });
        }
        const { userId } = parseToken(token);
        const body = await request.json();

        let url: any = new URL(request.url);
        url = url.pathname.split('/')[url.pathname.split('/').length - 1];

        const { type, name, studentId, responses }: {
            type: string
            name: string
            studentId: string
            responses: any[]
        } = body;

        if (type === "log") {
            let isLogged: boolean = false;

            const timerData = await supabase.from("quizzr-timer").select("*").eq("user-id", userId).eq("quiz-url", url);
            if (timerData.error) {
                console.error(timerData.error);
                return new Response("Internal server error", { status: 500 });
            }

            if (timerData.data.length) {
                isLogged = true;
            }

            if (!isLogged) {
                const { error } = await supabase.from("quizzr-timer").insert([
                    {
                        "user-id": userId,
                        "quiz-url": url,
                        "last-visited": moment().format('HH:mm:ss')
                    }
                ]);

                if (error) {
                    console.error(error);
                    return new Response("Internal server error", { status: 500 });
                }
            }

            let doesResponseExist: boolean = false;

            const responses = await supabase.from("quizzr-responses").select("*").eq("user-id", userId).eq("url", url);
            if (responses.error) {
                console.error(responses.error);
                return new Response("Internal server error", { status: 500 });
            }

            if (responses.data.length) {
                doesResponseExist = true;
            }

            if (!doesResponseExist) {
                const createResponse = await supabase.from("quizzr-responses").insert([
                    {
                        "student-id": studentId,
                        "name": name,
                        "url": url,
                        "user-id": userId,
                    }
                ]);
    
                if (createResponse.error) {
                    console.error(createResponse.error);
                    return new Response("Internal server error", { status: 500 });
                }
            }
        }

        if (type === "submit") {
            const quizData = await supabase.from("quizzr-user").select("*").eq("url", url);
            
            if (quizData.error) {
                console.error(quizData.error);
                return new Response("Internal server error", { status: 500 });
            }

            const { data } = quizData;
            const quiz = data[0];

            let score: number = 0;
            let total: number = 0;

            for (let i = 0; i < quiz.questions.length; i++) {
                total += quiz.questions[i].marks;
            }

            for (let i = 0; i < responses.length; i++) {
                if (responses[i].correct) {
                    score += responses[i].marks;
                }
            }

            const now = moment().format('HH:mm:ss');
            let lastVisited: any = await supabase.from("quizzr-timer").select("last-visited").eq("user-id", userId).eq("quiz-url", url);
            if (lastVisited.error) {
                console.error(lastVisited.error);
                return new Response("Internal server error", { status: 500 });
            }

            lastVisited = lastVisited.data[0];

            if (moment(lastVisited["last-visited"], 'HH:mm:ss').add(quiz.limit, "minutes").isBefore(moment(now, 'HH:mm:ss'))) {
                return Response.json({
                    success: false,
                    message: "Time limit exceeded",
                }, { status: 400 });
            }

            // Update the database response
            const completedIn = moment(now, 'HH:mm:ss').diff(moment(lastVisited["last-visited"], 'HH:mm:ss'), 'seconds');
            const finalResponse = await supabase.from("quizzr-responses").update({
                marks: score,
                "completed-in": completedIn,
            }).eq("user-id", userId).eq("url", url);
            
            if (finalResponse.error) {
                console.error(finalResponse.error);
                return new Response("Internal server error", { status: 500 });
            }

            return Response.json({
                success: true,
                score,
                total,
            }, {
                status: 200,
            })
        }

        return Response.json({
            success: true,
        }, {
            status: 200,
        })
    } catch (err) {
        console.error(err);
        return new Response("Internal server error", { status: 500 });
    }
}