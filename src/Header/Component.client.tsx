'use client'
import { useTheme } from '@/providers/Theme'
import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const { theme } = useTheme()

  return (
    <div className="border-b border-solid">
      <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
        <div className="py-2 md:py-6 flex justify-between">
          <Link href="/">
            <Logo loading="eager" priority="high" dark={theme == 'dark'} />
          </Link>
          <HeaderNav data={data} />
        </div>
      </header>
    </div>
  )
}
