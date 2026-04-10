// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Calendar, Download, Building, GraduationCap, ExternalLink, Linkedin, Github, Globe, Eye, X, FileText, Video } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { recruiterApi } from '@api/recruiterApi';
// import Button from '@components/common/Button';
// import Badge from '@components/common/Badge';
// import Modal from '@components/common/Modal';
// import Input from '@components/common/Input';
// import toast from 'react-hot-toast';

// const getFileUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http://') || path.startsWith('https://')) return path;
//   const filePath = path.startsWith('/') ? path : `/${path}`;
//   return filePath;
// };

// const CandidateProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
//   const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
//   const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!messageForm.subject.trim() || !messageForm.message.trim()) {
//       return toast.error("Please fill in all fields.");
//     }
    
//     try {
//       setSendingMessage(true);
//       await recruiterApi.contactCandidate({
//          candidateId: id,
//          subject: messageForm.subject,
//          message: messageForm.message
//       });
//       toast.success("Message sent to candidate.");
//       setIsMessageModalOpen(false);
//       setMessageForm({ subject: '', message: '' });
//     } catch(error) {
//       console.error('Error sending message:', error);
//       toast.error(error.response?.data?.message || "Failed to send message.");
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await recruiterApi.viewJobSeekerProfile(id);
//         setCandidate(response.data || response); // Handle potential response structures
//       } catch (error) {
//         console.error('Error fetching candidate profile:', error);
//         toast.error('Failed to load candidate profile');
//         navigate('/recruiter/candidates');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProfile();
//     }
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   if (!candidate) return null;

//   const { 
//     firstName, 
//     lastName, 
//     email, 
//     phone, 
//     profilePicture,
//     headline,
//     summary,
//     location,
//     skills = [], 
//     workExperience = [], 
//     education = [], 
//     resume, 
//     videoResume,
//     socialLinks 
//   } = candidate;

//   // Format location
//   const locationString = location ? `${location.city || ''}${location.city && location.state ? ', ' : ''}${location.state || ''}` : '';

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 transition-colors duration-300">
//       <div className="container-custom">
//         {/* Back Button */}
//         <button 
//           onClick={() => navigate('/recruiter/candidates')}
//           className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Search
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
            
//             {/* Header Card */}
//             <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-sm border border-light-border dark:border-dark-border">
//               <div className="flex flex-col md:flex-row gap-6 items-start">
//                 {/* Avatar */}
//                 <div className="flex-shrink-0">
//                   {profilePicture ? (
//                     <img 
//                       src={profilePicture} 
//                       alt={`${firstName} ${lastName}`} 
//                       className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-dark-bg shadow-md"
//                     />
//                   ) : (
//                     <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400 border-4 border-gray-50 dark:border-dark-bg">
//                       {firstName?.[0]}{lastName?.[0]}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1">
//                   <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
//                     {firstName} {lastName}
//                   </h1>
//                   <p className="text-xl text-primary-600 dark:text-primary-400 font-medium mb-3">
//                     {headline || 'Open to Work'}
//                   </p>
                  
//                   <div className="flex flex-wrap gap-4 text-light-text-secondary dark:text-dark-text-secondary">
//                     {locationString && (
//                       <div className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1.5" />
//                         {locationString}
//                       </div>
//                     )}
//                     {email && (
//                       <div className="flex items-center">
//                         <Mail className="w-4 h-4 mr-1.5" />
//                         {email}
//                       </div>
//                     )}
//                     {phone && (
//                       <div className="flex items-center">
//                         <Phone className="w-4 h-4 mr-1.5" />
//                         {phone}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Bio */}
//               <div className="mt-8 pt-8 border-t border-light-border dark:border-dark-border">
//                 <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">About</h3>
//                 <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
//                   {summary || 'No bio provided.'}
//                 </p>
//               </div>
//             </div>

//             {/* Experience */}
//             <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-sm border border-light-border dark:border-dark-border">
//               <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center">
//                 <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
//                 Experience
//               </h2>
              
