import { Block } from 'payload'

export const FactsList: Block = {
  interfaceName: 'FactsListBlockT',
  slug: 'factsList',
  labels: { singular: 'Lista Claves', plural: 'Listas Claves' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Lo clave en 30s' },
    {
      name: 'items',
      type: 'array',
      minRows: 3,
      maxRows: 8,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
