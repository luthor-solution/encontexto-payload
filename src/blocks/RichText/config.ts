import { Block } from 'payload'

export const RichText: Block = {
  interfaceName: 'RichTextBlockT',
  slug: 'richText',
  labels: { singular: 'Texto Enriquecido', plural: 'Textos' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        elements: ['h2', 'h3', 'h4', 'link', 'ol', 'ul', 'blockquote', 'upload', 'relationship'],
        leaves: ['bold', 'italic', 'underline', 'strikethrough', 'code'],
      },
    },
  ],
}
