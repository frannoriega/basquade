import React, { cache } from "react";
import { getUsedCategories } from "@/lib/db/categories";

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
            <a href={`/categorias/${category.id}`} key={category.id}>
              <li className="bg-slate-50 dark:bg-slate-700 grid grid-rows-2 justify-self-center w-52 h-48 items-center p-4 gap-4 border-2 border-slate-800 dark:border-slate-50 rounded-md hover:shadow-lg hover:dark:shadow-green-600 hover:border-green-600 hover:dark:border-green-600 hover:text-green-600 hover:fill-green-600" key={category.id}>

                <div className="fill-black dark:fill-slate-50" dangerouslySetInnerHTML={{ __html: category.icon.toString() }} />
                <span className="text-center block align-middle">{category.name}</span>
              </li>
            </a>
          )
        }
      </ol>
    </div>
  );

}
