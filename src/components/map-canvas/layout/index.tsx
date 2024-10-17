'use client'
import Dagre from '@dagrejs/dagre';
import { Background, BackgroundVariant, Controls, Edge, Node, Panel, ReactFlow, useEdgesState, useNodesInitialized, useNodesState, useReactFlow } from "@xyflow/react";
import { MapEdgeData, MapNodeData } from "../types";
import { useCallback, useEffect, useRef, useState } from "react";
import { searchBooks } from '@/lib/db/books';
import { BookWithDisplayAuthor } from '@/types/books';
import { updateBookMap } from '@/lib/db/bookmaps';
import BookNode from '../book-node';
import BookEdge from '../book-edge';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type BookMap = {
  id: number,
  name: string,
  description: string,
  shelfId: number,
  books: {
    description: string | null,
    start: {
      id: number,
      title: string,
      description: string
    },
    end: {
      id: number,
      title: string,
      description: string
    } | null
  }[]
}

type LayoutFlowParams = {
  initialNodes: Node<MapNodeData>[],
  initialEdges: Edge<MapEdgeData>[],
  bookMap: BookMap
}

type Options = {
  direction: Direction
}

type Direction = 'LR' | 'TB'

function getLayoutedElements(nodes: Node<MapNodeData>[], edges: Edge<MapEdgeData>[], options: Options) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges
  };
};

export default function LayoutFlow({ initialNodes, initialEdges, bookMap }: LayoutFlowParams) {
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (nodesInitialized) {
      onLayout('TB')
    }
  }, [nodesInitialized]);

  const onLayout = useCallback(
    (direction: Direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges],
  );

  async function save() {
    const relations: { [key: string]: { target: number | null, description: string | null }[] } = {}
    for (const node of nodes) {
      relations[node.data.id.toString()] = []
    }
    for (const edge of edges) {
      relations[edge.source].push({
        target: Number(edge.target),
        description: edge.data?.description || ''
      })
    }
    const updatedBookMap = {
      id: bookMap.id,
      name: bookMap.name,
      description: bookMap.description,
      shelfId: bookMap.shelfId,
      books: Object.entries(relations).flatMap(([k, v]) => v.map(e => {
        return {
          description: e.description,
          start: Number(k),
          end: e.target
        }
      }))
    }
    await updateBookMap(updatedBookMap)
  }

  const [books, setBooks] = useState<BookWithDisplayAuthor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const firstRenderRef = useRef(true)
  useEffect(() => {
    if (firstRenderRef.current) {
      return () => { };
    } else {
      const getBooks = setTimeout(async () => {
        // Buscamos los libros
        const books = await searchBooks(searchTerm)
        setBooks(books)
      }, 3000)

      return () => clearTimeout(getBooks)
    }
  }, [searchTerm])

  async function changeSearchTerm(e: React.ChangeEvent<HTMLInputElement>) {
    firstRenderRef.current = false
    setSearchTerm(e.target.value)
  }

  function addNode(b: BookWithDisplayAuthor) {
    setNodes([
      ...nodes,
      {
        id: b.id.toString(),
        type: 'bookNode',
        position: {
          x: 50 * b.id,
          y: 50 * b.id
        },
        data: {
          id: b.id,
          title: b.title,
          description: b.description
        },
      }
    ])
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ bookNode: BookNode }}
      edgeTypes={{ bookEdge: BookEdge }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      className='rounded-md'
      fitView>
      <Controls className='text-black' />
      <Background className='dark:bg-gray-700' variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Panel position="top-right" className='flex flex-row gap-4'>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='w-fit'>Agregar libro</Button>
          </DialogTrigger>
          <DialogContent>
            <input onChange={changeSearchTerm} />
            {books.map((b) => <DialogClose asChild><Button key={b.id} onClick={() => addNode(b)}>{b.title}</Button></DialogClose>)}
          </DialogContent>
        </Dialog>
        <Button className='w-fit' onClick={save}>Guardar</Button>
      </Panel>
    </ReactFlow>
  );
};
