import Filters from "../filters";
import Logo from "../logo";
import SearchBar from "../searchbar";

export default function Header() {
  return (
    <header className="bg-blue-200 h-16 flex justify-between">
      <Logo />
      <SearchBar />
      <Filters />
    </header>
  );
}
