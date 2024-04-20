import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="flex items-center flex-1">
      <Input type="text" placeholder="Your books..." />
      <Button type="submit">Search</Button>
    </div>
  );
}
