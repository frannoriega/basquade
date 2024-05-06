import Image from 'next/image'

export default function BookPreview({ id }: { id: number; }) {
  const bookId = (id % 3) + 1;
  return (
    // TODO: Is it ok to "hardcode" height here?
    <Image height={224} width={500} alt="libro" src={`/images/cover-samples/b${bookId}.jpg`}></Image>
  )
}
