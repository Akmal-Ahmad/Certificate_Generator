const express = require('express');
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { PDFDocument, rgb } = require('pdf-lib');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.post('/generate', async (req, res) => {
  try {
    const { name, course, date } = req.body;
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const pdfDoc = await PDFDocument.load(fs.readFileSync('template/certificate-template.pdf'));
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.getPages()[0];
    const width = page.getWidth();
    const nameFont = await pdfDoc.embedFont(fs.readFileSync('fonts/AlexBrush-Regular.ttf'));
    const courseFont = await pdfDoc.embedFont(fs.readFileSync('fonts/Ovo-Regular.ttf'));

    let nameSize = 78;
    while (nameFont.widthOfTextAtSize(name, nameSize) > width - 100 && nameSize > 30) {
      nameSize--;
    }
    let courseSize = 26;
    while (courseFont.widthOfTextAtSize(course, courseSize) > width - 100 && courseSize > 15) {
      courseSize--;
    }

    page.drawText(name, {
      x: (width - nameFont.widthOfTextAtSize(name, nameSize)) / 2,
      y: 372,
      size: nameSize,
      font: nameFont,
      color: rgb(0.19, 0.18, 0.18),
    });

    page.drawText(course, {
      x: (width - courseFont.widthOfTextAtSize(course, courseSize)) / 2,
      y: 243,
      size: courseSize,
      font: courseFont,
      color: rgb(0.38, 0.17, 0.52),
    });

    page.drawText(formattedDate, {
      x: 80,
      y: 83,
      size: 20,
      font: courseFont,
      color: rgb(0.19, 0.18, 0.18),
    });

    pdfDoc.setTitle(`${name} Certificate`);
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error("Error generating certificate:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/ping', (req, res) => {
    res.status(200).send('Server is active!');
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
