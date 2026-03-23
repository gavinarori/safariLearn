import { LessonBlock } from '@/lib/types/course';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function TableBlock({ block, className = '' }: TableBlockProps) {
  // Parse markdown table from content field
  if (!block.content) {
    return null;
  }

  const lines = block.content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;

  // Parse header row
  const headerLine = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
  
  // Skip separator line (lines[1])
  // Parse data rows
  const bodyLines = lines.slice(2);
  const bodyRows = bodyLines.map(line => 
    line.split('|').map(cell => cell.trim()).filter(cell => cell)
  );

  return (
    <div className={`my-6 overflow-x-auto ${className}`.trim()}>
      <Table>
        <TableHeader>
          <TableRow>
            {headerLine.map((header, index) => (
              <TableHead key={index} className="text-foreground font-semibold">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bodyRows.map((row, rowIndex) => (
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
