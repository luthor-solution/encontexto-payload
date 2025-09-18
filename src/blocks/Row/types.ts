export type ColSpan = {
  base?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export type RowBlock = {
  id: string
  blockType: 'row'
  asContainer?: boolean
  maxWidth?: 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  background?: 'transparent' | 'white' | 'neutral-900' | 'zinc-50' | 'panel'
  paddingY?: string
  gap?: string
  alignY?: 'items-start' | 'items-center' | 'items-end' | 'items-stretch'
  alignX?: 'justify-start' | 'justify-center' | 'justify-end' | 'justify-between'
  cols?: ColSpan
  cells: {
    id?: string
    span?: ColSpan
    vAlign?: 'self-stretch' | 'self-start' | 'self-center' | 'self-end'
    blocks: any[] // tus blocks internos
  }[]
  className?: string
}
