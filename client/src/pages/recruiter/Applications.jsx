import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, XCircle, Search, Mail, ExternalLink, Filter, Trash2, Star, Calendar } from 'lucide-react';
import { recruiterApi } from '@api/recruiterApi';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';

import Modal from '@components/common/Modal';

const Applications = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);

  // Status Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, appId: null, status: null });
  const [interviewModal, setInterviewModal] = useState({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' });

  // Input states internally bound per mapping loop dynamically but notes need a unified tracking mechanism or direct uncontrolled refs.
  const [localNotes, setLocalNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchApplications(selectedJob);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await recruiterApi.getMyJobs({ limit: 50 });
      const jobList = res.data || res.jobs || [];
      setJobs(jobList);
      if (jobList.length > 0) {
        setSelectedJob(jobList[0]._id);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      setLoadingApps(true);
      const res = await recruiterApi.getApplicationsForJob(jobId);
      setApplications(res.data || res.applications || []);
      // Reset filters when switching jobs
      setSearchQuery('');
      setStatusFilter('');
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoadingApps(false);
    }
  };

  const requestStatusChange = (applicationId, newStatus) => {
    if (newStatus === 'accepted' || newStatus === 'rejected') {
      setConfirmModal({ isOpen: true, appId: applicationId, status: newStatus });
    } else {
      executeStatusChange(applicationId, newStatus);
    }
  };

  const executeStatusChange = async (applicationId, newStatus) => {
    try {
      await recruiterApi.updateApplicationStatus(applicationId, { status: newStatus });
      toast.success(`Candidate marked as ${newStatus}`);
      setConfirmModal({ isOpen: false, appId: null, status: null });
      fetchApplications(selectedJob);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await recruiterApi.deleteApplication(applicationId);
      toast.success('Application removed');
      fetchApplications(selectedJob);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete application');
    }
  };

  const submitInterview = async () => {
    try {
      await recruiterApi.scheduleInterview(interviewModal.appId, {
        scheduledAt: interviewModal.scheduledAt,
        meetingLink: interviewModal.meetingLink,
        notes: interviewModal.notes
      });
      toast.success('Interview scheduled & email sent!');
      setInterviewModal({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' });
      fetchApplications(selectedJob);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule');
    }
  };

  const handleRateCandidate = async (appId, rating) => {
    try {
      await recruiterApi.rateCandidate(appId, { rating });
      toast.success('Rating saved');
      fetchApplications(selectedJob);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save rating');
    }
  };

  const handleSaveNotes = async (appId) => {
    try {
      await recruiterApi.addRecruiterNote(appId, { notes: localNotes[appId] || '' });
      toast.success('Notes saved');
      // No strict need to re-fetch unless desired, optimistic map allows keeping text
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save notes');
    }
  };

  // Client-side filtering
  const filteredApplications = useMemo(() => {
    let result = applications;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(app => {
        const name = (app.jobSeekerId?.name || '').toLowerCase();
        const email = (app.jobSeekerId?.email || '').toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    }

    if (statusFilter) {
      result = result.filter(app => (app.status || 'applied') === statusFilter);
    }

    return result;
  }, [applications, searchQuery, statusFilter]);

  const activeJobDetails = jobs.find(job => job._id === selectedJob);
  const acceptedCount = applications.filter(app => app.status === 'accepted').length;
  const openingsCount = activeJobDetails?.numberOfOpenings || 1;
  const isFulfilled = acceptedCount >= openingsCount;

  const handleCloseJob = async () => {
    try {
      await recruiterApi.closeJob(selectedJob, { reason: 'filled' });
      toast.success('Job closed and marked as filled successfully');
      setJobs(jobs.filter(j => j._id !== selectedJob));
      setApplications([]);
      setSelectedJob(jobs.find(j => j._id !== selectedJob)?._id || null);
    } catch (err) {
      toast.error('Failed to close job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-primary" />
            Manage Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and process candidates for your active job listings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Job Selector Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg-secondary">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-primary" />
                Select Listing
              </h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {jobs.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No jobs posted yet.</div>
              ) : (
                jobs.map(job => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJob(job._id)}
                    className={`w-full text-left p-4 border-b border-gray-100 dark:border-dark-border transition-colors ${
                      selectedJob === job._id 
                        ? 'bg-primary/5 border-l-4 border-l-primary' 
                        : 'hover:bg-gray-50 dark:hover:bg-dark-hover border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{job.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{job.applicationCount || 0} applicants</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pipeline Area */}
        <div className="lg:col-span-3">
          <Card className="min-h-[500px] p-6">
            {!selectedJob ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                Select a job from the list to view candidates.
              </div>
            ) : loadingApps ? (
              <div className="h-full flex items-center justify-center"><Spinner /></div>
            ) : applications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
                <FileText className="w-12 h-12 text-gray-300 mb-4" />
                No applications received for this job yet.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Fulfillment Banner */}
                {isFulfilled && activeJobDetails?.status !== 'filled' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between">
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-300 flex items-center mb-1">
                        <CheckCircle className="w-5 h-5 mr-2" /> Target Reached!
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        You have successfully accepted {acceptedCount} candidates, reaching the target of {openingsCount} open positions for this job.
                      </p>
                    </div>
                    <Button 
                      onClick={handleCloseJob} 
                      className="mt-3 sm:mt-0 whitespace-nowrap bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm"
                    >
                      Close & Mark as Filled
                    </Button>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 border-b pb-4 mb-4 border-gray-100 dark:border-dark-border">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-transparent text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[140px]"
                    >
                      <option value="">All Status</option>
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {filteredApplications.length} of {applications.length} candidates
                    </span>
                  </div>
                </div>

                {/* Filtered Results */}
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No candidates match your filters.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setStatusFilter(''); }}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  filteredApplications.map(app => (
                    <div key={app._id} className="border border-gray-200 dark:border-dark-border rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-dark-bg-secondary">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-shrink-0">
                            {app.jobSeekerProfile?.profilePicture ? (
                              <img 
                                src={app.jobSeekerProfile.profilePicture} 
                                alt={app.jobSeekerId?.name || ''} 
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                                {(app.jobSeekerId?.name?.[0] || app.jobSeekerId?.firstName?.[0] || 'U')}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {app.jobSeekerId?.name || `${app.jobSeekerId?.firstName || ''} ${app.jobSeekerId?.lastName || ''}`}
                              </h4>
                              <button
                                onClick={() => {
                                  const id = app.jobSeekerId?._id || app.jobSeekerId;
                                  if (id) navigate(`/recruiter/candidates/${id}`);
                                }}
                                className="text-primary hover:text-primary-600 p-1 flex items-center transition-colors"
                                title="View Profile"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" /> {app.jobSeekerId?.email}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                          <span className="font-medium">Cover Letter:</span> {app.coverLetter || 'No cover letter provided'}
                        </p>
                        {app.screeningAnswers && app.screeningAnswers.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Screening Answers</span>
                            <div className="space-y-2">
                              {app.screeningAnswers.map((sa, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Q: {sa.question}</span>
                                  <p className="text-gray-600 dark:text-gray-400 mt-0.5 whitespace-pre-wrap pl-4 border-l-2 border-primary/20">A: {sa.answer}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col justify-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                        {/* Rating & Notes */}
                        <div className="mb-4 bg-gray-50 dark:bg-dark-bg-tertiary p-3 rounded-lg border border-gray-100 dark:border-dark-border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Candidate Rating</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 cursor-pointer hover:text-yellow-400 hover:fill-current transition-colors ${app.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                                  onClick={() => handleRateCandidate(app._id, star)} 
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex gap-2">
                              <textarea 
                                className="w-full text-xs border border-gray-200 dark:border-dark-border rounded p-2 dark:bg-dark-bg text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-400" 
                                rows={2}
                                placeholder="Write internal processing notes here..."
                                defaultValue={app.notes || ''}
                                onChange={(e) => setLocalNotes({ ...localNotes, [app._id]: e.target.value })}
                              />
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button size="sm" className="px-2 py-1 text-xs" variant="outline" onClick={() => handleSaveNotes(app._id)}>Save Note</Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end mb-2">
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            app.status === 'interviewing' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status?.toUpperCase() || 'APPLIED'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-end">
                          {app.status === 'rejected' && (
                            <Button size="sm" variant="outline" className="text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteApplication(app._id)}>
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => requestStatusChange(app._id, 'rejected')}>
                            Reject
                          </Button>
                          <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => setInterviewModal({ isOpen: true, appId: app._id, scheduledAt: '', meetingLink: '', notes: '' })}>
                            Interview
                          </Button>
                          <Button size="sm" variant="primary" className="bg-green-600 hover:bg-green-700 border-green-600" onClick={() => requestStatusChange(app._id, 'accepted')}>
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>

      </div>
      {/* Warning Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, appId: null, status: null })}
        title={`Confirm ${confirmModal.status?.charAt(0).toUpperCase() + confirmModal.status?.slice(1)}`}
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to {confirmModal.status} this candidate? <br/><br/>
            <strong className="text-red-500">Warning: This step is irreversible.</strong>
          </p>
          <div className="flex justify-end gap-3 cursor-pointer">
             <Button variant="outline" onClick={() => setConfirmModal({ isOpen: false, appId: null, status: null })}>
               Cancel
             </Button>
             <Button 
               variant={confirmModal.status === 'rejected' ? 'danger' : 'primary'}
               onClick={() => executeStatusChange(confirmModal.appId, confirmModal.status)}
               className={confirmModal.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
               Yes, {confirmModal.status}
             </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModal.isOpen}
        onClose={() => setInterviewModal({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' })}
        title="Schedule Interview"
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time <span className="text-red-500">*</span></label>
            <input 
              type="datetime-local" 
              className="w-full p-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100"
              value={interviewModal.scheduledAt}
              onChange={(e) => setInterviewModal({...interviewModal, scheduledAt: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Link <span className="text-red-500">*</span></label>
            <input 
              type="url" 
              placeholder="e.g. https://meet.google.com/..."
              className="w-full p-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100"
              value={interviewModal.meetingLink}
              onChange={(e) => setInterviewModal({...interviewModal, meetingLink: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions for Candidate (Optional)</label>
            <textarea 
              placeholder="Any prep needed before standard technical interview..."
              className="w-full p-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100"
              rows={3}
              value={interviewModal.notes}
              onChange={(e) => setInterviewModal({...interviewModal, notes: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
             <Button variant="outline" onClick={() => setInterviewModal({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' })}>
               Cancel
             </Button>
             <Button 
               variant="primary"
               onClick={submitInterview}
               disabled={!interviewModal.scheduledAt || !interviewModal.meetingLink}
              >
               Confirm & Send Email
             </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;
