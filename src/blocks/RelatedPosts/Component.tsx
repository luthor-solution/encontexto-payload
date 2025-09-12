import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Media, Post } from '@/payload-types'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { mediaUrl } from '@/utilities/mediaUrl'
import dayjs from 'dayjs'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('w-full', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 gap-4 md:gap-8 items-stretch">
        {docs?.map((post, index) => {
          if (typeof post === 'string') return null

          const jsonldImg = mediaUrl(
            (post.seo?.jsonld?.image as Media) || (post.seo?.openGraph?.ogImage as Media),
          )

          return (
            <article key={index} className="flex gap-4">
              <img
                className="h-[60px] aspect-video border object-cover object-center"
                src={jsonldImg}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold line-clamp-2">{post.title}</span>
                <span className="text-xs">{dayjs(post.createdAt).format('MMMM DD, YYYY')}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
