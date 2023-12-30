import supertest from "supertest";
import fs from "fs";
import createServer from "../util/createServer";

const app = createServer();

describe("Check integration with replicate", () => {
  const png = `${__dirname}/testImages/test_png.png`;
  const pngData = fs.readFileSync(png);
  it("should test that replicate model return response successfully", async () => {
    const {body, statusCode} = await supertest(app)
      .post("/upload")
      .attach("file", pngData, "test_png.png")
      .query({ model: 1 })
      .timeout(2000000)
      .expect(200);
  });
});
