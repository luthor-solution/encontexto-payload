import { Block } from 'payload'

export const CategoryMenu: Block = {
  slug: 'categoryMenu',
  labels: { singular: 'Menú de Categorías', plural: 'Menús de Categorías' },
  fields: [
    {
      name: 'basePath',
      type: 'text',
      label: 'Base path para categorías',
      defaultValue: '/category',
      admin: { description: 'Prefijo de las URLs de categoría, ej. /category o /blog/categoria' },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Fuente',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'Todas las categorías', value: 'all' },
        { label: 'Selección manual', value: 'selected' },
      ],
    },
    {
      name: 'selectedCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'selected',
        description: 'Arrastra para ordenar. Se respetará este orden.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxCategories',
          type: 'number',
          label: 'Máx. categorías (solo “Todas”)',
          defaultValue: 20,
          min: 1,
        },
      ],
    },
  ],
}
