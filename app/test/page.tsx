import BookItem from "@/components/test/book_item";

export default function Test() {
  const books = Array.from({ length: 30 }, (_, i) => ({
    name: `Book ${i}: overflowing the text with lalalallalala`
  }));
  return (<ul className="flex flex-wrap content-evenly gap-4 p-2">
    {books.map(({ name }, _) => (<BookItem name={name} />))}
  </ul>);
}
