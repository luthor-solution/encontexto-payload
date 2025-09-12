import { Block } from 'payload'
export const Quote: Block = {
  interfaceName: 'QuoteBlockT',
  slug: 'quote',
  labels: { singular: 'Cita', plural: 'Citas' },
  fields: [
    { name: 'text', type: 'textarea', required: true },
    { name: 'author', type: 'text' },
    { name: 'source', type: 'text' },
    { name: 'emphasis', type: 'checkbox', defaultValue: true },
  ],
}
