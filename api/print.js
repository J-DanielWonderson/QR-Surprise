const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const imageRes = await fetch(process.env.IMAGE_URL);
    if (!imageRes.ok) throw new Error('Image download failed: ' + imageRes.status);
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"QR Printer" <${process.env.GMAIL_USER}>`,
      to: process.env.EPSON_EMAIL,
      subject: 'QR Print',
      text: 'Printing from QR code.',
      attachments: [{ filename: 'card1.jpg', content: imageBuffer, contentType: 'image/jpeg' }]
    });

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Print error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
