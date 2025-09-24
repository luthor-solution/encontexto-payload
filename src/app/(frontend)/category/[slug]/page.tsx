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
  return payload.find({
    collection: 'posts',
    where: { categories: { contains: categoryId } },
    sort: '-publishedAt',
    depth: 1,
    page,
    limit: pageSize,
  })
}

/** ISR / caching de la ruta */
export const revalidate = 60 // revalida cada 60s

type PageProps = {
  params: Promise<{ slug: string }>
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
export default async function CategoryPage({ params }: PageProps) {
  const pageSize = PAGE_SIZE_DEFAULT
  const page = 1
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
    page,
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
              const { src, alt } = coverFrom(post)
              return (
                <li
                  key={post.id}
                  className="border rounded-xl overflow-hidden hover:shadow-md transition"
                >
                  <a href={`/posts/${post.slug}`} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {src ? (
                      <img
                        src={src}
                        alt={alt}
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
        {/* {totalPages > 1 && (
          <nav className="flex items-center gap-2 justify-center mt-10" aria-label="Paginación">
            <a
              href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : '#'}
              className={`px-4 py-2 rounded border ${currentPage > 1 ? 'hover:bg-neutral-50' : 'opacity-40 pointer-events-none'}`}
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
                // insert dots
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push(-1)
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === -1 ? (
                  <span key={`dots-${i}`} className="px-2 text-neutral-500">
                    …
                  </span>
                ) : (
                  <a
                    key={p}
                    href={p === 1 ? `${basePath}` : `${basePath}?page=${p}`}
                    aria-current={p === currentPage ? 'page' : undefined}
                    className={`px-3 py-2 rounded border ${p === currentPage ? 'bg-black text-white border-black' : 'hover:bg-neutral-50'}`}
                  >
                    {p}
                  </a>
                ),
              )}
            <a
              href={currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : '#'}
              className={`px-4 py-2 rounded border ${currentPage < totalPages ? 'hover:bg-neutral-50' : 'opacity-40 pointer-events-none'}`}
            >
              Siguiente →
            </a>
          </nav>
        )} */}
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
            url: `${ORIGIN}${basePath}${page > 1 ? `?page=${page}` : ''}`,
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
