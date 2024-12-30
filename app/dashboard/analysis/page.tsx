"use client";

import { badgeColors } from "../quiz/status/page";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableStudent } from "@/app/comp/TableStudent";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { formatForAnalysis, formatForAnalysisTable } from "@/utils/quiz";

export default function Page() {
    const auth = useAuth();
    const [data, setData] = useState([]);

    const [analysis, setAnalysis] = useState<any>([]);

    const getAnalysis = async (id: string) => {
        const token = await auth.getToken();
        const response = await fetch(`/api/analysis/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
        const { data } = await response.json();
        if (data.length) {
            const parsedData = formatForAnalysisTable(data);
            setAnalysis(parsedData as any);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = await auth.getToken();
            const response = await fetch("/api/quizzr", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            const data = await response.json();
            const parsedData = formatForAnalysis(data);
            setData(parsedData as any);
        }

        fetchData();
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[50px] truncate">URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Analysis</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.length &&
                    data.map((quiz: { name: string; url: string; status: 'Active' | 'Inactive' }) => {
                        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/quizzr/${quiz.url}`;

                        return (
                            <TableRow key={quiz.name}>
                                <TableCell className="w-20">{quiz.name}</TableCell>
                                <TableCell>
                                    <a href={url} target="_blank" className="text-blue-500">
                                        {url}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Badge className={badgeColors[quiz.status]}>
                                        {quiz.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <AlertDialogTitle className="font-normal text-sm cursor-pointer" onClick={async() => await getAnalysis(quiz.url)}>Analyse</AlertDialogTitle>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <TableStudent data={analysis} />
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>
    )
}