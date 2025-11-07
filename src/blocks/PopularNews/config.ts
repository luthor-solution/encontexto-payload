import type { Block } from 'payload'

export const PopularNews: Block = {
  slug: 'popularNews',
  labels: {
    singular: 'Noticias populares',
    plural: 'Noticias populares',
  },
  imageURL: '/assets/blocks/news-popular.svg', // opcional si manejas íconos de bloques
  interfaceName: 'PopularNewsBlock',
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
          defaultValue: 5,
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
          'Selecciona manualmente las noticias que aparecerán como “populares” en la columna derecha.',
      },
    },
  ],
}
