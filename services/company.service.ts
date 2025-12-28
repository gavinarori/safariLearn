import { createClient } from "@/superbase/client";

export interface CreateCompanyInput {
  companyName: string
  industry?: string
  country?: string
}

const supabase = createClient();

export class CompanyService {
  /**
   * Registers a company and upgrades the current user to company_admin
   */
  static async registerCompany(input: CreateCompanyInput) {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("Not authenticated")

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: input.companyName,
        industry: input.industry,
        country: input.country,
      })
      .select()
      .single()

    if (companyError) throw companyError

    const { error: userError } = await supabase
      .from("users")
      .update({
        company_id: company.id,
        role: "company_admin",
      })
      .eq("id", auth.user.id)

    if (userError) throw userError

    return company
  }
}
