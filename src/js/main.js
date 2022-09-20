import { icryptobookHelper } from "./icryptobook.helper";

(async () => {
  const res = await icryptobookHelper.getAllCryptoFastNews();
  console.log("data", res.data.data.getAllCryptoFastNews.data);
})();
