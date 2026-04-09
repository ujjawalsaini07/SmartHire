import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="container-custom max-w-4xl py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">Terms of Service</h1>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8">
            Last updated: April 2026
          </p>
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl border border-light-border dark:border-dark-border p-8 space-y-6 text-light-text dark:text-dark-text">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                By accessing or using SmartHire, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the platform.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use of the Platform</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                SmartHire is provided for lawful job searching and recruitment purposes only. You may
                not use the platform to post fraudulent jobs, spam candidates, or engage in any
                discriminatory hiring practices.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials.
                You agree to immediately notify us of any unauthorized use of your account.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                All content on SmartHire, including logos, text, and design, is the property of
                SmartHire and may not be reproduced without permission.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                SmartHire is not liable for any damages arising from your use of the platform,
                including indirect, incidental, special, or consequential damages.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Changes to Terms</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use after changes
                constitutes acceptance of the new terms.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                For questions about these terms, contact us at{' '}
                <a href="mailto:legal@smarthire.io" className="text-primary-600 dark:text-primary-400 hover:underline">
                  legal@smarthire.io
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
