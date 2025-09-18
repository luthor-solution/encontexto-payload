import { Media } from '@/payload-types'
import { getMediaUrl } from './getMediaUrl'

export const mediaUrl = (m?: Media | string) => {
  if (!m) return undefined
  if (typeof m === 'string') return getMediaUrl(m)
  return getMediaUrl(m.filename || '')
}
