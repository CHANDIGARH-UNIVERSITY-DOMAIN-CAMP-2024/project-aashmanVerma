"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Countdown from 'react-countdown';

const formSchema = z.object({
    studentId: z.string().nonempty(),
    name: z.string().nonempty(),
})


export default function Page() {
    const auth = useAuth();
    const { toast } = useToast();

    const [state, setState] = useState<any>();
    const [answers, setAnswers] = useState<any>([]);
    const [attempt, setAttempt] = useState(false);
    const { id } = useParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            name: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            formSchema.parse(values);
            const { studentId, name } = values;
            await logAttempt(studentId, name);
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: (err as Error).message
            })
        }
    };


    const logAttempt = async (studentId: string, name: string) => {
        try {
            const token = await auth.getToken();
            const response = await fetch(`/api/quizzr/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: "log",
                    studentId: studentId,
                    name: name
                })
            })

            if (response.status === 200) {
                setAttempt(true);
                toast({
                    title: "Visit logged",
                    description: "You can now attempt the quiz",
                });
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "An error occurred while attempting the quiz",
            });
        }
    }

    const submitQuiz = async () => {
        try {
            toast({
                title: "Submitting quiz",
                description: "Please wait...",
            })

            const token = await auth.getToken();
            const response = await fetch(`/api/quizzr/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: "submit",
                    responses: answers,
                    studentId: form.getValues("studentId"),
                    name: form.getValues("name")
                })
            })
            
            const data = await response.json();

            if (response.status === 400) {
                toast({
                    title: "Times up",
                    description: "You have exceeded the time limit",
                });
            }

            if (response.status === 200) {
                toast({
                    title: "Quiz submitted",
                    description: `You scored ${data.score}/${data.total} marks`,
                });
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "An error occurred while submitting the quiz",
            });
        }
    }

    const renderer = ({ minutes, seconds }: {
        hours: number,
        minutes: number,
        seconds: number,
        completed: boolean
    }) => {
        return <span>{minutes}:{seconds}</span>;
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = await auth.getToken();
            const response = await fetch(`/api/quizzr/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'application/json'
                }
            })

            const data = (await response.json())?.data;
            setState(data as any);
        }

        fetchData();
    }, [])
    return (
        <div className="max-w-xl mx-auto flex flex-col gap-y-2 my-5 justify-center">
            <p className="font-medium text-xl">Quizzr</p>

            <div className="flex flex-col gap-y-1">
                <p>1. Do not leave or close the window, once you click on attempt test</p>
                <p>2. Do not try to extend the time by unfair means, it is protected by backend.</p>
                <p>3. Complete before the timer runs out of time.</p>
            </div>

            <div className="mt-5 flex flex-col gap-y-3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="studentId">Student Id</FormLabel>
                                    <FormControl>
                                        <Input {...field} id="studentId" placeholder="Enter your student id" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} id="name" placeholder="Enter your name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            !attempt && <Button className="mt-4 w-full" type="submit">Attempt</Button>
                        }
                    </form>
                </Form>
            </div>

            {
                (state && attempt) && (
                    <div className="mt-5 flex flex-col gap-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-2xl">{state.title}</Label>
                            <Badge variant="secondary" className="max-w-20">{state.domain}</Badge>
                        </div>
                        <Label>Total Questions: {state.questions.length}</Label>
                        <Label>Duration: {state.limit} minutes</Label>
                        <span className="flex gap-x-2 items-center">
                            <span className="font-medium">Time left:</span>
                            <Countdown 
                            date={Date.now() + state?.limit * 60 * 1000} 
                            renderer={renderer}
                            />
                            seconds</span>

                        <div className="mt-10">
                            {
                                state.questions.length &&
                                state.questions.map((ques: any, i: number) => {
                                    return (
                                        <div key={ques.id} className="flex flex-col gap-y-3">
                                            <p>{i + 1}. {ques.title}</p>
                                            <Badge className="w-20">{ques.marks} marks</Badge>
                                            <div className="flex flex-col gap-y-1">
                                                {
                                                    ques.options.map((opt: any, i: number) => {
                                                        return (
                                                            <div key={i} className="flex items-center gap-x-2">
                                                                <input type="radio" name={`question-${ques.id}`} id={`question-${ques.id}-${opt.id}`} value={opt.value} onClick={() => {
                                                                    const exist = answers.find((ans: any) => ans.quesId === ques.id);

                                                                    if (exist) {
                                                                        const filtered = answers.filter((ans: any) => ans.quesId !== ques.id);
                                                                        const updated = {
                                                                            quesId: ques.id,
                                                                            correct: opt.isCorrect,
                                                                            marks: ques.marks
                                                                        }

                                                                        setAnswers([...filtered, updated]);
                                                                    } else {
                                                                        setAnswers([...answers, {
                                                                            quesId: ques.id,
                                                                            correct: opt.isCorrect,
                                                                            marks: ques.marks
                                                                        }])
                                                                    }
                                                                }} />
                                                                <label htmlFor={`question-${ques.id}-${opt.id}`}>{opt.value}</label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="mt-5">
                            <Button onClick={submitQuiz}>Submit</Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}