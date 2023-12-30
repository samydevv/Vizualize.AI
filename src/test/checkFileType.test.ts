import supertest from "supertest";
import fs from "fs";
import createServer from "../util/createServer";

const app = createServer();

describe("Check image file type", () => {
  const png = `${__dirname}/testImages/test_png.png`;
  const pngData = fs.readFileSync(png);
  it("should test that  png is supported ", async () => {
    await supertest(app)
      .post("/upload")
      .attach("file", pngData, "test_png.png")
      .expect(200);
  });

  const gif = `${__dirname}/testImages/test_gif.gif`;
  const gifData = fs.readFileSync(gif);
  it("should test that  gif is not supported ", async () => {
    await supertest(app)
      .post("/upload")
      .attach("file", gifData, "test_gif.gif")
      .expect(415);
  });

});
