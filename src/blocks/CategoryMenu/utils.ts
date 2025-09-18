import { Category } from '@/payload-types'
import payloadConfig from '@payload-config'
import { getPayload } from 'payload'

type Args = {
  source: 'all' | 'selected'
  selectedCategories?: Array<number | { id: number }>
  maxCategories?: number
}

export async function getCategoryMenuData({
  source,
  selectedCategories,
  maxCategories,
}: Args): Promise<Array<Category & { count?: number }>> {
  const payload = await getPayload({ config: payloadConfig })
  let cats: Category[] = []

  if (source === 'selected' && selectedCategories?.length) {
    const ids = selectedCategories.map((c: any) => (typeof c === 'number' ? c : c.id))
    const res = await payload.find({
      collection: 'categories',
      where: { id: { in: ids } },
      depth: 0,
      limit: ids.length,
    })
    // Mantener orden manual
    cats = ids.map((id) => res.docs.find((d) => d.id === id)).filter(Boolean) as Category[]
  } else {
    const res = await payload.find({
      collection: 'categories',
      where: {},
      depth: 0,
      sort: 'title',
      limit: maxCategories,
    })
    cats = res.docs as Category[]
  }

  return cats
}
