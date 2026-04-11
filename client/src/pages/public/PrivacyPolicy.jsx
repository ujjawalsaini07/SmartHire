import { motion } from 'framer-motion';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="page-shell">
      <Navbar />
      <div className="container-custom max-w-4xl py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-hero mb-8">
            <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">Privacy Policy</h1>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Last updated: April 2026
            </p>
          </div>
          <div className="legal-panel space-y-6 text-light-text dark:text-dark-text">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                We collect information you provide when registering, applying for jobs, or posting
                vacancies. This includes your name, email, resume, and any profile information you
                choose to share.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                We use your information to operate the platform, match candidates with job
                opportunities, send relevant notifications, and improve our services. We do not sell
                your personal data to third parties.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                We implement industry-standard security measures including encryption in transit
                (HTTPS) and at rest to protect your personal information.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                We use cookies and similar tracking technologies to maintain your session and
                improve your experience. You may disable cookies in your browser settings, though
                this may affect platform functionality.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                You have the right to access, correct, or delete your personal data at any time.
                You can request this through your Account Settings or by contacting our support team.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                For privacy inquiries, contact us at{' '}
                <a href="mailto:privacy@smarthire.io" className="text-primary-600 dark:text-primary-400 hover:underline">
                  privacy@smarthire.io
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
