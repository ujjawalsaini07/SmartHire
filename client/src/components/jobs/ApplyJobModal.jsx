import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@components/common/Button';
import { jobSeekerApi } from '@api/jobSeekerApi';
import useAuthStore from '@store/authStore';
import toast from 'react-hot-toast';

const ApplyJobModal = ({ job, onClose }) => {
  const { addAppliedJob } = useAuthStore();
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formattedAnswers = Object.entries(answers).map(([question, answer]) => ({
        question, answer
      }));

      await jobSeekerApi.applyToJob({
        jobId: job._id,
        coverLetter: coverLetter,
        screeningAnswers: formattedAnswers
      });
      
      addAppliedJob(job._id);
      setIsSuccess(true);
      toast.success('Application submitted successfully!');
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-dark-border">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Apply for Job</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {job.title} at {job.companyId?.companyName || job.company}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You have successfully applied for {job.title}. The recruiter will review your profile.
              </p>
            </div>
          ) : (
            /* Body */
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={5}
                    placeholder="Why are you a good fit for this role?"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Your profile and default resume will be attached automatically.
                  </p>
                </div>
                
                {/* Screening Questions */}
                {job.screeningQuestions && job.screeningQuestions.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Questions from exactly the Employer
                    </h3>
                    {job.screeningQuestions.map((sq, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {sq.question} 
                          {sq.isRequired ? (
                            <span className="text-red-500 ml-1" title="Required">* (Required)</span>
                          ) : (
                            <span className="text-gray-400 ml-1 font-normal">(Optional)</span>
                          )}
                        </label>
                        <textarea
                          required={sq.isRequired === true}
                          value={answers[sq.question] || ''}
                          onChange={(e) => setAnswers(prev => ({...prev, [sq.question]: e.target.value}))}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                          rows={2}
                          placeholder="Your answer..."
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplyJobModal;
