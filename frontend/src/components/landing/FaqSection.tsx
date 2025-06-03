
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How does the PDF AI question and answering work?",
    answer: "Our system uses advanced natural language processing to understand the content of your PDFs. When you ask a question, the AI searches through the document to find the most relevant information and generates a concise, accurate answer based on the document content."
  },
  {
    question: "Can I upload multiple PDFs at once?",
    answer: "Yes, you can upload multiple PDFs at once. The system will process them individually and you can choose which document to query at any time. Pro and Enterprise plans allow for batch processing of multiple documents."
  },
  {
    question: "What types of diagrams can the system recognize?",
    answer: "Our diagram recognition technology can identify and analyze various types of diagrams, including flowcharts, organizational charts, technical diagrams, process flows, UML diagrams, and many more. The AI can also extract data from charts and graphs."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. All uploads are encrypted both in transit and at rest. We use enterprise-grade security measures to protect your documents, and we never share your data with third parties. You can delete your documents at any time."
  },
  {
    question: "What file sizes are supported?",
    answer: "The Free plan supports PDFs up to 10MB, the Pro plan supports up to 50MB, and the Enterprise plan supports up to 100MB per file. If you have larger files, please contact our sales team for custom solutions."
  },
  {
    question: "Can I try the service before purchasing?",
    answer: "Absolutely! Our Free plan allows you to experience the core features without any cost. You can upgrade to a paid plan at any time to access more features and higher usage limits."
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our service.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className={`w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex justify-between items-center ${
                  activeIndex === index ? 'rounded-b-none' : ''
                }`}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-b-lg shadow-sm px-4 overflow-hidden"
                  >
                    <div className="py-4 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
