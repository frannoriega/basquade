import { getDocuments } from "@/data/documents";
import DocumentPreview from "../document-preview";
import Link from "next/link";
type Props = {
  className?: string;
};

export default async function Aside({ className }: Props) {
  const documents = await getDocuments();

  if (!documents) {
    return null;
  }

  return (
    <div className="overflow-auto">
      <div className="flex h-max gap-2 overflow-auto bg-blue-300 py-2 md:flex-col">
        {documents.map(({ id, title }, number) => (
          <div className="flex-grow">
            <Link href={`/?documentId=${number}`} key={number}>
              <DocumentPreview key={number} documentId={id} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
