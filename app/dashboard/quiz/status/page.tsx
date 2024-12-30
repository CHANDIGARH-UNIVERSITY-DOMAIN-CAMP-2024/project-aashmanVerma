"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { formatForStatus } from "@/utils/quiz";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export type QuizStatus = "Active" | "Inactive";

export const data: { name: string; domain: string; url: string; difficulty: string; total_questions: number; time_limit: string; status: QuizStatus; responses: number; }[] = [
  {
    name: "General Knowledge Quiz",
    domain: "General",
    url: "https://example.com/quiz/general-knowledge",
    difficulty: "Easy",
    total_questions: 10,
    time_limit: "10",
    status: "Active",
    responses: 150,
  },
  {
    name: "Science Quiz",
    domain: "Science",
    url: "https://example.com/quiz/science",
    difficulty: "Medium",
    total_questions: 15,
    time_limit: "15",
    status: "Active",
    responses: 200,
  },
  {
    name: "History Quiz",
    domain: "History",
    url: "https://example.com/quiz/history",
    difficulty: "Hard",
    total_questions: 20,
    time_limit: "20",
    status: "Inactive",
    responses: 75,
  },
  {
    name: "Technology Quiz",
    domain: "Technology",
    url: "https://example.com/quiz/technology",
    difficulty: "Easy",
    total_questions: 12,
    time_limit: "10",
    status: "Active",
    responses: 300,
  },
  {
    name: "Geography Quiz",
    domain: "Geography",
    url: "https://example.com/quiz/geography",
    difficulty: "Medium",
    total_questions: 18,
    time_limit: "15",
    status: "Active",
    responses: 120,
  },
];

export const badgeColors = {
    Active: "bg-green-500",
    Inactive: "bg-red-500",
}

export default function Page() {
  const auth = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<{ name: string; domain: string; url: string; difficulty: string; total_questions: number; time_limit: string; status: QuizStatus; responses: number; }[] | null>(null);

  const toggleStatus = async (url: string, to: string) => {
    try {
      const token = await auth.getToken();
      const response = await fetch("/api/quizzr", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          status: to,
        }),
      })

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Status toggled successfully",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to toggle status",
        variant: "destructive"
      })
      console.error(err);
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
      const parsedData = formatForStatus(data);
      setData(parsedData as any);
    }

    fetchData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead className="w-[50px] truncate">URL</TableHead>
          <TableHead>Total Questions</TableHead>
          <TableHead>Time limit(min)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
            (data && (data as any[]).length) ?
            (data as { name: string; domain: string; url: string; difficulty: string; total_questions: number; time_limit: string; status: QuizStatus; responses: number; }[]).map((quiz) => {
                const url = `${process.env.NEXT_PUBLIC_BASE_URL}/quizzr/${quiz.url}`;

                return (
                    <TableRow key={quiz.name}>
                        <TableCell className="w-20">{quiz.name}</TableCell>
                        <TableCell>{quiz.domain}</TableCell>
                        <TableCell>
                            <a href={url} target="_blank" className="text-blue-500">
                                {url}
                            </a>
                        </TableCell>
                        <TableCell>{quiz.total_questions}</TableCell>
                        <TableCell>{quiz.time_limit}</TableCell>
                        <TableCell>
                            <Badge className={badgeColors[quiz.status]}>{quiz.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={async () => await toggleStatus(quiz.url, quiz.status === "Active" ? "Inactive" : "Active")}>Toggle</Button>
                        </TableCell>
                    </TableRow>
                );
            }) : null
        }
      </TableBody>
    </Table>
  );
}
