import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApi } from '@api/publicApi';
import useAuthStore from '@store/authStore';
import { 
  MapPin, Briefcase, DollarSign, Clock, Building, 
  ArrowLeft, Calendar, Share2, Bookmark, HelpCircle 
} from 'lucide-react';
import Button from '@components/common/Button';
import Spinner from '@components/common/Spinner';
import ApplyJobModal from '@components/jobs/ApplyJobModal';
import toast from 'react-hot-toast';
import { jobSeekerApi } from '@api/jobSeekerApi';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const { appliedJobs } = useAuthStore();
  const hasApplied = appliedJobs?.includes(id) || false;

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'jobseeker') {
      checkIfSaved();
    }
    // Track job view
    publicApi.trackJobView(id, { source: 'job_detail_page' }).catch(err => console.error("Could not track view", err));
  }, [id, isAuthenticated, user]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await publicApi.getJobById(id);
      setJob(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const res = await jobSeekerApi.getSavedJobs();
      const savedJobs = res.data?.savedJobs || [];
      const saved = savedJobs.some(item => item.jobId?._id === id);
      setIsSaved(saved);
    } catch (err) {
      console.error('Failed to check saved jobs:', err);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) return toast.error('Please login to save jobs');
    if (user?.role !== 'jobseeker') return toast.error('Only job seekers can save jobs');
    
    setSavingJob(true);
    try {
      if (isSaved) {
        await jobSeekerApi.unsaveJob(id);
        toast.success('Job removed from saved');
        setIsSaved(false);
      } else {
        await jobSeekerApi.saveJob(id);
        toast.success('Job saved successfully');
        setIsSaved(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update saved job');
    } finally {
      setSavingJob(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (user?.role !== 'jobseeker') {
      toast.error('Only job seekers can apply');
      return;
    }
    setIsApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Oops! Something went wrong.
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">{error || 'Job not found'}</p>
          <Button onClick={() => navigate('/jobs')} variant="outline">
            Back to Jobs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />
      <div className="py-8">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to list
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8">
              
              <div className="flex items-start gap-6">
                {/* Company Logo */}
                {job.companyId?.companyLogo ? (
                  <img 
                    src={job.companyId.companyLogo} 
                    alt={job.companyId.companyName} 
                    className="h-16 w-16 flex-shrink-0 rounded-xl bg-gray-50 p-2 object-contain dark:bg-dark-bg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building className="w-8 h-8 text-primary" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-primary font-medium mb-4">
                    {job.companyId?.companyName || job.company}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      {job.location?.isRemote ? 'Remote' : `${job.location?.city}, ${job.location?.country}`}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1.5" />
                      {job.employmentType}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1.5" />
                      ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-8 dark:border-dark-border">
                <div className="flex gap-4">
                  <Button onClick={hasApplied ? null : handleApplyClick} size="lg" className={`px-8 ${hasApplied ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' : ''}`} disabled={hasApplied}>
                    {hasApplied ? 'Already Applied' : 'Apply Now'}
                  </Button>
                  <Button 
                    variant={isSaved ? 'primary' : 'outline'} 
                    onClick={handleSaveJob} 
                    isLoading={savingJob}
                    className="px-4"
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const url = window.location.href;
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: job.title, url });
                        } catch (err) {
                          // User cancelled share
                        }
                      } else {
                        await navigator.clipboard.writeText(url);
                        toast.success('Job link copied to clipboard!');
                      }
                    }}
                    className="px-4"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Description</h2>
              <div 
                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {job.responsibilities?.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Responsibilities</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </>
              )}

              {job.requirements?.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Screening Questions */}
              {job.screeningQuestions?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-dark-border">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Screening Questions
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    You will be asked the following questions when applying for this position.
                  </p>
                  <div className="space-y-3">
                    {job.screeningQuestions.map((sq, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-100 dark:border-dark-border">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 dark:text-gray-200 font-medium">{sq.question}</p>
                        </div>
                        {sq.isRequired ? (
                          <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Required
                          </span>
                        ) : (
                          <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            Optional
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Job Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date Posted</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(job.postedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {job.experienceLevel || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {job.location?.isRemote ? 'Remote' : `${job.location?.city || ''}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill) => (
                  <span
                    key={skill._id || skill}
                    className="px-3 py-1 bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-dark-border"
                  >
                    {skill.name || skill}
                  </span>
                ))}
                {(!job.requiredSkills || job.requiredSkills.length === 0) && (
                  <span className="text-gray-500 text-sm">No skills specified</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
      <Footer />

      {isApplyModalOpen && (
        <ApplyJobModal job={job} onClose={() => setIsApplyModalOpen(false)} />
      )}
    </div>
  );
};

export default JobDetails;
