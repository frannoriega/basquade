import Filters from "../filters";
import Logo from "../logo";
import SearchBar from "../searchbar";

export default function Header() {
  return (
    <header className="bg-blue-200 w-full flex justify-between h-14">
      <Logo />
      <SearchBar />
      <Filters />
    </header>
  );
}
