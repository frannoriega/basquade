import NextLogo from "@/assets/next.svg";
import React from "react";

// TODO: Obtener las categorias de forma dinamica
const categories = [

  {
    name: "Agroecología",
    icon: <NextLogo/>
  },
  {
    name: "Trabajos de investigación",
    icon: <NextLogo/>
  },
  {
    name: "Campamentos sanitarios",
    icon: <NextLogo/>
  },
  {
    name: "Leyes y reglamentaciones",
    icon: <NextLogo/>
  },
  {
    name: "Sentencias",
    icon: <NextLogo/>
  },
  {
    name: "Noticias y recursos",
    icon: <NextLogo/>
  },
  {
    name: "Plantas medicinales",
    icon: <NextLogo/>
  },
  {
    name: "Guía ante contacto con agrotóxicos",
    icon: <NextLogo/>
  },
  {
    name: "Informes",
    icon: <NextLogo/>
  },
  {
    name: "Cursos y manuales",
    icon: <NextLogo/>
  },
  {
    name: "Proyectos",
    icon: <NextLogo/>
  },
]

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <ol className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {
          categories.map((category, _) =>
            // TODO: Investigar cómo hacer para que el tamaño sea parejo sin definir altura fija
            // (h-?)
            <li className="bg-slate-50 grid grid-rows-2 justify-self-center w-52 h-48 items-center p-4 gap-4 border-2 border-slate-800 rounded-md hover:shadow-lg hover:border-green-600 hover:text-green-600 hover:fill-green-600" key={category.name}>
                {category.icon}
              <span className="text-center block align-middle">{category.name}</span>
            </li>)
        }
      </ol>
    </div>
  );

}
