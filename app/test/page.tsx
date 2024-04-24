import BookItem from "@/components/test/book_item";

export default function Test() {
  const books = Array.from({ length: 30 }, (_, i) => ({
    title: `Book ${i}: overflowing the text with lalalallalala`,
    author: `Author ${i}`
  }));
  return (<ul className="flex flex-wrap content-evenly gap-4 p-4">
    {books.map(({ title, author }, i) => (<BookItem key={title} id={i} title={title} author={author} />))}
  </ul>);
}
