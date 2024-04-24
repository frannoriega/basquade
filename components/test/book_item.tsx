import BookCover from "./book_cover";
import BookTitle from "./book_title";

type BookProps = {
  id: number;
  name: string;
};

export default function BookItem({ id, name }: BookProps) {
  // Is it ok to "hardcode" width here?
  return <li className="md:w-48 w-36 flex flex-col gap-2">
    <BookCover id={id} />
    <BookTitle>{name}</BookTitle>
  </li>
}
