import React from "react";
import { MapPin, Briefcase, Calendar, ChevronRight } from "lucide-react";

const JobCard = ({ job, onToggleStatus }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className={`group bg-white rounded-lg border p-5 mb-4 transition-all duration-200 
      ${job.isActive ? "border-gray-200 hover:border-blue-300" : "border-gray-100 bg-gray-50 opacity-75 hover:opacity-100"}`}>
      
      <div className="flex justify-between items-start">
        {/* Header Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mr-4">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {job.title}
            </h3>
            
            {/* --- TOGGLE SWITCH --- */}
            <button
              onClick={onToggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                job.isActive ? "bg-blue-600" : "bg-gray-200"
              }`}
              title={job.isActive ? "Click to Close Job" : "Click to Activate Job"}
            >
              <span className="sr-only">Toggle Status</span>
              <span
                className={`${
                  job.isActive ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            {/* --------------------- */}
            
          </div>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            {job.company}
          </p>
        </div>
      </div>

      {/* Meta Data Row */}
      <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-gray-500">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
           job.isActive 
             ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
             : "bg-gray-200 text-gray-600 border-gray-300"
        }`}>
          {job.isActive ? "Active" : "Closed"}
        </span>
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {job.location || "Remote"}
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5" />
          {job.experience} Years Exp.
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Posted {formatDate(job.createdAt)}
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired?.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded border border-gray-200">
              {skill}
            </span>
          ))}
        </div>

        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
          View Applicants
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;