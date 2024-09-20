
// La vista previa de un libro.
// Contiene datos para identificar el libro y mostrar cierta información, pero no
// contiene el libro en sí.
class BookPreview {
  // El id del libro en la base de datos.
  readonly id: number;
  // La lista de autores del libro.
  readonly author: string[];
  // El título del libro.
  readonly title: string;
  // Una breve descripción del contenido del libro.
  readonly description: string;

  constructor(id: number, title: string, author: string[], description: string) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
  }
}

export { BookPreview }
