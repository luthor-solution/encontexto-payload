import { Block } from 'payload'

export const Embed: Block = {
  interfaceName: 'EmbedBlockT',
  slug: 'embed',
  labels: { singular: 'Embed', plural: 'Embeds' },
  fields: [
    {
      name: 'provider',
      type: 'select',
      options: ['youtube', 'x', 'tiktok', 'custom'],
      defaultValue: 'youtube',
    },
    { name: 'url', type: 'text', required: true },
    { name: 'title', type: 'text' },
  ],
}
