import { Media, Post } from '@/payload-types'
import { mediaUrl } from './mediaUrl'

export const getPostImage = (post: Post) => {
  const jsonldImg = mediaUrl(
    (post.seo?.jsonld?.image as Media) || (post.seo?.openGraph?.ogImage as Media),
  )

  return jsonldImg
}
