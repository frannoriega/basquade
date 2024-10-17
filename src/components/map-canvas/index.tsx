'use client'
import { Background, Controls, ReactFlow, useEdgesState, useNodesState, addEdge, Edge, Node, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, OnConnect, BackgroundVariant, ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { useCallback, useRef, useState } from 'react';
import BookNode from './book-node';
import { updateBookMap } from '@/lib/db/bookmaps';
import BookEdge from './book-edge';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';
import { searchBooks } from '@/lib/db/books';
import { BookWithDisplayAuthor } from '@/types/books';
import LayoutFlow from './layout';
import { MapEdgeData, MapNodeData } from './types';
import { Map } from "lucide-react";

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

type BookMapCanvasParams = {
  bookMap: BookMap
}

function createNode(id: number, title: string, description: string): Node<MapNodeData> {
  return {
    id: id.toString(),
    type: "bookNode",
    position: {
      x: 0,
      y: id * 50
    },
    data: {
      id: id,
      title: title,
      description: description
    },
  }
}

function getNodes(col: BookMap): Node<MapNodeData>[] {
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

function getEdges(col: BookMap): Edge<MapEdgeData>[] {
  return col.books.filter(c => c.end && c.end.id != c.start.id).map((c) => {
    return {
      id: `e${c.start.id}-${c.end ? c.end.id : c.start.id}`,
      type: 'bookEdge',
      source: c.start.id.toString(),
      target: c.end?.id.toString() ?? '',
      data: {
        description: c.description
      },
    }
  })
}

export default function BookMapCanvas({ bookMap }: BookMapCanvasParams) {
  const initialNodes = getNodes(bookMap)
  const initialEdges = getEdges(bookMap)

  return (
    <div className="p-4 flex flex-col gap-4 self-stretch grow">
      <div className="flex flex-row gap-4">
        <Map className="h-10 self-end" />
        <h1 className="text-3xl font-semibold">Editando mapa "{bookMap.name}"</h1>
      </div>
      <ReactFlowProvider>
        <LayoutFlow
          bookMap={bookMap}
          initialNodes={initialNodes}
          initialEdges={initialEdges} />
      </ReactFlowProvider>
    </div>
  )
}
