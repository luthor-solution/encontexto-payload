import { Block } from 'payload'

export const HeroGrid: Block = {
  slug: 'heroGrid',
  labels: { singular: 'Hero Grid', plural: 'Hero Grids' },
  imageURL: '/media/blocks/hero-grid.png',
  fields: [
    {
      name: 'source',
      type: 'select',
      label: 'Fuente de posts',
      defaultValue: 'latest',
      options: [
        { label: 'Últimos publicados', value: 'latest' },
        { label: 'Por categoría', value: 'byCategory' },
        { label: 'Selección manual', value: 'manual' },
      ],
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoría',
      admin: { condition: (_, siblingData) => siblingData?.source === 'byCategory' },
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Posts (selección manual)',
      admin: { condition: (_, siblingData) => siblingData?.source === 'manual' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'limit',
          type: 'number',
          label: 'Cantidad total',
          defaultValue: 5,
          min: 1,
          max: 12,
          admin: { description: 'Usa 5 para layout (1 principal + 4 secundarios).' },
        },
        {
          name: 'offset',
          type: 'number',
          label: 'Saltar (offset)',
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      name: 'showDates',
      type: 'checkbox',
      label: 'Mostrar fechas',
      defaultValue: true,
    },
    {
      name: 'locale',
      type: 'select',
      label: 'Idioma de preferencia',
      defaultValue: 'es',
      options: [
        { label: 'Español', value: 'es' },
        { label: 'Inglés', value: 'en' },
        { label: 'Portugués', value: 'pt' },
      ],
    },
  ],
}
