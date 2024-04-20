import DocumentPreview from "../document-preview";

export default function Aside() {
  //create an array from 1 to 10
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="overflow-auto">
    <div className="py-2 bg-blue-300 h-max overflow-auto flex md:flex-col gap-2">
      {numbers.map((number) => (
        <DocumentPreview key={number} number={number} />
      ))}
    </div>
    </div>
  );
}
