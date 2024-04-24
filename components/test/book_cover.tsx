export default function BookPreview({ id }: { id: number; }) {
  const bookId = (id % 3) + 1;
  return (
    // TODO: Is it ok to "hardcode" height here?
    <img className="md:h-72 h-56 overflow-clip shadow-md shadow-black" src={`/images/cover-samples/b${bookId}.jpg`}></img>
  )
}
