import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "../app/api/uploadthing/core"; 

type UploadButtonType = ReturnType<typeof generateUploadButton<OurFileRouter>>;

export const UploadButton: UploadButtonType = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
