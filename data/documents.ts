import client from "@/lib/prisma";

export const getDocuments = async () => {
  let documents;
  try {
    documents = await client.document.findMany();
  } catch (error) {
    console.error(error);
  }

  return documents;
};

export const getDocument = async (id: number) => {
  let document;
  try {
    document = await client.document.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
  }

  return document;
};
