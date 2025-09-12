import { Block } from 'payload'

export const Timeline: Block = {
  interfaceName: 'TimelineBlockT',
  slug: 'timeline',
  labels: { singular: 'Cronología', plural: 'Cronologías' },
  fields: [
    {
      name: 'events',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'summary', type: 'textarea' },
      ],
    },
  ],
}
