import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AlertDialogDemo() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="cursor-pointer">
                    <svg className="cursor-pointer" width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6 12H18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will remove your
                        question.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export type QuizQuestion = {
    id: number;
    title: string;
    type: "MCQ" | "Paragraph";
    marks: number;
    options: string[];
};

export function QuestionList({ data }: { data: QuizQuestion[] }) {
    return (
        <Table>
            <TableCaption>A list of quiz questions and their details.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead className="text-right">Remove</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data?.length ? 
                    data?.map((question, num) => (
                        <TableRow key={question.id}>
                            <TableCell className="font-medium">{num+1}</TableCell>
                            <TableCell>{question.title}</TableCell>
                            <TableCell>Mcq</TableCell>
                            <TableCell>{question.marks}</TableCell>
                            <TableCell className="text-right flex justify-end">
                                <AlertDialogDemo />
                            </TableCell>    
                        </TableRow>
                    )) : null
                }
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>Total Marks</TableCell>
                    <TableCell className="text-right">
                        {(data && data?.length) ? data.reduce((total, question) => total + question.marks, 0) : 0}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
