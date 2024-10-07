
import { Handle, Position } from "@xyflow/react"

type CaseNodeData = {
  data: {
    id: number,
    title: string,
    description: string
  }
}

export default function CaseNode({ data }: CaseNodeData) {
  return (
    <div className="bg-white p-2 rounded-md dark:text-black">
      <Handle type="target" position={Position.Top}/>
      <div className="flex flex-col justify-items-center items-center">
        <h1>{data.title}</h1>
      </div>
      <Handle type="source" position={Position.Bottom}/>
    </div>
  )
}
