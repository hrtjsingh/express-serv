import express from 'express';
import { fileURLToPath } from 'url';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fetch from "node-fetch";
import cors from 'cors'

const app = express();
app.use(cors())

app.get("/get/mdisk", async (req, res) => {
  let url = ''
  if (req.query.type === "terabox") {
    url = "https://core.mdiskplay.com/box/terabox"
  } else if (req.query.type === "pdisk") {
    url = "https://mdiskplay.com/api/pdisk-info"
  } else {
    url = "https://mdiskplay.com/api/mdisk-info"
  }
  const rep = await fetch(`${url}/${req.query.id}`)
  res.json(await rep.json())
})
app.get("/", async (req, res) => {
  res.json("running")
})

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 4001;

const downloadsDir = path.join(__dirname, 'downloads');

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

app.post('/download-pdf', async (req, res) => {
  const { pdfUrl } = req.body;

  try {

    const pdf = await axios.get(pdfUrl);
    console.log(pdf.data.pdfUrl)
    const response = await axios.get(pdf.data?.pdfUrl, {
      responseType: 'stream'
    });

    const filename = `${uuidv4()}.pdf`;
    const filePath = path.join(downloadsDir, filename);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      const serverPdfUrl = `${req.protocol}://${req.get('host')}/downloads/${filename}`;
      res.json({ serverPdfUrl });
    });
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ error: 'Failed to download PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
