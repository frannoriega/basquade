import DocumentPreview from "../document-preview";

type Props = {
  className?: string;
};

export default function Aside({ className }: Props) {
  //create an array from 1 to 10
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="overflow-auto">
      <div className="flex h-max gap-2 overflow-auto bg-blue-300 py-2 md:flex-col">
        {numbers.map((number) => (
          <div className="flex-grow">
            <DocumentPreview key={number} number={number} />
          </div>
        ))}
      </div>
    </div>
  );
}
