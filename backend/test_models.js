require('dotenv').config();
const { InferenceClient } = require("@huggingface/inference");

async function test() {
  const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
  
  try {
    const response = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: 'user', content: `Here is a long text: ${'A'.repeat(8000)}\n\nWhat is the first letter of this text?` }
      ],
      max_tokens: 50,
    });
    console.log(`SUCCESS: ${response.choices[0].message.content}`);
  } catch (err) {
    console.log(`FAIL: ${err.message}`);
  }
}
test();
