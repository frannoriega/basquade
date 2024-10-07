import React, { cache } from "react";
import { getUsedCategories } from "@/lib/db/categories";
import Link from "next/link";

export const dynamic = 'force-dynamic'

const guc = cache(getUsedCategories);

export default async function Home() {
  const categories = await guc();
  return (
    <div className="pt-24 self-start flex items-center justify-center">
      <ol className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {
          categories.map((category, _) =>
            // TODO: Investigar cómo hacer para que el tamaño sea parejo sin definir altura fija
            // (h-?)
            <Link href={`/categorias/${category.id}`} key={category.id}>
              <li className="bg-gray-50 dark:bg-gray-700 grid grid-rows-2 justify-self-center w-52 h-48 items-center p-4 gap-4 border-2 border-transparent rounded-md hover:shadow-lg hover:border-green-600 hover:dark:border-green-600 hover:text-green-600 hover:fill-green-600" key={category.id}>

                <div className="fill-gray-950 dark:fill-gray-50" dangerouslySetInnerHTML={{ __html: category.icon.toString() }} />
                <span className="text-center block align-middle">{category.name}</span>
              </li>
            </Link>
          )
        }
      </ol>
    </div>
  );

}
