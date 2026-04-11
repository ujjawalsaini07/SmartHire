import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    // Simulated submit — wire to a real contact API when available
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you shortly.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'support@smarthire.io' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+1 (555) 000-0000' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Office', value: '123 Tech Street, San Francisco, CA 94105' },
  ];

  return (
    <div className="page-shell">
      <Navbar />
      {/* Header */}
      <section className="py-16">
        <div className="container-custom text-center">
          <div className="page-hero">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-light-text dark:text-dark-text mb-4"
          >
            Contact <span className="gradient-text">Us</span>
          </motion.h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-xl mx-auto">
            Have a question, feedback, or need support? We're here to help.
          </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Get in Touch</h2>
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-start space-x-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-light-border bg-primary-50 text-primary-600 dark:border-dark-border dark:bg-primary-900/20">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                    {info.label}
                  </p>
                  <p className="text-light-text dark:text-dark-text font-medium">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="card lg:col-span-2 p-8">
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message here..."
                  className="input resize-none"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting} className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
