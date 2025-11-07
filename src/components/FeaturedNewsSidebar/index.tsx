/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPostImage } from '@/utilities/getPostImage'

type Props = {
  title?: string
  limit?: number
  basePath?: string // ruta base de tus posts, p.ej. '/noticias' o '/posts'
}

export default async function FeaturedNewsSidebar({
  title = 'Noticias populares',
  limit = 6,
  basePath = '/posts',
}: Props) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  // Ajusta nombres de colección/campos según tu setup
  const res = await payload.find({
    collection: 'posts',
    draft,
    limit,
    sort: '-publishedAt',
    pagination: false,
    where: {},
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      seo: true,
    },
  })

  if (!res.docs?.length) return null

  return (
    <aside className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="space-y-4">
        {res.docs.map((post) => {
          const href = `${basePath}/${post.slug}`
          const date = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              })
            : null
          const image = getPostImage(post as any)

          return (
            <li
              key={post.slug}
              className="group border border-solid rounded-lg overflow-hidden p-2"
            >
              <Link href={href} className="flex gap-3">
                <div className="relative shrink-0 w-24 h-16 overflow-hidden rounded-md border border-zinc-200/40 dark:border-zinc-800/60">
                  <img
                    src={image || ''}
                    alt={post.title}
                    className="object-cover transition-transform group-hover:scale-[1.03]"
                    sizes="96px"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base md:text-xl font-medium leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  {date && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{date}</p>}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
