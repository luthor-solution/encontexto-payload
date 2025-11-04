/* eslint-disable @next/next/no-img-element */
import { getPostImage } from '@/utilities/getPostImage'
import payloadConfig from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

/** Ajusta estos valores a tu proyecto */
const SITE_NAME = 'Diario en Contexto'
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diariocontexto.com.mx'
const PAGE_SIZE_DEFAULT = 12

/** Datos */
async function getCategoryBySlug(slug: string, locale: 'es' | 'en' | 'pt' = 'es') {
  const payload = await getPayload({ config: payloadConfig })
  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })
  return res.docs[0] ?? null
}

async function getPostsByCategory(opts: {
  categoryId: number
  page: number
  pageSize: number
  locale?: 'es' | 'en' | 'pt'
}) {
  const { categoryId, page, pageSize, locale = 'es' } = opts
  const payload = await getPayload({ config: payloadConfig })
  return payload
    .find({
      collection: 'posts',
      where: { categories: { contains: categoryId } },
      sort: '-publishedAt',
      depth: 1,
      page,
      limit: pageSize,
    })
    .then((r) => ({
      ...r,
      page: r.page || 1,
    }))
}

/** ISR / caching de la ruta */
export const revalidate = 60 // revalida cada 60s

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

/** SEO dinámico por categoría + página */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pageNum = 1
  const locale = 'es'
  const category = await getCategoryBySlug(slug, locale)
  if (!category) return {}

  const baseTitle = `${category.title} | ${SITE_NAME}`
  const title = pageNum > 1 ? `${baseTitle} (página ${pageNum})` : baseTitle
  const canonical =
    pageNum > 1 ? `${ORIGIN}/category/${slug}?page=${pageNum}` : `${ORIGIN}/category/${slug}`

  return {
    title,
    description: `Últimas noticias de ${category.title}.`,
    alternates: { canonical },
    openGraph: {
      title,
      description: `Últimas noticias de ${category.title}.`,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
    },
  }
}

/** SSG de slugs de categorías */
export async function generateStaticParams() {
  const payload = await getPayload({ config: payloadConfig })
  const res = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1000,
    where: {}, // todas
  })
  return res.docs.map((c: any) => ({ slug: c.slug }))
}

/** Helpers de UI (sin dependencias client) */
function formatDate(d?: string, locale: string = 'es') {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}

function coverFrom(post: any) {
  const cv = post?.coverImage
  if (!cv) return { src: '', alt: '' }
  if (typeof cv === 'string') return { src: cv, alt: post.title ?? '' }
  return { src: cv.url ?? '', alt: cv.alt ?? post.title ?? '' }
}

/** Página */
export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { page = '1' } = await searchParams
  const pageSize = PAGE_SIZE_DEFAULT
  const pageN = Number(page)
  const locale = 'es'
  const { slug } = await params

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const {
    docs,
    totalDocs,
    totalPages,
    page: currentPage,
  } = await getPostsByCategory({
    categoryId: category.id,
    page: pageN,
    pageSize,
  })

  const basePath = `/category/${slug}`

  return (
    <>
      {/* Encabezado */}
      <header className="container mx-auto px-4 py-6">
        <h1 className="text-3xl md:text-4xl font-bold">{category.title}</h1>
        <p className="text-neutral-600 mt-1">
          {totalDocs} {totalDocs === 1 ? 'artículo' : 'artículos'}
        </p>
      </header>

      {/* Lista de posts */}
      <section className="container mx-auto px-4 pb-10">
        {docs.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            No hay publicaciones en esta categoría.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((post: any) => {
              const src = getPostImage(post)
              return (
                <li
                  key={post.id}
                  className="border rounded-xl overflow-hidden hover:shadow-md transition"
                >
                  <a href={`/posts/${post.slug}`} className="block">
                    {src ? (
                      <img
                        src={src}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 bg-neutral-200" />
                    )}
                    <div className="p-4">
                      <h2 className="text-lg font-semibold line-clamp-2">{post.title}</h2>
                      <p className="text-sm text-neutral-500 mt-1">
                        {formatDate(post.publishedAt, locale)}
                      </p>
                      {post.excerpt ? (
                        <p className="text-sm text-neutral-700 mt-2 line-clamp-3">{post.excerpt}</p>
                      ) : null}
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-2 mt-10 text-sm"
            aria-label="Paginación"
          >
            <a
              href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : '#'}
              className={`px-4 py-2 rounded border transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                focus-visible:ring-neutral-400 focus-visible:ring-offset-white
                dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-900
        ${
          currentPage > 1
            ? `bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50
             dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800`
            : 'opacity-40 pointer-events-none'
        }`}
            >
              ← Anterior
            </a>

            {Array.from({ length: totalPages })
              .map((_, i) => i + 1)
              .filter((p) => {
                const window = 3
                return (
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - window && p <= currentPage + window)
                )
              })
              .reduce<number[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push(-1)
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === -1 ? (
                  <span key={`dots-${i}`} className="px-2 text-neutral-500 dark:text-neutral-400">
                    …
                  </span>
                ) : (
                  <a
                    key={p}
                    href={p === 1 ? `${basePath}` : `${basePath}?page=${p}`}
                    aria-current={p === currentPage ? 'page' : undefined}
                    className={`px-3 py-2 rounded border font-medium transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              focus-visible:ring-neutral-400 focus-visible:ring-offset-white
              dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-900
              ${
                p === currentPage
                  ? `bg-neutral-900 text-white border-neutral-900
                   dark:bg-white dark:text-neutral-900 dark:border-white`
                  : `bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50
                   dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800`
              }`}
                  >
                    {p}
                  </a>
                ),
              )}
            <a
              href={currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : '#'}
              className={`px-4 py-2 rounded border transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-neutral-400 focus-visible:ring-offset-white
        dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-900
        ${
          currentPage < totalPages
            ? `bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50
             dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800`
            : 'opacity-40 pointer-events-none'
        }`}
            >
              Siguiente →
            </a>
          </nav>
        )}
      </section>

      {/* JSON-LD básico para CollectionPage + NewsArticle */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${category.title} | ${SITE_NAME}`,
            url: `${ORIGIN}${basePath}${pageN > 1 ? `?page=${page}` : ''}`,
            hasPart: docs.map((post: any) => ({
              '@type': 'NewsArticle',
              headline: post.title,
              datePublished: post.publishedAt,
              url: `${ORIGIN}/posts/${post.slug}`,
              image: coverFrom(post).src || undefined,
            })),
          }),
        }}
      />
    </>
  )
}
