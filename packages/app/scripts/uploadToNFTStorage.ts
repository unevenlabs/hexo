import { promises as fs } from "fs";
import { NFTStorage, File } from "nft.storage";

const main = async () => {
  const storage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });
  const cid = await storage.storeDirectory(
    await fs.readdir("./public/images/tokens").then(async (files) => {
      const filesToUpload = [];
      for (const file of files) {
        filesToUpload.push(
          new File([await fs.readFile(`./public/images/tokens/${file}`)], file)
        );
      }
      return filesToUpload;
    })
  );

  console.log(cid);

  const status = await storage.status(cid);
  console.log(status);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
