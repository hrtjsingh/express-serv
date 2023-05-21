import express from 'express'
const app = express();
import fetch from "node-fetch";
import cors from 'cors'
app.use(cors())
app.get("/get/mdisk", async (req, res) => {
  let url = ''
  if (req.query.type === "terabox") {
    url = "https://core.mdiskplay.com/box/terabox"
  }else if(req.query.type === "pdisk"){
    url = "https://mdiskplay.com/api/pdisk-info"
  }else{
    url = "https://mdiskplay.com/api/mdisk-info"
  }
  const rep = await fetch(`${url}/${req.query.id}`)
  res.json(await rep.json())
})
app.get("/", async (req, res) => {
  res.json("running")
})
app.listen(4001, () => {
  console.log("listing")
})
