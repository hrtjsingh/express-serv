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

// Directory to save downloaded PDFs
const downloadsDir = path.join(__dirname, 'downloads');

// Create the downloads directory if it doesn't exist
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// Endpoint to download and save PDF
app.post('/download-pdf', async (req, res) => {
  const { pdfUrl } = req.body;

  try {
    // Fetch PDF file from the provided URL
    const response = await axios.get(pdfUrl, {
      responseType: 'stream'
    });

    // Generate a unique filename for the downloaded PDF
    const filename = `${uuidv4()}.pdf`;
    const filePath = path.join(downloadsDir, filename);

    // Create a writable stream to save the PDF file
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    // Return the URL of the saved PDF file
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
