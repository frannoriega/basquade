
'use client'
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  OnConnect,
  BackgroundVariant
} from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { useCallback, useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';
import { updateAtlas } from '@/lib/db/atlas';
import BookMapNode from './bookmap-node';
import { searchBookMaps } from '@/lib/db/bookmaps';
import { BookMap } from '@prisma/client';
import BookMapEdge from './bookmap-edge';

type Atlas = {
  start: {
    id: number,
    name: string
  },
  end: {
    id: number,
    name: string
  },
  description?: string
}[]

type AtlasCanvasParams = {
  atlas: Atlas
}

function createNode(id: number, title: string) {
  return {
    id: id.toString(),
    type: "bookMapNode",
    position: {
      x: id * 50,
      y: id * 50
    },
    data: {
      id: id,
      title: title,
    }
  }
}

function getNodes(atlas: Atlas): Node<BookMapData>[] {
  return atlas.flatMap((c) => {
    return [
      createNode(c.start.id, c.start.name),
      createNode(c.end.id, c.end.name)
    ]
  })
}

function getEdges(atlas: Atlas): Edge<BookMapRelationData>[] {
  return atlas.map((c) => {
    return {
      id: `e${c.start.id}-${c.end.id}`,
      type: 'bookEdge',
      source: c.start.id.toString(),
      target: c.end.id.toString(),
      data: {
        description: c.description
      }
    }
  })
}

type BookMapData = {
  id: number,
  title: string
}

type BookMapRelationData = {
  description?: string
}

export default function AtlasCanvas({ atlas }: AtlasCanvasParams) {
  const initialNodes = getNodes(atlas)
  const initialEdges = getEdges(atlas)
  const [nodes, setNodes] = useState<Node<BookMapData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge<BookMapRelationData>[]>(initialEdges);

  const onNodesChange: OnNodesChange<Node<BookMapData>> = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges<Node<BookMapData>>(changes, nds))
    },
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange<Edge<BookMapRelationData>> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: 'bookMapEdge', data: { description: '' } }
      setEdges((eds) => addEdge<Edge<BookMapRelationData>>(edge, eds))
    },
    [setEdges],
  );

  async function save() {
    const newAtlas = edges.map((e) => {
      return {
        start: Number(e.source),
        end: Number(e.target),
        description: e.data?.description
      }
    })
    await updateAtlas(newAtlas)
  }

  const [bookMaps, setBookMaps] = useState<BookMap[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const firstRenderRef = useRef(true)
  React.useEffect(() => {
    if (firstRenderRef.current) {
      return () => { };
    } else {
      const getBookMaps = setTimeout(async () => {
        // Buscamos los libros
        const bookMaps = await searchBookMaps(searchTerm)
        setBookMaps(bookMaps)
      }, 3000)

      return () => clearTimeout(getBookMaps)
    }
  }, [searchTerm])

  async function changeSearchTerm(e: React.ChangeEvent<HTMLInputElement>) {
    firstRenderRef.current = false
    setSearchTerm(e.target.value)
  }

  function addNode(c: BookMap) {
    setNodes([
      ...nodes,
      {
        id: c.id.toString(),
        type: 'bookMapNode',
        position: {
          x: 50 * c.id,
          y: 50 * c.id
        },
        data: {
          id: c.id,
          title: c.name,
        }
      }
    ])
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-items-center'>
      <h1>Editando Atlas</h1>
      <div className='relative bg-gray-200 w-full h-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ bookMapNode: BookMapNode }}
          edgeTypes={{ bookMapEdge: BookMapEdge }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView>
          <Controls className='text-black' />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        <div className='absolute bottom-2 w-full grid grid-cols-4 items-center justify-items-center'>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-green-300 col-start-2 w-fit'>Agregar libro</Button>
            </DialogTrigger>
            <DialogContent>
              <input onChange={changeSearchTerm} />
              {bookMaps.map((b) => <DialogClose asChild><Button key={b.id} onClick={() => addNode(b)}>{b.name}</Button></DialogClose>)}
            </DialogContent>
          </Dialog>
          <Button className='bg-green-300 col-start-3 w-fit' onClick={save}>Guardar</Button>
        </div>
      </div>
    </div>
  )
}
