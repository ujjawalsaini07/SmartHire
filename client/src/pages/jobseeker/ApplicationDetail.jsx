import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, XCircle, FileText, Send } from 'lucide-react';
import { jobSeekerApi } from '@api/jobSeekerApi';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await jobSeekerApi.getApplicationDetails(id);
      setApplication(res.data);
    } catch (error) {
      console.error('Failed to load application details', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusFlow = (currentStatus) => {
    // Basic ordered status mapping for visual pipeline
    const statuses = ['applied', 'interviewing', 'accepted'];
    const currentIdx = statuses.indexOf(currentStatus?.toLowerCase() || 'applied');
    
    // If rejected, override flow visually
    if (currentStatus?.toLowerCase() === 'rejected') {
      return (
        <div className="flex items-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 my-6">
          <XCircle className="w-8 h-8 text-red-500 mr-4" />
          <div>
            <h3 className="font-bold text-red-700 dark:text-red-400">Application Rejected</h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">Unfortunately, the company has decided to move forward with other candidates.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="my-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Application Status</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 dark:bg-dark-border -z-10 -translate-y-1/2 rounded-full"></div>
          
          <div className={`absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500`}
               style={{ width: `${Math.max(0, (currentIdx / (statuses.length - 1)) * 100)}%` }}></div>

          {['Applied', 'Interviewing', 'Accepted'].map((step, idx) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                idx <= currentIdx 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-gray-300'
              }`}>
                {idx < currentIdx ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
              </div>
              <span className={`mt-3 text-sm font-medium ${
                idx <= currentIdx ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  if (!application) return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-12">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Not Found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This application may have been removed or the link is invalid.
        </p>
        <button
          onClick={() => navigate('/jobseeker/applications')}
          className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Applications
      </button>

      {application.status === 'interviewing' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start text-blue-800 dark:text-blue-300">
          <Clock className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-lg mb-1">You have an upcoming interview!</h4>
            <p className="text-sm">Please refer to your registered email inbox for the meeting link, schedule, and further instructions from the recruiter.</p>
          </div>
        </div>
      )}

      <Card className="p-8 border-t-4 border-t-primary border-l-0 border-r-0 border-b-0 rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {application.jobId?.title || 'Job Role'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {application.jobId?.companyId?.companyName || application.jobId?.company || 'Company'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500 flex items-center justify-end dark:text-gray-400 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              Applied Date
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {new Date(application.appliedAt || application.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {getStatusFlow(application.status)}

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-dark-border grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Application Snapshot
            </h3>
            <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-5 border border-gray-100 dark:border-dark-border">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Submitted Cover Letter</p>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm">
                {application.coverLetter || <span className="italic text-gray-400">No cover letter submitted.</span>}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-primary" />
              Next Steps
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Your profile and default resume were attached automatically. The recruiter will review your application along with these credentials.
              </p>
              <button 
                onClick={() => navigate(`/jobs/${application.jobId?._id}`)}
                className="w-full py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
              >
                View Original Job Posting
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationDetail;
