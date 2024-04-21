import DocumentPreview from "@/components/document-preview";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto mt-10 h-[2000px] w-[600px] border-4 border-dotted border-red-800 bg-white">
      <DocumentPreview documentId={params.id} />;
    </div>
  );
}
