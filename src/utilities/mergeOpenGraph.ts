import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Diario Contexto Jalisco es un portal digital que ofrece cobertura actualizada del estado de Jalisco: política, sociedad, cultura, economía y eventos. Mantente informado con rigor y rapidez.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'Diario Contexto',
  title: 'Diario Contexto Jalisco – Noticias locales, opinión y actualidad',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
