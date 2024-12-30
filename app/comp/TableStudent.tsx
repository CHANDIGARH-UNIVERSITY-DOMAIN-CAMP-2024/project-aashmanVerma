import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function TableStudent({ data }: { data: any[] }) {
    return (
        <Table>
            <TableCaption>A summary of students quiz results.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">Completed In</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.length &&
                    data.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="text-right">{student.marks}</TableCell>
                            <TableCell className="text-right">{student.completedIn}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>Average Marks</TableCell>
                    <TableCell className="text-right" colSpan={3}>
                        {
                            data.length ?
                            (data.reduce((acc, student) => acc + student.marks, 0) / data.length).toFixed(2) : 0
                        }
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
