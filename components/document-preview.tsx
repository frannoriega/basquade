import { getDocument } from "@/data/documents";

interface Props {
  documentId: string;
}

export default async function DocumentPreview({ documentId }: Props) {
  const document = await getDocument(parseInt(documentId));

  if (!document) {
    return null;
  }

  return (
    <div className="size-32 bg-green-500">
      <div className="overflow-ellipsis">{document.title}</div>
    </div>
  );
}
