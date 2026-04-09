import { motion } from 'framer-motion';
import { Users, Target, Award, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="w-6 h-6 text-primary-600" />,
      title: 'Our Mission',
      description:
        'To connect talented professionals with the right opportunities and help companies find the best candidates — efficiently and transparently.',
    },
    {
      icon: <Users className="w-6 h-6 text-primary-600" />,
      title: 'For Everyone',
      description:
        'Whether you are a fresh graduate, an experienced professional, or a growing company, SmartHire is built to serve you.',
    },
    {
      icon: <Award className="w-6 h-6 text-primary-600" />,
      title: 'Quality First',
      description:
        'We verify recruiters and curate listings so job seekers see only legitimate, high-quality opportunities.',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-primary-600" />,
      title: 'Smart Matching',
      description:
        'Our intelligent matching surfaces the most relevant candidates and jobs, saving time for both parties.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-light-text dark:text-dark-text mb-6"
          >
            About <span className="gradient-text">SmartHire</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto mb-8"
          >
            SmartHire is a modern job portal that brings together job seekers
            and verified recruiters on a single, easy-to-use platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
            <Button variant="outline" onClick={() => navigate('/register')}>
              Join Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="container-custom py-20">
        <h2 className="text-3xl font-bold text-center text-light-text dark:text-dark-text mb-12">
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-dark-bg-secondary rounded-xl p-8 border border-light-border dark:border-dark-border shadow-sm"
            >
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4">
                {val.icon}
              </div>
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                {val.title}
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                {val.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 dark:bg-primary-800 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-primary-100 mb-8 max-w-md mx-auto">
          Join thousands of professionals and companies already using SmartHire.
        </p>
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-primary-600"
          onClick={() => navigate('/register')}
        >
          Create your free account
        </Button>
      </section>
    </div>
  );
};

export default About;
