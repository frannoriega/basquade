import fs from "fs/promises";
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
