import { Block } from 'payload'

export const CategorySection: Block = {
  slug: 'categorySection',
  interfaceName: 'CategorySectionBlock',
  labels: {
    singular: 'Sección de Categorías',
    plural: 'Sección de Categorías',
  },
  fields: [
    {
      name: 'columns',
      type: 'number',
      label: 'Items en la fila',
      min: 1,
      defaultValue: 2,
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Items a mostrar',
      min: 1,
      defaultValue: 4,
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoria a mostrar',
      required: true,
    },
  ],
}
