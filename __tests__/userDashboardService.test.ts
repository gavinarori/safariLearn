import { UserDashboardService } from "@/services/userDashboardService"

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
}

describe("UserDashboardService", () => {
  let service: UserDashboardService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new UserDashboardService(mockSupabase as any)
  })

  describe("getEnrolledCourses", () => {
    it("returns mapped enrolled courses correctly", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
      })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "enrollments") {
          return {
            select: () => ({
              eq: () => ({
                in: () => ({
                  order: () =>
                    Promise.resolve({
                      data: [
                        {
                          enrolled_at: "2024-01-01",
                          course_id: "course-1",
                          courses: { title: "React Course" },
                        },
                      ],
                      error: null,
                    }),
                }),
              }),
            }),
          }
        }

        if (table === "lessons") {
          return {
            select: () => ({
              in: () =>
                Promise.resolve({
                  data: [
                    { id: "lesson-1", course_id: "course-1" },
                    { id: "lesson-2", course_id: "course-1" },
                  ],
                }),
            }),
          }
        }

        if (table === "lesson_progress") {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  in: () =>
                    Promise.resolve({
                      data: [{ lesson_id: "lesson-1" }],
                    }),
                }),
              }),
            }),
          }
        }

        return {}
      })

      const result = await service.getEnrolledCourses()

      expect(result).toHaveLength(1)
      expect(result[0].course_name).toBe("React Course")
      expect(result[0].progress_percent).toBe(50)
      expect(result[0].completed_lessons).toBe(1)
      expect(result[0].total_lessons).toBe(2)
    })

    it("returns empty array if no user", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const result = await service.getEnrolledCourses()
      expect(result).toEqual([])
    })
  })
})