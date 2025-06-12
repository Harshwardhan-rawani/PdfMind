
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "DocuMind has completely transformed how our team works with technical documentation. The AI answers are incredibly accurate.",
    name: "Sarah Johnson",
    title: "CTO, TechSolutions Inc.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    quote: "The ability to instantly search through hundreds of pages of product manuals has saved our support team countless hours.",
    name: "Michael Chen",
    title: "Support Lead, Innovate Labs",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    quote: "As a researcher, I need to analyze complex papers quickly. This tool has become an essential part of my workflow.",
    name: "Dr. Emily Rodriguez",
    title: "Senior Researcher, BioScience",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    quote: "The diagram recognition feature is a game-changer for our engineering team. It helps us understand complex systems in seconds.",
    name: "Robert Park",
    title: "Engineering Manager, BuildCorp",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Don't just take our word for it - hear from some of our satisfied customers.
          </p>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                      <div className="mb-6 md:mb-0 md:mr-6">
                        <div className="relative">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg md:text-xl mb-4 italic">"{testimonial.quote}"</p>
                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  activeIndex === index ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
