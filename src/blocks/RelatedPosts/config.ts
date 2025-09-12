import { Block } from 'payload'

export const RelatedPosts: Block = {
  interfaceName: 'RelatedPostsBlockT',
  slug: 'relatedPosts',
  labels: { singular: 'Relacionados', plural: 'Relacionados' },
  fields: [
    { name: 'mode', type: 'select', options: ['auto', 'manual'], defaultValue: 'auto' },
    {
      name: 'manual',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { condition: (data, sibling) => sibling?.mode === 'manual' },
    },
    { name: 'limit', type: 'number', defaultValue: 4, min: 1, max: 8 },
  ],
}
