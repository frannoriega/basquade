import BookCover from "./book_cover";
import BookInfo from "./book_info";

type BookProps = {
  id: number;
  title: string;
  author: string;
};

export default function BookItem({ id, title, author }: BookProps) {
  // Is it ok to "hardcode" width here?
  return (
    <li className="flex w-36 flex-col gap-2 md:w-48">
      <BookCover id={id} />
      <BookInfo author={author} title={title} />
    </li>
  );
}
