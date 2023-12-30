import sharp from "sharp";
import { MediaType } from "../types/MediaType.js";

export default async (
  inputPath: string,
  outPath: string,
  quality: number,
  mediaType: MediaType
): Promise<string> => {
  try {
    let instance = sharp(inputPath);
    switch (mediaType) {
        case ".png":
            instance = instance.png({ quality });
            break;
        case ".jpg":
        case ".jpeg":
            instance = instance.jpeg({ quality });
            break;
        case ".webp":
            instance = instance.webp({ quality });
            break;
        default:
            throw new Error("Invalid media type");
        }

    await instance.resize(200, 200).toFile(outPath);
    console.log("Image compressed successfully");
    return Promise.resolve("success");
  } catch (error) {
    console.error(`Failed to compress image: ${error}`);
    return Promise.reject("failed");
  }
};
