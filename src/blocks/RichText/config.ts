import { Block } from 'payload'

export const RichText: Block = {
  interfaceName: 'RichTextBlockT',
  slug: 'richText',
  labels: { singular: 'Texto Enriquecido', plural: 'Textos' },
  fields: [
    {
      name: 'data',
      type: 'richText',
      required: true,
    },
  ],
}
