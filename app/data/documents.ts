import fs from "fs/promises";

export const getDocuments = async () => {
  // reads the folder public/pdfs an returns a list of the filesnames
  const files = await fs.readdir("public/pdfs");
  return files;
};
