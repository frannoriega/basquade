import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';
import { ChangeEvent } from 'react';

type BookEdgeParams = {
  id: string,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  data: {
    description: string
  }
}

export default function BookEdge({ id, sourceX, sourceY, targetX, targetY, data }: BookEdgeParams) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
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
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <input
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className='w-fit bg-inherit text-black'
          defaultValue={data.description}
          onChange={changeEdge}
        />
      </EdgeLabelRenderer>
    </>
  );
}
