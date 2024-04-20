import DocumentPreview from "../document-preview";

export default function Aside() {
  //create an array from 1 to 10
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <aside className="py-2 bg-blue-300 space-x-2 overflow-scroll flex flex-row ">
      {numbers.map((number) => (
        <div key={number} className="shrink-0">
          <DocumentPreview number={number} />
        </div>
      ))}
    </aside>
  );
}
