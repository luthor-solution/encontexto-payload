import { Block } from 'payload'

export const Hero: Block = {
  interfaceName: 'HeroBlockT',
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heros' },
  fields: [
    { name: 'overline', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'mediaType',
      type: 'select',
      options: [
        { label: 'Imagen', value: 'image' },
        { label: 'Video (upload)', value: 'video' },
        { label: 'Video (URL)', value: 'videoUrl' },
      ],
      defaultValue: 'image',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data, sibling) => sibling?.mediaType === 'image' },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data, sibling) => sibling?.mediaType === 'video' },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: { condition: (data, sibling) => sibling?.mediaType === 'videoUrl' },
    },
    {
      name: 'align',
      type: 'select',
      options: ['center', 'left'],
      defaultValue: 'center',
    },
    { name: 'darkOverlay', type: 'checkbox', defaultValue: true },
  ],
}
