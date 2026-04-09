# SmartHire Frontend – Not Implemented / Poorly Implemented / Bugs Report

**Complete deep analysis of the client-side codebase.**
Every page, component, and route has been reviewed. Issues are grouped by scope and severity.

---

## 🔴 CRITICAL – Broken Navigation & Dead Links

### 1. Navbar "About" and "Contact" links all point to `/pagenotfound`
**File:** `src/components/layout/Navbar.jsx` (lines 24–37)

All three nav link groups (public, recruiter, jobseeker, admin) have "Contact" and "About" links hardcoded to `/pagenotfound`. These produce a 404 on every click.

```js
{ to: '/pagenotfound', label: 'About' },
{ to: '/pagenotfound', label: 'Contact' },
```

**Fix needed:** Create and wire up `/about` and `/contact` pages, or remove the nav links entirely.

---

### 2. Navbar Profile & Settings dropdown links go to `#` (do nothing)
**File:** `src/components/layout/Navbar.jsx` (lines 124–137)

The authenticated user's dropdown menu has "Profile" and "Settings" both pointing to `href="#"`. Clicking them keeps the user on the same page and never opens the correct profile or settings.

```jsx
<Link to={`#`}>Profile</Link>
<Link to={`#`}>Settings</Link>
```

**Fix needed:** Route these to role-aware paths: `/jobseeker/profile`, `/recruiter/profile`, `/jobseeker/settings`, `/recruiter/settings`, etc., based on `user.role`.

---

### 3. Admin Dashboard Quick-Action buttons use `window.location.href` with wrong paths
**File:** `src/pages/admin/Dashboard.jsx` (lines 129–168)

Quick-action buttons perform full-page navigations via `window.location.href` instead of React Router's `navigate()`. Additionally, the "Verify Recruiters" button routes to `/admin/recruiters/verify` which **does not exist** in the route config (the actual path is `/admin/recruiters`).

```js
onClick={() => window.location.href = '/admin/recruiters/verify'} // 404
```

**Fix needed:** Replace all `window.location.href` with `useNavigate()` and fix the path to `/admin/recruiters`.

---

### 4. Register page links to `/terms` and `/privacy` – both 404
**File:** `src/pages/public/Register.jsx` (lines 226–232)

The "Terms of Service" and "Privacy Policy" links at registration go to routes that do not exist anywhere in the app. The "required" checkbox will block form submission but always links to dead pages.

**Fix needed:** Create those pages or remove/replace the links with external or placeholder pages.

---

### 5. RecruiterVerification "Visit Profile" opens a non-existent route
**File:** `src/pages/admin/RecruiterVerification.jsx` (lines 184–186)

```js
window.open(`/recruiters/${profileId}/profile`, '_blank');
```

`/recruiters/:id/profile` has no route defined in `AppRoutes.jsx`. This always opens a 404 blank tab.

**Fix needed:** Remove this button or create the corresponding public recruiter profile route.

---

### 6. `JobCard` "Company" button navigates to `/companies/:id` – route does not exist
**File:** `src/components/jobs/JobCard.jsx` (lines 101–108)

```js
navigate(`/companies/${company._id}`);
```

There is no `/companies` route anywhere in the app. Users who click "Company" get a 404.

**Fix needed:** Create a company profile page + route, or remove/disable the button for now.

---

## 🔴 CRITICAL – Core Feature Not Implemented

### 7. Settings pages are entirely non-functional (all three roles)
**Files:**
- `src/pages/jobseeker/Settings.jsx`
- `src/pages/recruiter/Settings.jsx`
- `src/pages/admin/Settings.jsx`

All three Settings pages:
- Have sidebar navigation tabs that are **purely visual** – clicking "Password" or "Privacy" does NOT switch the displayed content.
- "Change Password" button is a `<button type="button">` with **no click handler** or navigation.
- On submit, the form just shows a `toast.success()` without making any API call. Nothing is saved.
- Jobseeker Settings only shows Notification Preferences; there are no password change, privacy, account deletion, or email sections.

**Fix needed:** Implement tab switching, wire up actual API calls for saving preferences, build a functional Change Password form (call `/api/auth/change-password`), and add account deletion functionality.

---

### 8. Recruiter Analytics page is a placeholder with mocked fallback data
**File:** `src/pages/recruiter/Analytics.jsx`

The entire bottom section of the page is an empty state card saying *"Chart visualizations are being gathered. Check back later..."* The stats shown at the top fall back to hardcoded mock values when the API fails:

```js
setData({
  totalViews: 1250,
  conversionRate: '12.4%',
  activeInterviews: 24
});
```

The page has **no charts, no job-level breakdown, no per-job views, no trend graphs** – all promised by the placeholder text.

**Fix needed:** Implement real chart visualizations (recharts is already a dependency), source data from actual API endpoints, remove mock fallback data.

---

### 9. "Message Candidate" button on Candidate Profile does nothing
**File:** `src/pages/recruiter/CandidateProfile.jsx` (lines 192–195)

```jsx
<Button className="w-full mb-3">
  <Mail className="w-4 h-4 mr-2" />
  Message Candidate