//               <div className="space-y-8">
//                 {workExperience.length > 0 ? (
//                   workExperience.map((exp, index) => (
//                     <div key={index} className="relative pl-8 border-l-2 border-gray-100 dark:border-dark-bg-tertiary">
//                       <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900 border-2 border-white dark:border-dark-bg-secondary"></div>
//                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
//                         <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
//                           {exp.title}
//                         </h3>
//                         <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
//                           {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
//                           {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}
//                         </span>
//                       </div>
//                       <div className="text-primary-600 dark:text-primary-400 font-medium mb-2 flex items-center">
//                         <Building className="w-4 h-4 mr-1.5" />
//                         {exp.company}
//                       </div>
//                       <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
//                         {exp.description}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-light-text-secondary dark:text-dark-text-secondary italic">No experience listed.</p>
//                 )}
//               </div>
//             </div>

//             {/* Education */}
//             <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-sm border border-light-border dark:border-dark-border">
//               <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center">
//                 <GraduationCap className="w-5 h-5 mr-2 text-primary-600" />
//                 Education
//               </h2>
              
//               <div className="space-y-6">
//                 {education.length > 0 ? (
//                   education.map((edu, index) => (
//                     <div key={index} className="flex gap-4">
//                       <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-dark-bg-tertiary flex items-center justify-center flex-shrink-0">
//                         <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-light-text dark:text-dark-text">{edu.school}</h3>
//                         <p className="text-light-text-secondary dark:text-dark-text-secondary">{edu.degree} in {edu.fieldOfStudy}</p>
//                         <p className="text-sm text-gray-400 mt-1">
//                           {new Date(edu.startDate).getFullYear()} - {edu.current ? 'Present' : new Date(edu.endDate).getFullYear()}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-light-text-secondary dark:text-dark-text-secondary italic">No education listed.</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-8">
//             {/* Contact Actions */}
//             <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
//               <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Contact</h3>
//               <Button onClick={() => setIsMessageModalOpen(true)} className="w-full">
//                 <Mail className="w-4 h-4 mr-2" />
//                 Message Candidate
//               </Button>
//             </div>
//             {/* Skills */}
//             <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
//               <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Skills</h3>
//               {skills.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {skills.map((skill, index) => (
//                     <Badge key={index} variant="secondary">
//                        {typeof skill === 'string' ? skill : skill.name}
//                     </Badge>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-light-text-secondary dark:text-dark-text-secondary italic">No skills listed.</p>
//               )}
//             </div>
//             {/* Resume Block */}
//             {resume && (
//               <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
//                 <h3 className="font-semibold text-light-text dark:text-dark-text mb-4 flex items-center">
//                   <FileText className="w-5 h-5 mr-2 text-primary-600" /> Resume
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="rounded-lg overflow-hidden border border-light-border dark:border-dark-border bg-gray-100 dark:bg-gray-800" style={{ height: '220px' }}>
//                     <iframe
//                       src={getFileUrl(resume.fileUrl || resume)}
//                       title="Resume preview"
//                       className="w-full h-full border-0 pointer-events-none"
//                       tabIndex={-1}
//                     />
//                   </div>
//                   <div>
//                     {resume.uploadedAt && (
//                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
//                          Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
//                        </p>
//                     )}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="outline" className="flex-1 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-primary-100 dark:border-primary-800" onClick={() => setResumePreviewOpen(true)}>
//                       <Eye className="w-4 h-4 mr-2" /> View
//                     </Button>
//                     <a 
//                       href={resume.fileUrl || resume} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex-1"
//                     >
//                       <Button variant="outline" className="w-full text-sm">
//                         <Download className="w-4 h-4 mr-2" /> Download
//                       </Button>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Video Resume Block */}
//             {videoResume && (
//               <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
//                 <h3 className="font-semibold text-light-text dark:text-dark-text mb-4 flex items-center">
//                   <Video className="w-5 h-5 mr-2 text-primary-600" /> Video Resume
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
//                     <video
//                       src={getFileUrl(videoResume.fileUrl || videoResume)}
//                       className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
//                         <Eye className="w-6 h-6" />
//                       </div>
//                     </div>
//                     {/* Invisible overlay capturing click to open modal */}
//                     <div className="absolute inset-0 cursor-pointer" onClick={() => setVideoPreviewOpen(true)}></div>
//                   </div>
//                   {videoResume.uploadedAt && (
//                     <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
//                       Uploaded {new Date(videoResume.uploadedAt).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

            

