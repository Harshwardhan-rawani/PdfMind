const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const pdfParse = require('pdf-parse');

// Extract text from a public Cloudinary PDF URL
async function extractPdfText(pdfUrl) {
  try {
   
    
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
    });
  console.log(response.status)
    if (response.status !== 200) {
      console.error('PDF fetch error:', response.statusText);
      return `Failed to fetch PDF: ${response.statusText}`;
    }

    const contentType = response.headers['content-type'];
    if (!contentType.includes('application/pdf')) {
      console.error('Invalid content type:', contentType);
      return 'URL does not point to a valid PDF file.';
    }

    const data = await pdfParse(response.data);
    return data.text.slice(0, 8000) || 'No text extracted from PDF.';
  } catch (error) {
    console.error('Error reading PDF:', error.message);
    return 'Failed to extract text from the PDF.';
  }
}

exports.askChatbot = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { pdfId, question } = req.body;
    if (!pdfId || !question) {
      return res.status(400).json({ message: 'pdfId and question are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const pdf = user.pdfs.id(pdfId);
    if (!pdf) return res.status(404).json({ message: 'PDF not found' });

    const pdfUrl = pdf.url;
  

    const pdfText = await extractPdfText(pdfUrl);
    console.log('Extracted text preview:', pdfText.slice(0, 100));

    // Here, you can call OpenAI with the extracted `pdfText` and `question`
    // Example (if you uncomment OpenAI logic):
    /*
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an AI assistant helping users with questions about uploaded PDFs.' },
        { role: 'user', content: `PDF Content:\n${pdfText}\n\nQuestion: ${question}` },
      ],
      max_tokens: 512,
      temperature: 0.3,
    });

    const answer = completion.data.choices[0].message.content;
    return res.json({ answer });
    */

    res.json({ message: 'PDF text was extracted successfully.', preview: pdfText.slice(0, 300) });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Server error while processing chatbot request.' });
  }
};