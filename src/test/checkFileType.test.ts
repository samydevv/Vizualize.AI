import supertest from "supertest";
import fs from "fs";
import createServer from "../util/createServer";

const app = createServer();

describe("Check image file type", () => {
  const filePath = `${__dirname}/testImages/test.png`;
  const data = fs.readFileSync(filePath);
  it("should test that  png is supported ", async () => {
    await supertest(app)
      .post("/upload")
      .attach("file", data, "test.png")
      .expect(200);
  });
});