//             {/* Social Links */}
//             {(socialLinks?.linkedin || socialLinks?.github || socialLinks?.portfolio) && (
//               <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
//                 <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Social Links</h3>
//                 <div className="space-y-3">
//                   {socialLinks.linkedin && (
//                     <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 transition-colors">
//                       <Linkedin className="w-5 h-5 mr-3" />
//                       LinkedIn
//                     </a>
//                   )}
//                   {socialLinks.github && (
//                     <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 transition-colors">
//                       <Github className="w-5 h-5 mr-3" />
//                       GitHub
//                     </a>
//                   )}
//                   {socialLinks.portfolio && (
//                     <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 transition-colors">
//                       <Globe className="w-5 h-5 mr-3" />
//                       Portfolio
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Message Candidate Modal */}
//       <Modal
//         isOpen={isMessageModalOpen}
//         onClose={() => setIsMessageModalOpen(false)}
//         title="Message Candidate"
//       >
//         <form onSubmit={handleSendMessage} className="space-y-4">
//           <Input
//             label="Subject"
//             name="subject"
//             value={messageForm.subject}
//             onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
//             placeholder="e.g. Discussing the Software Engineer role"
//             required
//           />
          
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Message
//             </label>
//             <textarea
//               name="message"
//               value={messageForm.message}
//               onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
//               rows="5"
//               className="w-full px-4 py-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
//               placeholder={`Write your message to ${firstName}...`}
//               required
//             ></textarea>
//           </div>
          
//           <div className="flex justify-end pt-4 space-x-3">
//             <Button
//               variant="outline"
//               onClick={() => setIsMessageModalOpen(false)}
//               disabled={sendingMessage}
//               type="button"
//             >
//               Cancel
//             </Button>
//             <Button type="submit" isLoading={sendingMessage}>
//               Send Message
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Resume Preview Overlay */}
//       <ResumePreviewOverlay
//         open={resumePreviewOpen}
//         fileUrl={resume?.fileUrl ? getFileUrl(resume.fileUrl) : (typeof resume === 'string' ? resume : null)}
//         onClose={() => setResumePreviewOpen(false)}
//         fileName={resume?.fileName || 'candidate-resume'}
//       />

//       {/* Video Resume Overlay */}
//       <VideoResumeOverlay
//         open={videoPreviewOpen}
//         fileUrl={videoResume?.fileUrl ? getFileUrl(videoResume.fileUrl) : (typeof videoResume === 'string' ? videoResume : null)}
//         onClose={() => setVideoPreviewOpen(false)}
//       />

//     </div>
//   );
// };

// // Overlay Components logic appended here
// const ResumePreviewOverlay = ({ open, fileUrl, onClose, fileName }) => {
//   if (!open) return null;

//   return (
//     <AnimatePresence>
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
//         <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
//         <div className="relative z-10 w-full max-w-4xl h-[90vh] mx-4 flex flex-col">
//           <div className="flex items-center justify-between bg-gray-900/90 backdrop-blur rounded-t-xl px-5 py-3">
//             <p className="text-white text-sm font-medium truncate pr-4">{fileName || 'Resume'}</p>
//             <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <div className="flex-1 bg-gray-800 rounded-b-xl overflow-hidden flex items-center justify-center">
//             {fileUrl ? <iframe src={fileUrl} title="Resume Preview" className="w-full h-full border-0" /> : null}
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// const VideoResumeOverlay = ({ open, fileUrl, onClose }) => {
//   if (!open) return null;

