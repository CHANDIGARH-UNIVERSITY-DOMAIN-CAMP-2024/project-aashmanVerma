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
import { badgeColors } from "../status/page";

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
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { formatForManage } from "@/utils/quiz";

function AlertDialogDemo({ trigger } : { trigger: any }) {
  const confirmDelete = async () => {
    await trigger();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="cursor-pointer">Delete</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            quiz and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Page() {
  const auth = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const deleteQuiz = async (url: string) => {
    try {
      const token = await auth.getToken();
      const response = await fetch(`/api/quizzr`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
        }),
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Quiz deleted successfully",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while deleting the quiz",
      });
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
      const parsedData = formatForManage(data);
      setData(parsedData as any);
    }

    fetchData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead className="w-[50px] truncate">URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Remove</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { data.length ? 
          data.map((quiz: { name: string; url: string; status: keyof typeof badgeColors }) => {
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
                  <AlertDialogDemo trigger={async() => await deleteQuiz(quiz.url)} />
                </TableCell>
              </TableRow>
            );
          }) : null
        }
      </TableBody>
    </Table>
  );
}
