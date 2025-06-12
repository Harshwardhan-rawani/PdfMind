import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }
    },
  };

  return (
    <section id="hero" className="pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              <span>Transform Your PDFs With </span>
              <span className="gradient-text">AI Intelligence</span>
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-xl"
              variants={itemVariants}
            >
              Upload your documents and get instant answers, diagram recognition, 
              and smart search capabilities powered by advanced AI.
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row items-center gap-4" variants={itemVariants}>
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white">
                  Try For Free
                </Button>
              </Link>
              <a href="#features" className="text-primary font-medium mt-4 sm:mt-0">
                Learn more →
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="rounded-2xl shadow-2xl bg-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-50"></div>
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/af40f275-5095-4703-a3eb-d442de0301ae.png" 
                alt="AI Document Analysis" 
                className="relative rounded-2xl h-[500px] w-[700px] shadow-lg transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
