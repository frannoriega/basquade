import Image from "next/image";

export default function BookPreview({ id }: { id: number }) {
  const bookId = (id % 3) + 1;

  return (
    // TODO: Is it ok to "hardcode" height here?
    <Image alt="libro" height={224} src={`/images/cover-samples/b${bookId}.jpg`} width={500} />
  );
}
