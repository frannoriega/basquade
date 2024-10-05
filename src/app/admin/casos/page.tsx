import CaseList from "@/components/case-list";
import { getCases } from "@/lib/db/cases";
import { getCategories } from "@/lib/db/categories";

export const dynamic = 'force-dynamic'

export default async function CasesPage() {
  const cases = (await getCases()).map((c) => {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      books: c._count.books
    }
  })
  const categories = await getCategories()
  return <CaseList cases={cases} categories={categories}/>
}
