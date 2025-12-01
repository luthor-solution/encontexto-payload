// app/[slug]/page.tsx (o el archivo que compartiste)
import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import FeaturedNewsSidebar from '@/components/FeaturedNewsSidebar'
import USDMXNWidget from '@/components/USDMXNWidget'
import WeatherWidget from '@/components/WeatherWidget'
import NewsTickerSlider, { NewsItem } from '@/components/NewsTickerSlider'
import payloadConfig from '@payload-config'
import Destacadas from '@/components/Destacadas'
import { Post } from '@/payload-types'

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

async function getNews(): Promise<NewsItem[]> {
  const payload = await getPayload({ config: payloadConfig })
  const news = await payload.find({
    collection: 'posts',
    limit: 12,
    select: {
      title: true,
      slug: true,
    },
    where: {
      categories: {
        not_in: [2],
      },
    },
  })

  return news.docs.map((r) => ({
    title: r.title,
    url: `/${r.slug}`,
  }))
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
  const items = await getNews()

  return (
    <main className="pt-4 pb-24">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Layout de 2 columnas: contenido + sidebar */}
      <div className="max-w-7xl mx-auto px-4">
        <NewsTickerSlider items={items} autoplayMs={4500} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Contenido principal */}
          <section className="lg:col-span-8">
            <WeatherWidget />
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
              <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3440639142447870"
                crossOrigin="anonymous"
              ></script>
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3440639142447870"
                data-ad-slot="3957879730"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
              <br />
              <USDMXNWidget />
              <br />
              <Destacadas title="Patrocinados" basePath="/posts" items={page.sponsors as Post[]} />
              <br />
              <Destacadas basePath="/posts" items={page.newspopulars as Post[]} />
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
    depth: 5,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
