import BookCover from "./book_cover";
import BookInfo from "./book_info";

type BookProps = {
  id: number;
  title: string;
  author: string;
};

export default function BookItem({ id, title, author }: BookProps) {
  // Is it ok to "hardcode" width here?
  return <li className="md:w-48 w-36 flex flex-col gap-2">
    <BookCover id={id} />
    <BookInfo title={title} author={author}/>
  </li>
}
