"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { QuestionList } from "@/app/comp/QuestionList";
import { useAuth } from "@clerk/nextjs";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox";

export const questionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Question text is required"),
    marks: z.number().int().positive(),
    options: z.array(
        z.object({
            id: z.string(),
            value: z.string(),
            isCorrect: z.boolean().default(false),
        })
    ).optional(),
});

const formSchema = z.object({
    id: z.string(),
    url: z.string(),
    title: z.string().min(2).max(50),
    category: z.string(),
    timeToAttempt: z.number().int().positive(),
    guidelines: z.string().optional(),
    questions: z.array(questionSchema),
});

export default function Page() {
    const auth = useAuth();
    const { toast } = useToast();

    const [state, setState] = useState<{
        link: {
            status: boolean,
            value: string | null,
            copied: boolean,
        },
        optionsText: string,
        questions: z.infer<typeof questionSchema>,
    }>({
        link: {
            status: false,
            value: null,
            copied: false,
        },
        optionsText: "",
        questions: {
            id: "",
            title: "",
            marks: 0,
            options: [],
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: uuidv4(),
            url: uuidv4(),
            title: "",
            category: "",
            timeToAttempt: 10,
            guidelines: "",
            questions: [],
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    };

    const copyToClipBoard = () => {
        navigator.clipboard.writeText("https://quiz.com/1234");
        setState({
            ...state,
            link: {
                status: false,
                value: "https://quiz.com/1234",
                copied: true,
            },
            questions: state.questions,
        })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case "title":
                form.setValue("title", value);
                break;
            case "timeToAttempt":
                form.setValue("timeToAttempt", parseInt(value));
                break;
            case "category":
                form.setValue("category", value);
                break;
            case "guidelines":
                form.setValue("guidelines", value);
                break;
            case "questionTitle":
                setState({
                    ...state,
                    questions: {
                        ...state.questions,
                        title: value,
                    }
                })
                break;
            case "questionMarks":
                setState({
                    ...state,
                    questions: {
                        ...state.questions,
                        marks: parseInt(value),
                    }
                })
                break;
            default:
                break;
        }
    }

    const addQuestion = () => {
        try {            
            questionSchema.parse(state.questions);
            form.setValue("questions", [...form.getValues("questions"), {
                ...state.questions,
                id: Math.random().toString(36).substring(7),
            }]);

            // Reset the question state
            setState({
                ...state,
                questions: {
                    id: "",
                    title: "",
                    marks: 0,
                    options: [],
                }
            })
        } catch (err: unknown) {
            console.error(err);
        }
    }

    const createQuiz = async () => {
        try {
            toast({
                title: "Creating quiz",
                description: "Please wait while we create your quiz",
            })

            const token = await auth.getToken();
            const response = await fetch("/api/quizzr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(form.getValues()),
            })

            if (response.status === 200) {
                toast({
                    title: "Quiz created successfully",
                    description: "Your quiz has been created successfully",
                })
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-y-2">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Math analysis" {...field} name="title" onChange={handleOnChange} />
                                </FormControl>

                                <div className="flex gap-x-2 items-center">
                                    <Label>Randomise ?</Label>
                                    <Checkbox />
                                </div>

                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Example.. Math" {...field} name="category" onChange={handleOnChange} />
                                </FormControl>

                                <FormLabel>Time to attempt(in mins)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Example.. 9" {...field} name="timeToAttempt"
                                        onChange={handleOnChange} />
                                </FormControl>
                                <FormMessage />

                                <FormLabel>Guidelines(if any)</FormLabel>
                                <FormControl>
                                    <Textarea name="guidelines" onChange={(e) => form.setValue("guidelines", e.target.value)} />
                                </FormControl>
                                <FormMessage />

                                <FormLabel>Questions</FormLabel>
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex gap-x-3 items-center">
                                        <FormLabel className="w-20">Title -</FormLabel>
                                        <FormControl>
                                            <Input name="questionTitle" placeholder="What is the capital of France?" onChange={handleOnChange} />
                                        </FormControl>
                                    </div>

                                    <div className="flex gap-x-3 items-center">
                                        <FormLabel className="w-20">Marks - </FormLabel>
                                        <Input name="questionMarks" type="number" placeholder="Example.. 5" onChange={handleOnChange} />
                                    </div>

                                    <div className="flex gap-x-3 items-center">
                                        <FormLabel className="w-20">Options -</FormLabel>

                                        <Textarea
                                            aria-multiline={true}
                                            cols={50}
                                            rows={4}
                                            placeholder="Enter each option in new line and include * with the correct one"
                                            name="questionOptions"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const options = value.split("\n").map((item) => {
                                                    const isCorrect = item.includes("*");
                                                    return {
                                                        id: uuidv4(),
                                                        value: item.replace("*", "").trim(),
                                                        isCorrect,
                                                    }
                                                })

                                                setState({
                                                    ...state,
                                                    optionsText: value,
                                                    questions: {
                                                        ...state.questions,
                                                        options,
                                                    }
                                                })
                                            }}
                                        />
                                    </div>

                                    <Button variant={"outline"} type="button" className="w-40" onClick={addQuestion}>
                                        <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6 12H12M18 12H12M12 12V6M12 12V18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        Add question</Button>
                                </div>

                                {
                                    form.getValues("questions").length > 0 &&
                                    <QuestionList data={form.getValues("questions") as any} />
                                }

                                {state.link.status &&
                                    <Label className="flex items-center gap-x-2">
                                        {!state.link.copied ?
                                            <svg className="cursor-pointer" onClick={copyToClipBoard} width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9" stroke="#000000" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg> :
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z" stroke="#000000" stroke-width="1.5"></path><path d="M7 12.5L10 15.5L17 8.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        }
                                        Link generated - skdjs</Label>
                                }
                            </FormItem>
                        )}
                    />
                    <Button type="submit" onClick={createQuiz}>Create quiz</Button>
                </form>
            </Form>
        </div>
    );
}
