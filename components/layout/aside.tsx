import DocumentPreview from "../document-preview";

export default function Aside() {
  //create an array from 1 to 10
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <aside className="py-2 bg-blue-300">
      <div className="flex md:flex-col gap-2">
        {numbers.map((number) => (
          <div key={number}>
            <DocumentPreview number={number} />
          </div>
        ))}
      </div>
    </aside>
  );
}
