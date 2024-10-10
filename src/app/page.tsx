import React, { cache } from "react";
import { getUsedShelves } from "@/lib/db/shelves";
import Link from "next/link";
import { Globe, Map } from "lucide-react";

export const dynamic = 'force-dynamic'

const guc = cache(getUsedShelves);

export default async function Home() {
  const shelves = await guc();
  return (
    <div className="w-full">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Bienvenido a la Biblioteca Basqüadé
              </h1>
              <p className="mx-auto max-w-prose text-muted-foreground md:text-xl">
                Explora nuestra extensiva colección de documentos digitales, a través de nuestras distintas estanterías virtuales.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Explora nuestras estanterías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shelves.map((c) => (
              <Link key={c.id} className="w-full flex flex-col items-center justify-self-center text-center p-4 border rounded-lg shadow-sm hover:border-green-300 dark:hover:border-green-800 hover:shadow" href={`/estanterias/${c.id}`}>
                <div className="mb-4 w-16 h-16 dark:fill-gray-100" dangerouslySetInnerHTML={{ __html: c.icon.toString() }}></div>
                <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-muted w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Explora nuestros mapas conceptuales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Link className="w-full flex flex-col items-center justify-self-center text-center p-4 border rounded-lg shadow-sm border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-800 hover:shadow" href={`/mapas`}>
              <Map className="mb-4 w-16 h-16"/>
              <h3 className="text-lg font-bold mb-2">Mapas conceptuales</h3>
              <p className="text-sm text-muted-foreground">Explora las distintas relaciones que existen entre nuestros documentos</p>
            </Link>
            <Link className="w-full flex flex-col items-center justify-self-center text-center p-4 border rounded-lg shadow-sm border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-800 hover:shadow" href={`/mapas`}>
              <Globe className="mb-4 w-16 h-16"/>
              <h3 className="text-lg font-bold mb-2">Altas conceptual</h3>
              <p className="text-sm text-muted-foreground">Explora las distintas relaciones que existen entre nuestros distintos mapas conceptuales</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );

}
