'use client'
import { Background, Controls, ReactFlow, useEdgesState, useNodesState, addEdge, Edge, Node, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, OnConnect } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { Button } from '../ui/button';
import { useCallback, useRef, useState } from 'react';
import BookNode from './book-node';
import { updateCase } from '@/lib/db/cases';
import BookEdge from './book-edge';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import React from 'react';
import { searchBooks } from '@/lib/db/books';
import { BookWithDisplayAuthor } from '@/types/books';
import { title } from 'process';

type Collection = {
  id: number,
  name: string,
  description: string,
  categoryId: number,
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

type CaseCanvasParams = {
  collection: Collection
}

function createNode(id: number, title: string, description: string) {
  return {
    id: id.toString(),
    type: "bookNode",
    position: {
      x: id * 50,
      y: id * 50
    },
    data: {
      id: id,
      title: title,
      description: description
    }
  }
}

function getNodes(col: Collection): Node[] {
  return col.books.flatMap((c) => {
    const nodes = [createNode(c.start.id, c.start.title, c.start.description)]
    if (!c.end) {
      return nodes
    } else {
      return [...nodes,
      createNode(c.end.id, c.end.title, c.end.description)
      ]
    }
  })
}

function getEdges(col: Collection): Edge[] {
  return col.books.map((c) => {
    return {
      id: `e${c.start.id}-${c.end ? c.end.id : c.start.id}`,
      type: 'bookEdge',
      source: c.start.id.toString(),
      target: c.end ? c.end.id.toString() : c.start.id.toString(),
      data: {
        description: c.description
      }
    }
  })
}

export default function CaseCanvas({ collection }: CaseCanvasParams) {
  const initialNodes = getNodes(collection)
  const initialEdges = getEdges(collection)
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds)) },
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => {
      const edge = {...connection, type: 'bookEdge', data: { description: ''}}
      setEdges((eds) => addEdge(edge, eds)) },
    [setEdges],
  );

  async function save() {
    const relations: { [key: string]: number | null } = {}
    for (const node of nodes) {
      relations[node.data.id.toString()] = {
        target: null,
        description: null
      }
    }
    for (const edge of edges) {
      relations[edge.source] = {
        target: Number(edge.target),
        description: edge.data.description
      }
    }
    const updatedCase = {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      categoryId: collection.categoryId,
      books: Object.entries(relations).map(([k, v]) => {
        return {
          description: v.description,
          start: Number(k),
          end: v.target
        }
      })
    }
    await updateCase(updatedCase)
  }

  const [books, setBooks] = useState<BookWithDisplayAuthor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const firstRenderRef = useRef(true)
  React.useEffect(() => {
    if (firstRenderRef.current) {
      return () => {};
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
        }
      }
    ])
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-items-center'>
      <h1>Editando caso {collection.name}</h1>
      <div className='relative bg-slate-200 w-full h-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ bookNode: BookNode}}
          edgeTypes={{ bookEdge: BookEdge}}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView>
          <Controls className='text-black' />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        <div className='absolute bottom-2 w-full grid grid-cols-4 items-center justify-items-center'>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-green-300 col-start-2 w-fit'>Agregar libro</Button>
            </DialogTrigger>
            <DialogContent>
              <input onChange={changeSearchTerm} />
              {books.map((b) => <Button key={b.id} onClick={() => addNode(b)}>{b.title}</Button>)}
            </DialogContent>
          </Dialog>
          <Button className='bg-green-300 col-start-3 w-fit' onClick={save}>Guardar</Button>
        </div>
      </div>
    </div>
  )
}
