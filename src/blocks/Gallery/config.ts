import { Block } from 'payload'

export const Gallery: Block = {
  interfaceName: 'GalleryBlockT',
  slug: 'gallery',
  labels: { singular: 'Galería', plural: 'Galerías' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: ['grid', 'masonry', 'carousel'],
      defaultValue: 'grid',
    },
  ],
}
