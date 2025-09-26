import Link from 'next/link'
import { getHeroGridData } from './getHeroGridData'
import { Category, CategorySectionBlock, Post } from '@/payload-types'
import { getPostImage } from '@/utilities/getPostImage'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'

const PostGrid = ({ doc }: { doc: Post }) => {
  const cover = (p: Post) => {
    const image = getPostImage(p)

    return {
      src: image,
      alt: p.seo?.metaTitle || p.title,
    }
  }

  const href = (p?: Post) => (p?.slug ? `/posts/${p.slug}` : '#')

  const { src, alt } = cover(doc)
  return (
    <Link href={href(doc)} aria-hidden="true">
      <div className="relative group overflow-hidden h-full min-h-[200px]">
        {src && (
          <img
            loading="lazy"
            className="object-cover object-center m-0 w-100 transition-all group-hover:scale-110 h-full w-full"
            alt={alt}
            src={src}
          />
        )}

        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="p-2 absolute bottom-0 left-0">
          <div className="text-white">{doc.title}</div>
        </div>
      </div>
    </Link>
  )
}

export default async function CategorySection(props: CategorySectionBlock) {
  const payload = await getPayload({ config: payloadConfig })

  const { limit = 5, columns } = props
  const category = props.category as Category
  const docs = (await getHeroGridData({
    payload,
    limit,
    category: category.id,
  })) as Post[]

  if (!docs?.length) return null

  return (
    <div>
      <h3 className="mb-2 font-medium text-xl">{category.title}</h3>
      <div className={`grid gap-1 w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-[${columns}]`}>
        {docs.map((p, i) => {
          return (
            <div key={p.id ?? i}>
              <PostGrid doc={p} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
