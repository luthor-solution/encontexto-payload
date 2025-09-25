import { BasePayload, Where } from 'payload'

type Args = {
  payload: BasePayload
  category?: number
  limit?: number
}

export async function getHeroGridData({ payload, category, limit = 5 }: Args) {
  const where: Where = {
    status: {
      equals: 'published',
    },
    categories: {
      contains: category,
    },
  }

  const res = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit,
  })

  return res.docs
}
