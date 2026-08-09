import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import Page from "@/app/dashboard/page"

const mockGetEnrolledCourses = jest.fn()
const mockGetCompanyEmployeesCourseProgress = jest.fn()

jest.mock("@/services/userDashboardService", () => ({
  UserDashboardService: jest.fn().mockImplementation(() => ({
    getEnrolledCourses: mockGetEnrolledCourses,
    getCompanyEmployeesCourseProgress:
      mockGetCompanyEmployeesCourseProgress,
  })),
}))

jest.mock("@/superbase/client", () => ({
  createClient: jest.fn(() => {
    const userQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: "employee" },
        error: null,
      }),
    }

    return {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: "user1",
            },
          },
          error: null,
        }),
      },
      from: jest.fn(() => userQuery),
    }
  }),
}))

jest.mock("@/components/app-sidebar", () => ({
  AppSidebar: () => null,
}))

jest.mock("@/components/site-header", () => ({
  SiteHeader: () => null,
}))

jest.mock("@/components/section-cards", () => ({
  SectionCards: () => null,
}))

jest.mock("@/components/chart-area-interactive", () => ({
  ChartAreaInteractive: () => null,
}))

jest.mock("@/components/employees-data-table", () => ({
  EmployeesProgressTable: () => null,
}))

jest.mock("@/components/data-table", () => ({
  DataTable: ({
    data,
  }: {
    data: Array<{ id: string; courseName: string }>
  }) => (
    <div>
      {data.map((course) => (
        <span key={course.id}>{course.courseName}</span>
      ))}
    </div>
  ),
}))

jest.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  SidebarInset: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}))

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetCompanyEmployeesCourseProgress.mockResolvedValue([])
  })

  it("shows skeleton while loading", () => {
    mockGetEnrolledCourses.mockReturnValue(new Promise(() => {}))

    const { container } = render(<Page />)

    expect(
      container.querySelector(".animate-pulse")
    ).toBeInTheDocument()
  })

  it("renders courses after fetch", async () => {
    mockGetEnrolledCourses.mockResolvedValue([
      {
        user_id: "user1",
        course_id: "1",
        course_name: "Test Course",
        status: "in_progress",
        progress_percent: 50,
        enrolled_at: "2021-03-15",
        completed_lessons: 1,
        total_lessons: 2,
      },
    ])

    render(<Page />)

    expect(
      await screen.findByText("Test Course")
    ).toBeInTheDocument()
  })
})
