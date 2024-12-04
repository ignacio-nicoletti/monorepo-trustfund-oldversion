"use server";


import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function uploadFiles(formData: FormData) {
  const files = formData.getAll("files") as File[];
  if (files.length > 0) {
    const res = await utapi.uploadFiles(files);
    if (res) {
      return res[0]?.data?.url;
    }
  } else {
    throw Error("Error: No hay archivos");
  }
}
