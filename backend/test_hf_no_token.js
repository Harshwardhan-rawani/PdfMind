const { HfInference } = require('@huggingface/inference');

async function test() {
  try {
    const hf = new HfInference();
    const response = await hf.textGeneration({
      model: 'google/flan-t5-large',
      inputs: `Answer the question based on the PDF content. PDF Content:\nhello\n\nQuestion: what?`,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.3,
      },
    });
    console.log(response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
test();
