import { getCategories } from "@/data/categories";
type Props = {
  className?: string;
};

export default async function Aside({ className }: Props) {
  const categories = await getCategories();

  if (!categories) {
    return null;
  }
  let len = categories.length;

  return (
    <div className="overflow-auto">
      <div className="flex h-max gap-2 overflow-auto bg-blue-300 py-2 md:flex-col">
        {categories.concat(Array.from({ length: 30 }, (_, i) => (
          {
            id: len + i,
            name: `Dummy ${i}`,
            slug: i.toString(),
          }
        ))).map(({ id, name }, number) => (
          <div key={id} className="flex-grow">
            {/* <Link key={number} href={`/categories/${id}`} passHref> */}
            <span>{name}</span>
            {/* </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
}
