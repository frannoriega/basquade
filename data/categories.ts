import client from "@/lib/prisma";

export const getCategories = async () => {
  let categories;
  try {
    categories = await client.category.findMany();
  } catch (error) {
    console.error(error);
  }

  return categories;
};
