import React, { cache } from "react";
import { getUsedShelves } from "@/lib/db/shelves";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
                Descubre un mundo de conocimiento al alcance de tus dedos. Explora nuestra extensiva colección de documentos digitales, a través de nuestras distintas estanterías virtuales.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Más información</Button>
                </DialogTrigger>
                <DialogContent>
                  <h1 className="py-4 text-3xl font-bold text-center text-green-700 dark:text-green-200">Cómo utilizar la Biblioteca Basqüadé</h1>
                  <p className="max-w-prose text-justify">
                    A continuación presentamos los distintos conceptos utilizados, que
                    le ayudarán a explorar la biblioteca.
                  </p>
                  <h2 className="py-4 text-2xl font-bold text-green-700 dark:text-green-200">Estanterías</h2>
                  <p className="max-w-prose text-justify">
                    Los libros de la Biblioteca estan agrupados por estantería. Las estanterías representan
                    temáticas. Es decir, los libros pertenecientes a una estantería, tratan sobre la misma
                    temática.</p>
                  <h2 className="py-4 text-2xl font-bold text-green-700 dark:text-green-200">Mapas conceptuales</h2>
                  <p className="max-w-prose text-justify">
                    Los mapas conceptuales son herramientas que permiten visualizar relaciones entre libros, bajo un determinado contexto. Por ejemplo, los libros (documentos) pertenecientes a una causa judicial, pueden agruparse bajo un mapa conceptual que muestre la relación entre dichos documentos.
                  </p>
                  <h2 className="py-4 text-2xl font-bold text-green-700 dark:text-green-200">Atlas conceptual</h2>
                  <p className="max-w-prose text-justify">
                    El Atlas conceptual es una herramienta que permite visualizar las relaciones entre distintos mapas conceptuales.
                  </p>

                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Explora nuestras estanterías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shelves.map((c) => (
              <Link key={c.id} className="w-full flex flex-col items-center justify-self-center text-center p-4 border rounded-lg shadow-sm focus:border-green-300 dark:focus:border-green-800 focus:shadow" href={`/estanterias/${c.id}`}>
                <div className="mb-4 w-16 h-16 dark:fill-white" dangerouslySetInnerHTML={{ __html: c.icon.toString() }}></div>
                <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

}
