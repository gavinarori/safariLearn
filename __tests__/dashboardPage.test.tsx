import { render, screen, waitFor } from "@testing-library/react"
import Page from "@/app/dashboard/page"
import * as serviceModule from "@/services/userDashboardService"

jest.mock("@/superbase/client", () => ({
  createClient: () => ({}),
}))

describe("Dashboard Page", () => {
  it("shows skeleton while loading", () => {
    jest
      .spyOn(serviceModule, "UserDashboardService")
      .mockImplementation(() => ({
        getEnrolledCourses: jest.fn(() => new Promise(() => {})),
      }) as any)

    render(<Page />)

    expect(screen.getByText(/loading/i)).toBeTruthy()
  })

  it("renders courses after fetch", async () => {
    jest
      .spyOn(serviceModule, "UserDashboardService")
      .mockImplementation(() => ({
        getEnrolledCourses: jest.fn().mockResolvedValue([
          {
            course_id: "1",
            course_name: "React Mastery",
            status: "completed",
            progress_percent: 100,
            completed_lessons: 10,
            total_lessons: 10,
          },
        ]),
      }) as any)

    render(<Page />)

    await waitFor(() => {
      expect(screen.getByText("React Mastery")).toBeInTheDocument()
    })
  })
})