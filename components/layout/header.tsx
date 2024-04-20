import Filters from "../filters";
import Logo from "../logo";
import SearchBar from "../searchbar";

export default function Header({ className }: { className?: string }) {
  return (
    <header className={`bg-blue-200 screen flex justify-between ${className}`}>
      <Logo />
      <SearchBar />
      <Filters />
    </header>
  );
}
