
export default function Page({ params }: { params: { id: string } }) {
  return <span>Categoría: {params.id}</span>
}