//   return (
//     <AnimatePresence>
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
//         <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
//         <div className="relative z-10 w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col">
//           <div className="flex items-center justify-between bg-gray-900/90 backdrop-blur rounded-t-xl px-5 py-3">
//             <p className="text-white text-sm font-medium truncate pr-4">Video Resume</p>
//             <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <div className="flex-1 bg-black rounded-b-xl overflow-hidden aspect-video flex items-center justify-center">
//             {fileUrl ? <video src={fileUrl} controls autoPlay className="w-full h-full max-h-[85vh]" /> : null}
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default CandidateProfile;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Calendar, Download, Building, GraduationCap, ExternalLink, Linkedin, Github, Globe, Eye, X, FileText, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { recruiterApi } from '@api/recruiterApi';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import toast from 'react-hot-toast';

const getFileUrl = (path) => {
  // Added strict type checking to prevent .startsWith errors on invalid data
  if (!path || typeof path !== 'string') return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const filePath = path.startsWith('/') ? path : `/${path}`;
  return filePath;
};

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      return toast.error("Please fill in all fields.");
    }
    
    try {
      setSendingMessage(true);
      await recruiterApi.contactCandidate({
         candidateId: id,
         subject: messageForm.subject,
         message: messageForm.message
      });
      toast.success("Message sent to candidate.");
      setIsMessageModalOpen(false);
      setMessageForm({ subject: '', message: '' });
    } catch(error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await recruiterApi.viewJobSeekerProfile(id);
        setCandidate(response.data || response); // Handle potential response structures
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        toast.error('Failed to load candidate profile');
        navigate('/recruiter/candidates');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!candidate) return null;

  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    profilePicture,
    headline,
    summary,
    location,
    skills = [], 
    workExperience = [], 
    education = [], 
    resume, 
    videoResume,
    socialLinks 
  } = candidate;

  // Format location
  const locationString = location ? `${location.city || ''}${location.city && location.state ? ', ' : ''}${location.state || ''}` : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 transition-colors duration-300">
      <div className="container-custom">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/recruiter/candidates')}
          className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Card */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-sm border border-light-border dark:border-dark-border">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt={`${firstName} ${lastName}`} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-dark-bg shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400 border-4 border-gray-50 dark:border-dark-bg">
                      {firstName?.[0]}{lastName?.[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                    {firstName} {lastName}
                  </h1>
                  <p className="text-xl text-primary-600 dark:text-primary-400 font-medium mb-3">
                    {headline || 'Open to Work'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {locationString && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {locationString}
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1.5" />
                        {email}
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1.5" />
                        {phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-8 pt-8 border-t border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">About</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {summary || 'No bio provided.'}
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-sm border border-light-border dark:border-dark-border">
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                Experience
              </h2>
              
              <div className="space-y-8">
                {workExperience.length > 0 ? (
                  workExperience.map((exp, index) => (
                    <div key={index} className="relative pl-8 border-l-2 border-gray-100 dark:border-dark-bg-tertiary">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900 border-2 border-white dark:border-dark-bg-secondary"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                          {exp.title}
                        </h3>
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
                          {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                          {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}
                        </span>
                      </div>
                      <div className="text-primary-600 dark:text-primary-400 font-medium mb-2 flex items-center">
                        <Building className="w-4 h-4 mr-1.5" />
                        {exp.company}
                      </div>
                      <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary italic">No experience listed.</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-sm border border-light-border dark:border-dark-border">
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary-600" />
                Education
              </h2>
              
              <div className="space-y-6">
                {education.length > 0 ? (
                  education.map((edu, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-dark-bg-tertiary flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-light-text dark:text-dark-text">{edu.school}</h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">{edu.degree} in {edu.fieldOfStudy}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(edu.startDate).getFullYear()} - {edu.current ? 'Present' : new Date(edu.endDate).getFullYear()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary italic">No education listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Actions */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
              <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Contact</h3>
              <Button onClick={() => setIsMessageModalOpen(true)} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Message Candidate
              </Button>
            </div>
            {/* Skills */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
              <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Skills</h3>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                       {typeof skill === 'string' ? skill : skill.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-light-text-secondary dark:text-dark-text-secondary italic">No skills listed.</p>
              )}
            </div>
            {/* Resume Block */}
            {resume && (typeof resume === 'string' || resume.fileUrl) && (
              <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
                <h3 className="font-semibold text-light-text dark:text-dark-text mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" /> Resume
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border border-light-border dark:border-dark-border bg-gray-100 dark:bg-gray-800" style={{ height: '220px' }}>
                    <iframe
                      src={getFileUrl(resume.fileUrl || resume)}
                      title="Resume preview"
                      className="w-full h-full border-0 pointer-events-none"
                      tabIndex={-1}
                    />
                  </div>
                  <div>
                    {resume.uploadedAt && (
                       <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                         Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                       </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-primary-100 dark:border-primary-800" onClick={() => setResumePreviewOpen(true)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <a 
                      href={getFileUrl(resume.fileUrl || resume)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full text-sm">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Video Resume Block */}
            {videoResume && (typeof videoResume === 'string' || videoResume.fileUrl) && (
              <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
                <h3 className="font-semibold text-light-text dark:text-dark-text mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2 text-primary-600" /> Video Resume
                </h3>
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                    <video
                      src={getFileUrl(videoResume.fileUrl || videoResume)}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                    {/* Invisible overlay capturing click to open modal */}
                    <div className="absolute inset-0 cursor-pointer" onClick={() => setVideoPreviewOpen(true)}></div>
                  </div>
                  {videoResume.uploadedAt && (
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      Uploaded {new Date(videoResume.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            

            {/* Social Links */}
            {(socialLinks?.linkedin || socialLinks?.github || socialLinks?.portfolio) && (
              <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border">
                <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Social Links</h3>
                <div className="space-y-3">
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 transition-colors">
                      <Linkedin className="w-5 h-5 mr-3" />
                      LinkedIn
                    </a>
                  )}
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 transition-colors">
                      <Github className="w-5 h-5 mr-3" />
                      GitHub
                    </a>
                  )}
                  {socialLinks.portfolio && (
                    <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 transition-colors">
                      <Globe className="w-5 h-5 mr-3" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Candidate Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title="Message Candidate"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Input
            label="Subject"
            name="subject"
            value={messageForm.subject}
            onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
            placeholder="e.g. Discussing the Software Engineer role"
            required
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              name="message"
              value={messageForm.message}
              onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
              rows="5"
              className="w-full px-4 py-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
              placeholder={`Write your message to ${firstName}...`}
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsMessageModalOpen(false)}
              disabled={sendingMessage}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={sendingMessage}>
              Send Message
            </Button>
          </div>
        </form>
      </Modal>

      {/* Resume Preview Overlay */}
      <ResumePreviewOverlay
        open={resumePreviewOpen}
        fileUrl={resume?.fileUrl ? getFileUrl(resume.fileUrl) : (typeof resume === 'string' ? resume : null)}
        onClose={() => setResumePreviewOpen(false)}
        fileName={resume?.fileName || 'candidate-resume'}
      />

      {/* Video Resume Overlay */}
      <VideoResumeOverlay
        open={videoPreviewOpen}
        fileUrl={videoResume?.fileUrl ? getFileUrl(videoResume.fileUrl) : (typeof videoResume === 'string' ? videoResume : null)}
        onClose={() => setVideoPreviewOpen(false)}
      />

    </div>
  );
};

// Overlay Components logic appended here
const ResumePreviewOverlay = ({ open, fileUrl, onClose, fileName }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-4xl h-[90vh] mx-4 flex flex-col">
          <div className="flex items-center justify-between bg-gray-900/90 backdrop-blur rounded-t-xl px-5 py-3">
            <p className="text-white text-sm font-medium truncate pr-4">{fileName || 'Resume'}</p>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-gray-800 rounded-b-xl overflow-hidden flex items-center justify-center">
            {fileUrl ? <iframe src={fileUrl} title="Resume Preview" className="w-full h-full border-0" /> : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const VideoResumeOverlay = ({ open, fileUrl, onClose }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col">
          <div className="flex items-center justify-between bg-gray-900/90 backdrop-blur rounded-t-xl px-5 py-3">
            <p className="text-white text-sm font-medium truncate pr-4">Video Resume</p>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-black rounded-b-xl overflow-hidden aspect-video flex items-center justify-center">
            {fileUrl ? <video src={fileUrl} controls autoPlay className="w-full h-full max-h-[85vh]" /> : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CandidateProfile;
