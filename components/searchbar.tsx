import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="flex w-6/12 items-center">
      <Input type="text" placeholder="Your books..." />
      <Button type="submit">Search</Button>
    </div>
  );
}
