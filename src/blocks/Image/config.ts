import { Block } from 'payload'

export const ImageBlock: Block = {
  interfaceName: 'ImageBlockT',
  slug: 'image',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'alt', type: 'text', required: true },
    {
      name: 'display',
      type: 'select',
      options: [
        { label: 'Ancho de texto', value: 'inline' },
        { label: 'Ancho completo', value: 'full' },
      ],
      defaultValue: 'inline',
    },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
  ],
}
