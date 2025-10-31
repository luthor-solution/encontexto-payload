'use client'
import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/Logo/Logo'
import { useTheme } from '@/providers/Theme'

export function FooterClient() {
  const { theme } = useTheme()

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo loading="eager" priority="high" dark={theme == 'dark'} />
        </Link>
      </div>
    </footer>
  )
}
