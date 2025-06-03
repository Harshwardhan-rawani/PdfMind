
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      features: [
        "5 PDF uploads",
        "Basic AI Q&A",
        "Standard processing speed",
        "Community support",
        "7-day data retention"
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: { monthly: 19, annual: 15 },
      features: [
        "50 PDF uploads",
        "Advanced AI Q&A",
        "Diagram recognition",
        "Priority processing",
        "Email support",
        "30-day data retention"
      ],
      cta: "Subscribe Now",
      popular: true,
    },
    {
      name: "Enterprise",
      price: { monthly: 49, annual: 39 },
      features: [
        "Unlimited PDF uploads",
        "Premium AI Q&A",
        "Advanced diagram analysis",
        "Fastest processing speed",
        "API access",
        "Dedicated support",
        "Unlimited data retention"
      ],
      cta: "Contact Sales",
      popular: false,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Choose the plan that's right for you and start getting more from your documents.
          </p>
          
          <div className="inline-flex items-center bg-gray-200 dark:bg-gray-800 rounded-full p-1 mb-8">
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                annual 
                  ? 'bg-white dark:bg-gray-700 shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Annual <span className="text-green-600 dark:text-green-400 ml-1">Save 20%</span>
            </button>
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !annual 
                  ? 'bg-white dark:bg-gray-700 shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Monthly
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-primary text-white py-2 px-4 text-center text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${annual ? plan.price.annual : plan.price.monthly}</span>
                  <span className="text-gray-600 dark:text-gray-300">/{annual ? 'month, billed annually' : 'month'}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
