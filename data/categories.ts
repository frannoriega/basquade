import client from "@/lib/prisma";

export const getCategories = async () => {
  try {
    return await client.category.findMany();
  } catch (error) {
    console.error(error);
  }
};
