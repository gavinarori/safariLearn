import { LessonBlock, TableBlockData } from '@/lib/types/course';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function TableBlock({ block, className = '' }: TableBlockProps) {
  const data = block.data as TableBlockData;

  return (
    <div className={`my-6 overflow-x-auto ${className}`.trim()}>
      <Table>
        <TableHeader>
          <TableRow>
            {data.headers.map((header, index) => (
              <TableHead key={index} className="text-foreground font-semibold">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="text-foreground">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
