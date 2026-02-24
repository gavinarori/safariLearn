"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconCircleCheckFilled,
  IconGripVertical,
  IconLoader,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



export const schema = z.object({
  id: z.string(),
  courseName: z.string(),
  status: z.enum(["Completed", "In Progress"]),
  progress: z.number(),
  lessonsCompleted: z.number(),
  totalLessons: z.number(),
})

export type Course = z.infer<typeof schema>


function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground"
    >
      <IconGripVertical className="size-4" />
    </Button>
  )
}


const columns: ColumnDef<Course>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
  },
  {
    accessorKey: "courseName",
    header: "Course",
    cell: ({ row }) => <CourseViewer item={row.original} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="outline" className="flex gap-1 items-center">
          {status === "Completed" ? (
            <IconCircleCheckFilled className="size-4 text-green-500" />
          ) : (
            <IconLoader className="size-4 animate-spin" />
          )}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="w-40">
        <div className="text-xs text-muted-foreground mb-1">
          {row.original.progress}%
        </div>
        <div className="h-2 bg-muted rounded">
          <div
            className="h-2 bg-primary rounded"
            style={{ width: `${row.original.progress}%` }}
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
        {row.original.lessonsCompleted}/{row.original.totalLessons}
      </span>
    ),
  },
]



function DraggableRow({ row }: { row: Row<Course> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="data-[dragging=true]:opacity-60"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}



export function DataTable({ data: initial }: { data: Course[] }) {
  const [data, setData] = React.useState(initial)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  React.useEffect(() => {
    setData(initial)
  }, [initial])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const ids = React.useMemo<UniqueIdentifier[]>(
    () => data.map((d) => d.id),
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    getRowId: (row, i) => row.id ?? String(i),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
  })

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return

    setData((prev) => {
      const oldIndex = ids.indexOf(active.id)
      const newIndex = ids.indexOf(over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      sensors={sensors}
      onDragEnd={onDragEnd}
    >
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
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
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </div>
    </DndContext>
  )
}




const chartData = [
  { month: "Jan", value: 10 },
  { month: "Feb", value: 40 },
  { month: "Mar", value: 65 },
  { month: "Apr", value: 80 },
  { month: "May", value: 100 },
]

const chartConfig = {
  value: {
    label: "Progress",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function CourseViewer({ item }: { item: Course }) {
  const mobile = useIsMobile()

  return (
    <Drawer direction={mobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 font-medium">
          {item.courseName}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.courseName}</DrawerTitle>
          <DrawerDescription>Course analytics</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-6">

          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="value"
                type="monotone"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>

          <div className="text-sm text-muted-foreground flex items-center gap-2">
            Progress improving <IconTrendingUp className="size-4" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Status</Label>
              <div>{item.status}</div>
            </div>
            <div>
              <Label>Progress</Label>
              <div>{item.progress}%</div>
            </div>
            <div>
              <Label>Lessons</Label>
              <div>
                {item.lessonsCompleted}/{item.totalLessons}
              </div>
            </div>
            <div>
              <Label>Course ID</Label>
              <div className="truncate">{item.id}</div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}