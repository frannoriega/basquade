import { Input } from '@/components/ui/input';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import { useState } from 'react';

type BookEdgeParams = {
  id: string,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  data: {
    description: string
  },
}

export default function BookEdge({ id, sourceX, sourceY, targetX, targetY, data }: BookEdgeParams) {
  const [width, setWidth] = useState(data.description.length + 8)
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  function changeEdge(event: React.ChangeEvent<HTMLInputElement>) {
    setEdges((es) => es.map((e) => {
      if (e.id != id) {
        return e
      } else {
        const res = {
          ...e,
          data: {
            description: event.target.value
          },
        }
        return res
      }
    }))
    setWidth(event.target.value.length + 8)
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <Input
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            width: `${width}ch`,
            pointerEvents: 'all',
          }}
          className='border-0 focus:bg-gray-200 dark:focus:bg-gray-700 text-center bg-inherit h-2 rounded-md text-[8px]'
          defaultValue={data.description}
          onChange={changeEdge}
        />
      </EdgeLabelRenderer>
    </>
  );
}
