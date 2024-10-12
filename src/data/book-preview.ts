
// La vista previa de un libro.
// Contiene datos para identificar el libro y mostrar cierta información, pero no
// contiene el libro en sí.
type BookPreview = {
  id: number,
  title: string,
  description: string
  authors: string[],
}

export type { BookPreview }
