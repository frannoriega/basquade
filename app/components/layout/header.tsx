import Filters from "../filters";
import Logo from "../logo";
import SearchBar from "../searchbar";

export default function Header() {
  return (
    <header>
      <Logo />
      <SearchBar />
      <Filters />
    </header>
  );
}
