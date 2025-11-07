import type { Block } from 'payload'

export const PromotedNews: Block = {
  slug: 'promotedNews',
  labels: {
    singular: 'Noticias promocionadas',
    plural: 'Noticias promocionadas',
  },
  imageURL: '/assets/blocks/news-promoted.svg', // opcional
  interfaceName: 'PromotedNewsBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título (opcional)',
          admin: { width: '50%' },
        },
        {
          name: 'limit',
          type: 'number',
          label: 'Límite de noticias a mostrar',
          defaultValue: 3,
          min: 1,
          max: 12,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      required: true,
      label: 'Selecciona noticias (manual)',
      admin: {
        description:
          'Selecciona manualmente las noticias que aparecerán como “promocionadas” en la columna derecha.',
      },
    },
  ],
}
