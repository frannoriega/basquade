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
    <div className="container">
      <ol className="grid grid-cols-5 gap-8 pt-24">
        {
          categories.map((category, _) =>
            <li className="grid grid-rows-2 items-center p-4 gap-4 border-2 border-slate-800 rounded-md hover:shadow-lg hover:border-green-600 hover:text-green-600" key={category.name}>
                {category.icon}
              <span className="text-center block align-middle">{category.name}</span>
            </li>)
        }
      </ol>
    </div>
  );

}
