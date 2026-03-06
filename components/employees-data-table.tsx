"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"



export type CourseStatus = "completed" | "in_progress" | "not_started"

export interface EmployeeCourseProgress {
  user_id: string
  full_name: string | null
  email: string | null
  course_id: string
  course_name: string
  progress_percent: number
  status: CourseStatus
  enrolled_at: string | null
  total_lessons: number
  completed_lessons: number
}



const columns: ColumnDef<EmployeeCourseProgress>[] = [
  {
    accessorKey: "full_name",
    header: "Employee",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.full_name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "course_name",
    header: "Course",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge variant="outline" className="flex items-center gap-1 w-fit">
          {status === "completed" ? (
            <IconCircleCheckFilled className="size-4 text-green-500" />
          ) : status === "in_progress" ? (
            <IconLoader className="size-4 animate-spin" />
          ) : null}
          {status.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "progress_percent",
    header: "Progress",
    cell: ({ row }) => (
      <div className="w-40">
        <div className="text-xs text-muted-foreground mb-1">
          {row.original.progress_percent}%
        </div>

        <div className="h-2 bg-muted rounded">
          <div
            className="h-2 bg-primary rounded"
            style={{ width: `${row.original.progress_percent}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    id: "lessons",
    header: "Lessons",
    cell: ({ row }) => (
      <span>
        {row.original.completed_lessons}/{row.original.total_lessons}
      </span>
    ),
  },
]



export function EmployeesProgressTable({
  data,
}: {
  data: EmployeeCourseProgress[]
}) {
  const [search, setSearch] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, value) => {
      const employee = row.original.full_name ?? ""
      const email = row.original.email ?? ""
      const course = row.original.course_name ?? ""

      return (
        employee.toLowerCase().includes(value.toLowerCase()) ||
        email.toLowerCase().includes(value.toLowerCase()) ||
        course.toLowerCase().includes(value.toLowerCase())
      )
    },
  })

  return (
    <div className="space-y-4">

      <Input
        placeholder="Search employee or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="border rounded-lg overflow-hidden">
        <Table>

          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  )
}