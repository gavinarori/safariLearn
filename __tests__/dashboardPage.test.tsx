
import { render, screen, waitFor } from "@testing-library/react"
import Page from "@/app/dashboard/page"
import { AuthProvider } from "@/contexts/auth"

const mockGetCourses = jest.fn()
const mockGetSummary = jest.fn()
const mockGetChart = jest.fn()

jest.mock("@/services/userDashboardService", () => ({
  UserDashboardService: jest.fn().mockImplementation(() => ({
    getCourses: mockGetCourses,
    getSummary: mockGetSummary,
    getChart: mockGetChart,
  })),
}))


jest.mock("@/superbase/client", () => ({
  createClient: jest.fn(() => ({
    auth: { getUser: jest.fn() },
    from: jest.fn(() => ({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: null }) })),
  })),
}))

describe("Dashboard Page", () => {
  beforeEach(() => {
    mockGetCourses.mockReset()
    mockGetSummary.mockReset()
    mockGetChart.mockReset()
  })

  it("shows skeleton while loading", async () => {
    mockGetCourses.mockReturnValue(new Promise(() => {}))
    mockGetSummary.mockReturnValue(new Promise(() => {}))
    mockGetChart.mockReturnValue(new Promise(() => {}))

    render(
      <AuthProvider>
        <Page />
      </AuthProvider>
    )


    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("renders courses after fetch", async () => {
    mockGetCourses.mockResolvedValue([
      {
        course_id: "1",
        course_name: "Test Course",
        status: "in_progress",
        progress_percent: 50,
        enrolled_at: "2026-03-04",
      },
    ])
    mockGetSummary.mockResolvedValue({
      user_id: "user1",
      total_courses: 1,
      completed_courses: 0,
      courses_in_progress: 1,
      avg_progress_percent: 50,
    })
    mockGetChart.mockResolvedValue([])

    render(
      <AuthProvider>
        <Page />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText("Test Course")).toBeInTheDocument()
    })
  })
})