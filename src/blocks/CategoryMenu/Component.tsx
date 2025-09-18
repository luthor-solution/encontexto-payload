import CategoryMenuClient from './CategoryMenuClient'
import { getCategoryMenuData } from './utils'

type CategoryMenuBlock = {
  basePath?: string
  source: 'all' | 'selected'
  selectedCategories?: Array<number | { id: number }>
  maxCategories?: number
}

export default async function CategoryMenu(block: CategoryMenuBlock) {
  const { basePath = '/category', source, selectedCategories, maxCategories = 20 } = block

  const cats = await getCategoryMenuData({
    source,
    selectedCategories,
    maxCategories,
  })

  const items = [
    ...cats.map((c) => ({
      type: 'category' as const,
      label: c.title ?? 'Sin título',
      href: `${basePath.replace(/\/$/, '')}/${c.slug}`,
      count: (c as any).count as number | undefined,
    })),
  ]

  return <CategoryMenuClient items={items} />
}
