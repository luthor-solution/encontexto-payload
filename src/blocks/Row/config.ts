import type { Block } from 'payload'
import { RichText } from '../RichText/config'
import { Archive } from '../ArchiveBlock/config'
import { HeroGrid } from '../HeroGrid/config'
import { CategoryMenu } from '../CategoryMenu/config'

export const Row: Block = {
  slug: 'row',
  labels: { singular: 'Fila', plural: 'Filas' },
  fields: [
    {
      name: 'asContainer',
      type: 'checkbox',
      label: 'Usar contenedor (centrado y con max-width)',
      defaultValue: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      label: 'Ancho máximo',
      defaultValue: '7xl',
      options: [
        { label: 'Prosa (lg)', value: 'lg' },
        { label: 'Ancho (xl)', value: 'xl' },
        { label: 'Muy ancho (2xl)', value: '2xl' },
        { label: 'Full content (7xl)', value: '7xl' },
        { label: 'Pantalla completa', value: 'full' },
      ],
      admin: { condition: (_, siblingData) => siblingData.asContainer },
    },
    {
      name: 'background',
      type: 'select',
      label: 'Fondo',
      defaultValue: 'transparent',
      options: [
        { label: 'Transparente', value: 'transparent' },
        { label: 'Surface (claro)', value: 'white' },
        { label: 'Surface (oscuro)', value: 'neutral-900' },
        { label: 'Sutil (zinc-50)', value: 'zinc-50' },
        { label: 'Card / Panel', value: 'panel' },
      ],
    },
    {
      name: 'paddingY',
      type: 'select',
      label: 'Padding vertical',
      defaultValue: 'py-8 md:py-12',
      options: [
        { label: 'Sin padding', value: '' },
        { label: 'Chico', value: 'py-6 md:py-8' },
        { label: 'Medio', value: 'py-8 md:py-12' },
        { label: 'Grande', value: 'py-12 md:py-16' },
        { label: 'XL', value: 'py-16 md:py-24' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'gap',
          type: 'select',
          label: 'Gap entre columnas',
          defaultValue: 'gap-6 md:gap-8',
          options: [
            { label: '0', value: 'gap-0' },
            { label: 'XS', value: 'gap-3 md:gap-4' },
            { label: 'SM', value: 'gap-4 md:gap-6' },
            { label: 'MD', value: 'gap-6 md:gap-8' },
            { label: 'LG', value: 'gap-8 md:gap-12' },
          ],
        },
        {
          name: 'alignY',
          type: 'select',
          label: 'Alineación vertical',
          defaultValue: 'items-start',
          options: [
            { label: 'Arriba', value: 'items-start' },
            { label: 'Centro', value: 'items-center' },
            { label: 'Abajo', value: 'items-end' },
            { label: 'Estirar', value: 'items-stretch' },
          ],
        },
        {
          name: 'alignX',
          type: 'select',
          label: 'Alineación horizontal (contenido)',
          defaultValue: 'justify-start',
          options: [
            { label: 'Inicio', value: 'justify-start' },
            { label: 'Centro', value: 'justify-center' },
            { label: 'Fin', value: 'justify-end' },
            { label: 'Entre', value: 'justify-between' },
          ],
        },
      ],
    },
    {
      name: 'cols',
      type: 'group',
      label: 'Columnas (dispositivos)',
      fields: [
        {
          name: 'base',
          type: 'number',
          label: 'Mobile (1–12)',
          defaultValue: 1,
          min: 1,
          max: 12,
        },
        {
          name: 'sm',
          type: 'number',
          label: 'Tablet (1–12)',
          min: 1,
          max: 12,
        },
        {
          name: 'md',
          type: 'number',
          label: 'Laptop (1–12)',
          min: 1,
          max: 12,
        },
        {
          name: 'lg',
          type: 'number',
          label: 'Pantalla Grande (1–12)',
          min: 1,
          max: 12,
        },
        {
          name: 'xl',
          type: 'number',
          label: 'Extra Grande (1–12)',
          min: 1,
          max: 12,
        },
      ],
      admin: {
        description: 'Define cuántas columnas tiene la grilla',
      },
    },
    {
      name: 'cells',
      type: 'array',
      label: 'Columnas (celdas)',
      labels: { singular: 'Columna', plural: 'Columnas' },
      minRows: 1,
      fields: [
        {
          name: 'blocks',
          type: 'blocks',
          required: true,
          label: 'Contenido de la columna',
          // agrega aquí los blocks que quieras permitir dentro de una columna
          blocks: [RichText, Archive, HeroGrid, CategoryMenu],
        },
        {
          name: 'vAlign',
          type: 'select',
          label: 'Alineación vertical (columna)',
          defaultValue: 'self-stretch',
          options: [
            { label: 'Auto/Stretch', value: 'self-stretch' },
            { label: 'Arriba', value: 'self-start' },
            { label: 'Centro', value: 'self-center' },
            { label: 'Abajo', value: 'self-end' },
          ],
        },
        {
          type: 'collapsible',
          label: 'Span por breakpoint',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'base',
              type: 'number',
              label: 'Base (1–12)',
              min: 1,
              max: 12,
              defaultValue: 1,
            },
            { name: 'sm', type: 'number', label: 'sm (1–12)', min: 1, max: 12, defaultValue: 1 },
            { name: 'md', type: 'number', label: 'md (1–12)', min: 1, max: 12, defaultValue: 1 },
            { name: 'lg', type: 'number', label: 'lg (1–12)', min: 1, max: 12, defaultValue: 1 },
            { name: 'xl', type: 'number', label: 'xl (1–12)', min: 1, max: 12, defaultValue: 1 },
          ],
        },
      ],
    },
  ],
}
