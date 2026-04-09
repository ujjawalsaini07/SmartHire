import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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

  const screeningQuestions = job.screeningQuestions || [];
  const hasScreeningQuestions = screeningQuestions.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for required screening questions
    for (const sq of screeningQuestions) {
      if (sq.isRequired && (!answers[sq.question] || !answers[sq.question].trim())) {
        toast.error(`Please answer the required question: "${sq.question}"`);
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Build screening answers array — include all answered questions
      const formattedAnswers = screeningQuestions
        .map(sq => ({
          question: sq.question,
          answer: answers[sq.question] || ''
        }))
        .filter(a => a.answer.trim()); // Only send questions that were answered

      await jobSeekerApi.applyToJob({
        jobId: job._id,
        coverLetter: coverLetter,
        screeningAnswers: formattedAnswers
      });
      
      addAppliedJob(job._id);
      setIsSuccess(true);
      toast.success('Application submitted successfully!');
      
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
            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">

                {/* Screening Questions — shown first */}
                {hasScreeningQuestions && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Screening Questions from the Recruiter
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                      Questions marked <span className="text-red-500 font-semibold">*</span> are mandatory. Optional questions can be left blank.
                    </p>
                    {screeningQuestions.map((sq, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-100 dark:border-dark-border">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <span className="flex items-start gap-1">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="flex-1">
                              {sq.question}
                              {sq.isRequired ? (
                                <span className="text-red-500 ml-1 font-semibold" title="Required">* (Required)</span>
                              ) : (
                                <span className="text-gray-400 ml-1 font-normal text-xs">(Optional)</span>
                              )}
                            </span>
                          </span>
                        </label>
                        <textarea
                          value={answers[sq.question] || ''}
                          onChange={(e) => setAnswers(prev => ({...prev, [sq.question]: e.target.value}))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                          rows={2}
                          placeholder={sq.isRequired ? "Your answer is required..." : "Your answer (optional)..."}
                          required={sq.isRequired}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Divider if there are screening questions */}
                {hasScreeningQuestions && (
                  <div className="border-t border-gray-100 dark:border-dark-border" />
                )}

                {/* Cover Letter — at the bottom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={4}
                    placeholder="Why are you a good fit for this role?"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Your profile and default resume will be attached automatically.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-3">
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
