import BookCover from "./book_cover";
import BookTitle from "./book_title";

type BookProps = {
  name: string;
};

export default function BookItem({name}: BookProps) {
  return <li className="bg-green-300 flex flex-col gap-2"><BookCover/><BookTitle>{name}</BookTitle></li>
}
