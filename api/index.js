import express from 'express'
const app = express();
import fetch from "node-fetch";
import cors from 'cors'
app.use(cors())
app.get("/get/mdisk", async (req, res) => {
  const rep = await fetch(`https://mdiskplay.com/api/mdisk-info/${req.query.id}`)
  res.json(await rep.json())
})
app.get("/", async (req, res) => {
  res.json("running")
})
app.listen(4001, () => {
  console.log("listing")
})