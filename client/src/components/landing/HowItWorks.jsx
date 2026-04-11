import { motion } from 'framer-motion';
import { UserPlus, Search, Send, Briefcase } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up and build your professional profile in minutes."
    },
    {
      icon: Search,
      title: "Search Jobs",
      description: "Filter through thousands of jobs to find your perfect match."
    },
    {
      icon: Send,
      title: "Apply",
      description: "Submit applications with a single click and track their status."
    },
    {
      icon: Briefcase,
      title: "Get Hired",
      description: "Schedule interviews and accept offers from top companies."
    }
  ];

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
            How It Works
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Your journey to a new career in four simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-1/2 top-[2.5rem] z-0 hidden h-0.5 w-[85%] -translate-x-1/2 bg-gradient-to-r from-primary-200 via-success-300 to-accent-200 dark:from-primary-800 dark:via-success-800 dark:to-accent-700 lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary-100 bg-white shadow-soft dark:border-primary-800/40 dark:bg-dark-bg-secondary">
                      <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="absolute right-1/2 top-0 -mr-10 -mt-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary-500 to-accent-600 text-sm font-bold text-white dark:border-dark-bg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary px-4">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
