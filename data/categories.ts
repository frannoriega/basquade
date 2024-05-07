// import client from "@/lib/prisma";

export type Category = {
  // Name of the category
  name: string,
  // Path to the asset
  icon: string,
} 

const hardcodedCategories: Category[] = [
  {
    name: "Investigación",
    icon: "next.svg" 
  },
  {
    name: "Agroecología",
    icon: "next.svg" 
  },
  {
    name: "Campamentos sanitarios",
    icon: "next.svg" 
  },
  {
    name: "Leyes y reglamentaciones",
    icon: "next.svg" 
  },
  {
    name: "Sentencias",
    icon: "next.svg" 
  },
  {
    name: "Noticias",
    icon: "next.svg" 
  },
  {
    name: "Plantas medicinales",
    icon: "next.svg" 
  },
  {
    name: "Protocolos ante contacto con agrotoxicos",
    icon: "next.svg" 
  },
]

export const getCategories = async () => {
  return hardcodedCategories;
  // try {
  //   return await client.category.findMany();
  // } catch (error) {
  //   console.error(error);
  // }
};