</Button>
```

No `onClick` handler. Clicking this button does absolutely nothing. There is no messaging system implemented anywhere in the frontend.

**Fix needed:** Either implement a messaging/contact modal (e.g., mailto: link, in-app chat, or a "send invite" email API), or clearly mark it as "Coming Soon" and disable the button.

---

### 10. Recruiter Applications page has no "Accept" status action
**File:** `src/pages/recruiter/Applications.jsx` (lines 172–179)

The application review cards only have two action buttons: **Reject** and **Interview**. There is no "Accept" or "Hire" button, leaving the application pipeline incomplete. Recruiters cannot mark candidates as accepted/hired.

```jsx
<Button size="sm" variant="outline" onClick={() => handleStatusChange(app._id, 'rejected')}>Reject</Button>
<Button size="sm" variant="primary" onClick={() => handleStatusChange(app._id, 'interviewing')}>Interview</Button>
{/* No Accept/Hire button */}
```

Additionally, there is no link or button to view the candidate's full profile from this page.

**Fix needed:** Add "Accept" button → status `accepted`, add "View Profile" link to `/recruiter/candidates/:id`.

---

### 11. SavedJobs page has no "Unsave / Remove" button
**File:** `src/pages/jobseeker/SavedJobs.jsx`

The page displays saved jobs using a `JobCard` component. There is no way to remove/unsave a job from this page. The only unsave capability is on the `JobDetails` page.

**Fix needed:** Pass an `onUnsave` prop or add a remove button overlay on each saved job card that calls `jobSeekerApi.unsaveJob(id)`.

---

### 12. FeaturedJobs "Apply Now" and "Details" buttons are inside a `<Link>` but do nothing independently
**File:** `src/components/landing/FeaturedJobs.jsx` (lines 92–93)

Both buttons are wrapped inside a `<Link to={/jobs/${job._id}}>`. Clicking either button navigates to the job details page (same outcome). The "Apply Now" button should open an auth-aware apply flow, not just navigate.

```jsx
<Button size="sm" variant="outline" className="w-full mr-2">Details</Button>
<Button size="sm" className="w-full ml-2">Apply Now</Button>
```

Neither button has an `onClick` or `e.stopPropagation()`. Both are dead buttons.

**Fix needed:** Move buttons outside the `Link`, add `e.stopPropagation()`, wire "Apply Now" to check auth and open apply modal, wire "Details" to navigate to job detail page.

---

## 🟠 HIGH – Incorrect Logic / Wrong Behavior

### 13. JobCard "Save" button has wrong role check – `candidate` instead of `jobseeker`
**File:** `src/components/jobs/JobCard.jsx` (line 78)

```js
if (user?.role !== 'candidate') return;
```

The app uses the role `jobseeker`, not `candidate`. This condition **always evaluates to true** (since the role is never `'candidate'`), meaning the save job API call is **never executed** for any user. Saving a job from the job listings page is silently broken.

**Fix needed:** Change `'candidate'` to `'jobseeker'`.

---

### 14. Login "Remember Me" checkbox is non-functional
**File:** `src/pages/public/Login.jsx` (lines 144–152)

The checkbox renders but its state is never tracked in component state or used in the login API call. Checking or unchecking it has no effect.

**Fix needed:** Add state tracking and persist the session/token differently based on the checkbox state (e.g., `sessionStorage` vs `localStorage`).

---

### 15. JobSeeker Dashboard displays `user?.firstName` but auth stores full name as `user.name`
**File:** `src/pages/jobseeker/Dashboard.jsx` (line 61)

```jsx
Welcome back, {user?.firstName}!
```

The auth store sets `user` from the login API response which uses the field `name` (not `firstName`). This greeting always renders blank.

**Fix needed:** Use `user?.name` or split `user.name` to get first name.

---

### 16. Recruiter Dashboard "New Candidates" stat is randomly generated Mock data
**File:** `src/pages/recruiter/Dashboard.jsx` (line 33)

```js
newCandidates: jobs.reduce((acc, job) => acc + (job.applicationCount ? Math.floor(Math.random() * 5) : 0), 0) // Mock new candidate count
```

The third stat card uses `Math.random()` to calculate "new candidates", meaning it shows a different value every render. This is nonsensical data in a production UI.

**Fix needed:** Remove this mock and either source real data from the API or remove the "New Candidates" stat card.

---

### 17. UserManagement page "Active Users" and "Inactive Users" counts only reflect current page, not total
**File:** `src/pages/admin/UserManagement.jsx` (lines 241–248)

```js
users.filter(u => u.isActive).length    // Only current page's 10 users
users.filter(u => !u.isActive).length   // Only current page's 10 users
```

The summary cards count users from the loaded page (max 10), not from the total user base. With 100+ users, these stats are always wrong.

**Fix needed:** Fetch aggregate stats from the API (active counts by role) rather than computing from the current page data.

---

### 18. ApplicationDetail "status" display is inconsistent – 'reviewing' is shown in progress bar but never set or shown in badge elsewhere
**File:** `src/pages/jobseeker/ApplicationDetail.jsx` (lines 32–55)

The progress bar flow includes `['applied', 'reviewing', 'interviewing', 'accepted']` but the status badge in `MyApplications.jsx` and the recruiter `Applications.jsx` only sets `rejected`, `accepted`, `interviewing`, and defaults to "Applied".  The `reviewing` status step in the visual pipeline will never activate.

**Fix needed:** Either remove `reviewing` from the pipeline or ensure the recruiter side can set it, and add the badge color for it in `MyApplications.jsx`.

---

### 19. Mobile Navbar always shows public nav links regardless of auth status
**File:** `src/components/layout/Navbar.jsx` (lines 177–191)

The mobile menu hardcodes `navLinks` (Browse Jobs, About, Contact) regardless of whether the user is authenticated or what role they have. Authenticated jobseekers/recruiters/admins see the wrong nav items on mobile.

```js
{navLinks.map((link) => (   // Always uses public navLinks!
```

**Fix needed:** Mirror the desktop logic that selects `links` based on `user?.role`.

---

## 🟡 MEDIUM – Missing Features & Shortcomings

### 20. No error state on MyApplications, SavedJobs, or JobSeeker Dashboard
**Files:**
- `src/pages/jobseeker/MyApplications.jsx`
- `src/pages/jobseeker/SavedJobs.jsx`
- `src/pages/jobseeker/Dashboard.jsx`

All three pages silently swallow errors (`console.error` only) with no user-facing error message or retry button. If the API is down or returns an error, the user sees a blank/empty state with no explanation.

**Fix needed:** Add an `error` state, display an error message with a retry button similar to what admin pages do.

---

### 21. No pagination or filtering on MyApplications page
**File:** `src/pages/jobseeker/MyApplications.jsx`

All applications are loaded in a single call with no pagination, no status filter, and no search. A user with 50+ applications has no way to find a specific one other than scrolling.

**Fix needed:** Add status filter tabs (Applied / Reviewing / Interviewing / Accepted / Rejected) and pagination, matching the backend's `getMyApplications` query params.

---

### 22. No loading skeleton / placeholder for the initial Dashboard data load
**Files:**
- `src/pages/jobseeker/Dashboard.jsx`
- `src/pages/recruiter/Dashboard.jsx`

During data fetch, both dashboards show a full-page spinner. Once loaded, content pops in suddenly. There are no skeleton loading states for the stat cards or the recent list items.

**Fix needed:** Add skeleton placeholders for stat cards and list items.

---

### 23. Recruiter Settings has only one toggle ("Daily Digest"), and `Change Password` is a dead button
**File:** `src/pages/recruiter/Settings.jsx`

- Only one notification preference visible (Daily Digest).
- "Change Password" button: `<button type="button">` with no handler, does nothing.
- No connected API call on form submit (calls `toast.success` only).
- Title says "System Settings" but it's a recruiter page.

**Fix needed:** Implement full settings, connect to API, rename title, build change-password flow.

---

### 24. Admin Settings page is identical to Recruiter Settings page
**Files:**
- `src/pages/admin/Settings.jsx`
- `src/pages/recruiter/Settings.jsx`

Both files are byte-for-byte identical. The admin settings page has no admin-specific options: no platform configuration, no user registration toggle, no moderation settings, nothing that would be expected of a system admin settings page.

**Fix needed:** Build out a real admin settings page with platform-level controls.

---

### 25. Profile greetings use wrong or undefined fields depending on role
**Files:**
- `src/pages/jobseeker/Dashboard.jsx` – uses `user.firstName` (undefined)
- `src/pages/admin/Dashboard.jsx` – uses `user?.name || 'Admin'` (correct)
- `src/pages/recruiter/Dashboard.jsx` – shows "Recruiter Overview" generic title only

The inconsistency means jobseeker sees "Welcome back, !" while admin sees the correct greeting.

---

### 26. FeaturedJobs company logo uses wrong field path
**File:** `src/components/landing/FeaturedJobs.jsx` (lines 63–72)

```js
job.company?.name?.charAt(0) || 'C'
```

The API populates `job.companyId` (not `job.company`), so the company name and logo placeholder always show `'C'` and the full company name shows as `'Confidential'`. The `JobCard` component already handles this correctly with `job.companyId || job.company` fallback – `FeaturedJobs` does not.

**Fix needed:** Use `job.companyId?.companyName || job.company?.name || 'Confidential'`.

---

### 27. Recruiter Applications page – no search or filter by candidate name or status
**File:** `src/pages/recruiter/Applications.jsx`

The applications list for a given job has no search, no status filter, and no sort. If a job receives 100+ applications there is no way to narrow them down.

**Fix needed:** Add search by applicant name and filter by status (applied / reviewing / interviewing / accepted / rejected).

---

### 28. JobDetails page has a CSS typo that breaks layout
**File:** `src/pages/public/JobDetails.jsx` (line 188)

```jsx
<div className="text-sm text-gray-500 flexitems-center gap-2">
```

`flexitems-center` should be `flex items-center`. The "Posted" date/clock icon row is broken on the details page header area.

**Fix needed:** Fix to `flex items-center`.

---

### 29. JobDetails page – "Share" button icon imported but never rendered
**File:** `src/pages/public/JobDetails.jsx` (line 7)

`Share2` is imported from `lucide-react` but never used anywhere in the component. There is no share functionality on the job detail page despite the import suggesting it was planned.

**Fix needed:** Implement a share button (copy link to clipboard or native share API) or remove the import.

---

### 30. ApplicationDetail page – no error state when application not found
**File:** `src/pages/jobseeker/ApplicationDetail.jsx` (line 79)

```jsx
if (!application) return <div className="text-center py-20">Application not found</div>;
```

This renders plain unstyled text with no button to go back or navigate elsewhere. The user is stuck.

**Fix needed:** Render a proper empty/error state with a "Back to Applications" button.

---

### 31. JobCard "Save" button does not show saved state
**File:** `src/components/jobs/JobCard.jsx`

The card's save button never reflects whether a job is already saved. Clicking it multiple times will attempt to save the same job repeatedly. Unlike `JobDetails.jsx` which checks `checkIfSaved()` on mount, `JobCard` has no such check, leading to duplicate save calls and no visual toggle.

**Fix needed:** Accept an `isSaved` prop from the parent (e.g., `SavedJobs` page or `JobListings`), display filled bookmark when saved, and toggle between save/unsave.

---

### 32. Notification Bell icon in Navbar is imported but never rendered
**File:** `src/components/layout/Navbar.jsx` (line 3)

`Bell` is imported from `lucide-react` but the notification bell is never rendered in the navbar. There is a comment in the authenticated section where it was presumably planned.

**Fix needed:** Either implement a notifications dropdown or remove the import.

---

### 33. Testimonials on Landing Page use hardcoded static data (not real reviews)
**File:** `src/components/landing/Testimonials.jsx`

The testimonial section renders hardcoded static data with fake names and reviews. There is no API connection or any mechanism to surface real user testimonials.

**Note:** This is acceptable for a landing page MVP, but should be flagged for replacement with real data in production.

---

### 34. Statistics section on Landing Page shows hardcoded numbers
**File:** `src/components/landing/Statistics.jsx`

The statistics (e.g., "10,000+ jobs", "5,000+ companies") are hardcoded strings that don't reflect actual platform data. If the platform scales or has fewer users, these numbers are misleading.

**Fix needed:** Connect to the admin analytics API to show real platform stats, or clearly label these as "Goals" / "Milestones".

---

### 35. Hero badge "10,000+ Jobs Posted This Month" is static placeholder text
**File:** `src/components/landing/Hero.jsx` (line 58)

```jsx
<span className="text-sm font-medium">10,000+ Jobs Posted This Month</span>
```

This is hardcoded text. On an early-stage or small platform it is factually wrong and misleading.

**Fix needed:** Fetch and display real job count from the public API, or remove the badge.

---

## 🟡 MEDIUM – Route / Access Control Issues

### 36. `/jobs` and `/jobs/:id` are accessible to all roles including recruiters/admins
**File:** `src/routes/AppRoutes.jsx` (lines 91–92)

Job browsing routes are public and unprotected. Recruiters who land on `/jobs/:id` see "Apply Now" and "Save" buttons but clicking Apply fires a role check (`user.role !== 'jobseeker'`). However, a recruiter can click "Save Job" through `JobCard` since the role guard there is checking for `'candidate'` (wrong – see Issue #13), meaning recruiter users might accidentally save jobs.

---

### 37. No redirect from `/login` or `/register` for already-authenticated users
**File:** `src/routes/AppRoutes.jsx` (lines 83–84)

```jsx
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

An already-logged-in user can navigate directly to `/login` or `/register` and will see those pages normally. Only the root `/` route has a redirect for authenticated users. This is inconsistent.

**Fix needed:** Wrap `/login` and `/register` routes with a guard that redirects authenticated users to their dashboard.

---

## 📋 SUMMARY TABLE

| # | Page/Component | Issue | Severity |
|---|---|---|---|
| 1 | `Navbar.jsx` | About/Contact links → `/pagenotfound` | 🔴 Critical |
| 2 | `Navbar.jsx` | Profile/Settings dropdown → `#` (dead) | 🔴 Critical |
| 3 | `Admin/Dashboard.jsx` | Quick actions use wrong route + `window.location.href` | 🔴 Critical |
| 4 | `Register.jsx` | Terms/Privacy links → 404 | 🔴 Critical |
| 5 | `RecruiterVerification.jsx` | "Visit Profile" → non-existent route | 🔴 Critical |
| 6 | `JobCard.jsx` | "Company" button → 404 route | 🔴 Critical |
| 7 | `Settings.jsx` (all 3) | Entirely non-functional stub pages | 🔴 Critical |
| 8 | `recruiter/Analytics.jsx` | Placeholder charts + mocked fallback stats | 🔴 Critical |
| 9 | `CandidateProfile.jsx` | "Message Candidate" button does nothing | 🔴 Critical |
| 10 | `recruiter/Applications.jsx` | No "Accept" status button; no profile link | 🔴 Critical |
| 11 | `SavedJobs.jsx` | No way to unsave a job | 🔴 Critical |
| 12 | `FeaturedJobs.jsx` | Apply/Details buttons wrapped in Link, non-functional | 🔴 Critical |
| 13 | `JobCard.jsx` | Save button role check uses `'candidate'` not `'jobseeker'` | 🟠 High |
| 14 | `Login.jsx` | "Remember Me" checkbox does nothing | 🟠 High |
| 15 | `jobseeker/Dashboard.jsx` | `user.firstName` is undefined (should be `user.name`) | 🟠 High |
| 16 | `recruiter/Dashboard.jsx` | "New Candidates" stat uses `Math.random()` | 🟠 High |
| 17 | `UserManagement.jsx` | Active/Inactive counts only reflect current page | 🟠 High |
| 18 | `ApplicationDetail.jsx` | `reviewing` status in pipeline never set or shown | 🟠 High |
| 19 | `Navbar.jsx` (mobile) | Mobile menu always shows public links ignoring auth | 🟠 High |
| 20 | Multiple jobseeker pages | Silent error swallowing, no user-visible error state | 🟡 Medium |
| 21 | `MyApplications.jsx` | No pagination or status filter | 🟡 Medium |
| 22 | Dashboards | No skeleton loading states | 🟡 Medium |
| 23 | `recruiter/Settings.jsx` | Minimal options, dead "Change Password" button, no API | 🟡 Medium |
| 24 | `admin/Settings.jsx` | Identical to recruiter settings, no admin-specific controls | 🟡 Medium |
| 25 | Dashboard pages | Inconsistent greeting field usage across roles | 🟡 Medium |
| 26 | `FeaturedJobs.jsx` | Company name/logo uses wrong field (`company` vs `companyId`) | 🟡 Medium |
| 27 | `recruiter/Applications.jsx` | No search or status filter for applications | 🟡 Medium |
| 28 | `JobDetails.jsx` | CSS typo `flexitems-center` breaks layout | 🟡 Medium |
| 29 | `JobDetails.jsx` | `Share2` icon imported but share feature never built | 🟡 Medium |
| 30 | `ApplicationDetail.jsx` | "Not found" state has no navigation/back button | 🟡 Medium |
| 31 | `JobCard.jsx` | Save button doesn't reflect saved state; duplicate saves | 🟡 Medium |
| 32 | `Navbar.jsx` | `Bell` imported but notification system never rendered | 🟡 Medium |
| 33 | `Testimonials.jsx` | Hardcoded fake testimonial data | 🟡 Medium |
| 34 | `Statistics.jsx` | Hardcoded static numbers (not real API data) | 🟡 Medium |
| 35 | `Hero.jsx` | Hardcoded "10,000+ Jobs" badge – factually inaccurate | 🟡 Medium |
| 36 | `AppRoutes.jsx` | `/jobs` accessible to recruiters, role checks inconsistent | 🟡 Medium |
| 37 | `AppRoutes.jsx` | `/login` and `/register` don't redirect authenticated users | 🟡 Medium |
