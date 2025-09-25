import { Post } from '@/payload-types'
import { BasePayload, Where } from 'payload'

type Args = {
  payload: BasePayload
  source: 'latest' | 'byCategory' | 'manual'
  category?: string | { id: string }
  posts?: Array<string | { id: string }>
  limit?: number
  offset?: number
  locale?: 'es' | 'en' | 'pt'
}

export async function getHeroGridData({
  payload,
  source,
  category,
  posts,
  limit = 5,
  offset = 0,
  locale = 'es',
}: Args) {
  if (source === 'manual' && posts?.length) {
    const ids = posts.map((p: any) => (typeof p === 'string' ? p : p.id))
    const res = await payload.find({
      collection: 'posts',
      where: { id: { in: ids } },
      depth: 2,
      limit: ids.length,
    })
    // mantener el orden de selección manual
    const ordered = ids.map((id) => res.docs.find((d) => d.id === id)).filter(Boolean) as Post[]
    return ordered
  }

  const where: Where = {
    status: {
      equals: 'published',
    },
  }
  if (source === 'byCategory' && category) {
    const catId = typeof category === 'string' ? category : category.id
    where['categories'] = { contains: catId }
  }

  const res = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit,
    page: Math.floor(offset / limit) + 1,
  })

  return res.docs
}
