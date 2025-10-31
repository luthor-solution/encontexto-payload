// app/[slug]/page.tsx (o el archivo que compartiste)
import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

// NUEVO: importa tu sidebar
import FeaturedNewsSidebar from '@/components/FeaturedNewsSidebar'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  const params = pages.docs?.filter((doc) => doc.slug !== 'home').map(({ slug }) => ({ slug }))

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({ slug })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { layout } = page

  return (
    <main className="pt-4 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Layout de 2 columnas: contenido + sidebar */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contenido principal */}
          <section className="lg:col-span-8">
            <RenderBlocks blocks={layout} />
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div
              className="
      lg:sticky lg:top-24           /* se pega a 96px del tope (24 = 6rem) */
      lg:max-h-[calc(100vh-6rem)]   /* alto máximo = viewport - offset */
      lg:overflow-auto               /* scroll interno si se excede */
      lg:self-start                  /* evita estirarse en el grid */
    "
            >
              <FeaturedNewsSidebar basePath="/posts" limit={6} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({ slug })
  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
