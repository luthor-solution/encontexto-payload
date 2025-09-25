'use client'

import React from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { Button } from '@heroui/react'
import { useTheme } from '..'

export const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      isIconOnly
      aria-label="Change theme"
      className="rounded-full w-6 h-6"
      onPress={toggleTheme}
    >
      {theme == 'light' && <SunIcon />}
      {theme == 'dark' && <MoonIcon />}
    </Button>
  )
}
