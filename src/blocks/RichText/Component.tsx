import { RichTextBlockT } from '@/payload-types'

export function RichTextBlock({ content, html }: RichTextBlockT) {
  // Si ya tienes HTML renderizado en el backend, úsalo:
  if (html) {
    return (
      <section
        className="prose prose-neutral dark:prose-invert max-w-none mb-8"
        aria-label="Contenido"
      >
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    )
  }
  // Si necesitas serializar el richText del editor, hazlo aquí.
  return (
    <section
      className="prose prose-neutral dark:prose-invert max-w-none mb-8"
      aria-label="Contenido"
    >
      {/* TODO: Serializar content → HTML */}
    </section>
  )
}
