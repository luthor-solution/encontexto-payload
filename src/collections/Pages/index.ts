import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { Row } from '@/blocks/Row/config'
import { HeroGrid } from '@/blocks/HeroGrid/config'
import { PerspectiveEconomyChart } from '@/blocks/PerspectiveEconomyChart/config'

// ➕ nuevos imports
import { PopularNews } from '@/blocks/PopularNews/config'
import { PromotedNews } from '@/blocks/PromotedNews/config'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })
        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              // Puedes mantener tus bloques actuales
              blocks: [Row, HeroGrid, PerspectiveEconomyChart],
              required: true,
              admin: { initCollapsed: true },
            },
          ],
        },

        // ➕ NUEVA PESTAÑA SOLO PARA /home
        {
          label: 'Right Column (Home)',
          fields: [
            {
              name: 'populars',
              label: 'Populares / Destacadas',
              type: 'relationship',
              relationTo: 'posts',
              admin: {
                hidden: true,
                description: 'Noticias que aparecen en la columan de populares.',
              },
            },
            {
              name: 'newspopulars',
              label: 'Populares / Destacadas',
              type: 'relationship',
              relationTo: 'posts',
              admin: {
                description: 'Noticias que aparecen en la columan de populares.',
              },
              hasMany: true,
            },
            {
              name: 'sponsors',
              label: 'Patrocinados',
              type: 'relationship',
              relationTo: 'posts',
              admin: {
                description: 'Noticias que aparecen en la columan de patrocinados.',
              },
              hasMany: true,
            },
          ],
          // Mostrar solo si el slug es 'home' o '/home'
          admin: {
            condition: (data: any) => {
              const s = (data?.slug || '').toString().replace(/^\//, '')
              return s === 'home'
            },
          },
        },

        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
