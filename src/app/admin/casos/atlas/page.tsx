import AtlasCanvas from "@/components/atlas-canvas";
import { getAtlas } from "@/lib/db/atlas";

export default async function AtlasPage() {
  const atlas = await getAtlas()
  const processedAtlas = atlas.map((a) => {
    return {
      start: a.start,
      end: a.end,
      description: a.description || undefined
    }
  })
  return (
      <AtlasCanvas atlas={processedAtlas}/>
  )
}
