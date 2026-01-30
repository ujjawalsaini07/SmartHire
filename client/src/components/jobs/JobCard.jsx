import { MapPin, Briefcase, DollarSign, Clock, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max.toLocaleString()}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 group"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Company Logo */}
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          )}

          {/* Job Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
              {job.title}
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
              {job.company?.name || 'Company Name'}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location || 'Remote'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>{job.employmentType || 'Full-time'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{getTimeAgo(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Handle bookmark action
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
          aria-label="Bookmark job"
        >
          <Bookmark className="w-5 h-5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="secondary" size="sm">
              {skill.name || skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <Badge variant="secondary" size="sm">
              +{job.skills.length - 5} more
            </Badge>
          )}
        </div>
      )}

      {/* Salary */}
      <div className="flex items-center justify-between pt-4 border-t border-light-border dark:border-dark-border">
        <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-semibold">
          <DollarSign className="w-5 h-5" />
          <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        
        {job.isUrgent && (
          <Badge variant="error">Urgent</Badge>
        )}
      </div>
    </Card>
  );
};

export default JobCard;
