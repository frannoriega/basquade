import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="flex flex-1 items-center">
      <Input placeholder="Your books..." type="text" />
      <Button type="submit">Search</Button>
    </div>
  );
}
