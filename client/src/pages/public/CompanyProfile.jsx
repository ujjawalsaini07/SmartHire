import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Globe, MapPin, Users, Briefcase, ExternalLink,
  ArrowLeft, AlertCircle, Calendar, Mail
} from 'lucide-react';
import { publicApi } from '@api/publicApi';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Spinner from '@components/common/Spinner';

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await publicApi.getPublicCompanyProfile(id);
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            Company Not Found
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            {error || 'This company profile is not available.'}
          </p>
          <Button onClick={() => navigate(-1)} className="flex items-center space-x-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-primary-600 to-accent-600 relative">
        {profile.companyBanner && (
          <img src={profile.companyBanner} alt="Banner" className="w-full h-full object-cover" />
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl border border-light-border dark:border-dark-border p-6 -mt-10 relative z-10 mb-6">
          <div className="flex items-start space-x-5">
            {profile.companyLogo ? (
              <img
                src={profile.companyLogo}
                alt={profile.companyName}
                className="w-20 h-20 rounded-xl object-cover border border-light-border dark:border-dark-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
                {profile.companyName}
              </h1>
              {profile.industry && (
                <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  {profile.industry}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {profile.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                    </span>
                  </span>
                )}
                {profile.companySize && (
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{profile.companySize} employees</span>
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            {profile.isVerified && (
              <Badge variant="success" size="sm">Verified</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* About */}
          <div className="lg:col-span-2 space-y-6">
            {profile.about && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-bg-secondary rounded-xl border border-light-border dark:border-dark-border p-6"
              >
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">About</h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
                  {profile.about}
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-bg-secondary rounded-xl border border-light-border dark:border-dark-border p-6"
            >
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Company Info</h2>
              <div className="space-y-3">
                {profile.foundedYear && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">
                      Founded {profile.foundedYear}
                    </span>
                  </div>
                )}
                {profile.industry && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">
                      {profile.industry}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <Button
              className="w-full"
              onClick={() => navigate('/jobs?company=' + id)}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              View Open Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
