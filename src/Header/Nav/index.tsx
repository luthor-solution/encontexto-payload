'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-4 items-center">
      <ThemeSelector />
      <Link href="/search">
        <span className="sr-only">Search</span>
        <MagnifyingGlassIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
