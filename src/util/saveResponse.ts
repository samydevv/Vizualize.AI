//Third Party Modules
import sharp from "sharp";
import axios from "axios";
import path from "path";

//Custom Modules
import parseFileName from "./parseFileName.js";

export default async (url: string, filename: string): Promise<void> => {
  try {
    const { base, ext } = parseFileName(filename);
    const response = await axios.get(url, {
        responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "base64");
    const outPath = path.join('uploads', base, `modelResponse${ext}`);
    await sharp(buffer).toFile(outPath);
  } catch (error) {
    console.log(`Failed : ${error}`);
  }
};
