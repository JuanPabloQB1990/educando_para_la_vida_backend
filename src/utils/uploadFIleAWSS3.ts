import { Upload } from "@aws-sdk/lib-storage";
import path from "path";
import { s3 } from "../config/awsS3";

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export async function uploadFileToS3(file: any, folder = "matriculas") {
  if (!file) return null;

  const extension = path.extname(file.originalname);

  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}${extension}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  await upload.done();

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}