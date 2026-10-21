/**
 * Private Career & KTP Opportunity Radar
 * Client-Side Engine for Noah Useghan
 * Handles dynamic job listing, search/filter, application status tracking (localStorage),
 * and dynamic tailored pitch generation for KTP & Backend roles.
 */

(function () {
  'use strict';

  // Candidate context for tailored pitch generation
  const CANDIDATE = {
    name: "Noah Useghan",
    title: "Backend & Distributed Systems Engineer",
    email: "noahuseghan@gmail.com",
    portfolio: "https://unique-red.github.io",
    linkedin: "https://www.linkedin.com/in/noah-useghan-147814234/",
    github: "https://github.com/Unique-Red",
    publication: "The Role Of Artificial Intelligence In Managing Handwriting And Spelling Difficulties Among University Students With Perceived Specific Learning Disabilities (Jan 2026)",
    experienceYears: "4+",
    coreStack: "Python (FastAPI, Flask, Django), Rust, Golang, PostgreSQL, Redis, Docker, AWS, Distributed Architecture",
    leadership: "Speaker & Panel Host at Flaskcon Africa, Member of Google Developer Group (GDG) Lagos"
  };

  // State
  let jobsData = [];
  let currentCategory = 'all';
  let currentStatusFilter = 'all';
  let searchQuery = '';

  // DOM Elements
  const jobsGrid = document.getElementById('radar-jobs-grid');
  const emptyState = document.getElementById('radar-empty-state');
  const searchInput = document.getElementById('radar-search-input');
  const statusFilterSelect = document.getElementById('radar-status-filter');
  const filterTabs = document.querySelectorAll('.radar-tab-btn');
  const totalCountEl = document.getElementById('radar-total-count');
  const lastUpdatedEl = document.getElementById('radar-last-updated');

  // Pitch Modal Elements
  const modal = document.getElementById('pitch-modal');
  const modalJobTitle = document.getElementById('modal-job-title');
  const modalJobOrg = document.getElementById('modal-job-org');
  const modalJobType = document.getElementById('modal-job-type');
  const pitchTextarea = document.getElementById('pitch-textarea');
  const copyPitchBtn = document.getElementById('btn-copy-pitch');
  const modalApplyBtn = document.getElementById('modal-apply-link');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Fallback data in case opened locally via file:// (CORS)
  const FALLBACK_JOBS = [
    {
      id: "ktp-41cf613901",
      title: "ML/AI Computer Vision Engineer (KTP Associate)",
      category: "KTP Associates",
      organization: "University of Portsmouth",
      location: "United Kingdom, UK (Hybrid/Onsite)",
      salary: "£34,000 - £42,000 + £4k Personal Training Budget",
      deadline: "Rolling / 3-4 Weeks",
      summary: "Innovative KTP Associate opportunity bridging academic research with commercial delivery. Includes a dedicated £4,000 personal development and training budget.",
      apply_url: "https://iuk-ktp.org.uk/job/ml-ai-computer-vision-engineer-ktp-associate/",
      match_score: 99,
      tags: ["KTP Associate", "Innovate UK", "UK University", "Research & Development", "Tech Bridge"],
      source: "Innovate UK KTP Portal"
    },
    {
      id: "ktp-5da54e0b80",
      title: "Artificial Intelligence & Machine Learning Engineer (KTP Associate)",
      category: "KTP Associates",
      organization: "University of Salford",
      location: "United Kingdom, UK (Hybrid/Onsite)",
      salary: "£34,000 - £42,000 + £4k Personal Training Budget",
      deadline: "Rolling / 3-4 Weeks",
      summary: "Innovative KTP Associate opportunity bridging academic research with commercial delivery. Includes a dedicated £4,000 personal development and training budget.",
      apply_url: "https://iuk-ktp.org.uk/job/artificial-intelligence-machine-learning-engineer-ktp-associate/",
      match_score: 98,
      tags: ["KTP Associate", "Innovate UK", "UK University", "Research & Development", "Tech Bridge"],
      source: "Innovate UK KTP Portal"
    },
    {
      id: "uk-remote-01",
      title: "Senior Backend Engineer (Python / Cloud)",
      category: "UK Remote Backend",
      organization: "Leading UK HealthTech / FinTech Partner",
      location: "United Kingdom (100% Remote)",
      salary: "£65,000 - £80,000",
      deadline: "Active",
      summary: "Architecting high-throughput microservices, data pipelines, and telemetry systems. Requires solid PostgreSQL, FastAPI/Flask, Docker, and distributed event-driven systems.",
      apply_url: "https://www.linkedin.com/jobs/",
      match_score: 96,
      tags: ["Python", "FastAPI", "PostgreSQL", "Docker", "UK Remote"],
      source: "Curated Remote Feeds"
    },
    {
      id: "global-remote-01",
      title: "Distributed Systems / Backend Engineer (Rust & Golang)",
      category: "Global Remote",
      organization: "Global Infrastructure & Web3 Lab",
      location: "Global Remote (Anywhere)",
      salary: "$90,000 - $125,000 USD",
      deadline: "Rolling",
      summary: "Developing mission-critical backend protocols, low-latency APIs, and scalable network services. Seeking hands-on experience in concurrency, telemetry, and resilient microservices.",
      apply_url: "https://wellfound.com/jobs",
      match_score: 95,
      tags: ["Rust", "Golang", "Microservices", "Global Remote"],
      source: "Curated Remote Feeds"
    }
  ];

  // Initialize
  async function init() {
    setupEventListeners();
    await loadJobsData();
    renderJobs();
    updateCategoryCounts();
  }

  // Load jobs from data/jobs.json
  async function loadJobsData() {
    try {
      const response = await fetch('data/jobs.json');
      if (!response.ok) throw new Error('HTTP status ' + response.status);
      const data = await response.json();
      jobsData = data.jobs || [];
      if (data.metadata && data.metadata.last_updated && lastUpdatedEl) {
        const dateObj = new Date(data.metadata.last_updated);
        lastUpdatedEl.textContent = dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch (err) {
      console.warn('Could not load data/jobs.json directly (likely local file:// protocol), using built-in cache:', err);
      jobsData = FALLBACK_JOBS;
      if (lastUpdatedEl) {
        lastUpdatedEl.textContent = 'Oct 2026 (Local Cache)';
      }
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Category tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category || 'all';
        renderJobs();
      });
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderJobs();
      });
    }

    // Status filter
    if (statusFilterSelect) {
      statusFilterSelect.addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        renderJobs();
      });
    }

    // Modal close
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Copy pitch button
    if (copyPitchBtn) {
      copyPitchBtn.addEventListener('click', copyPitchToClipboard);
    }
  }

  // Filter jobs based on active filters
  function getFilteredJobs() {
    return jobsData.filter(job => {
      // Category match
      const matchesCategory = (currentCategory === 'all') ||
        (currentCategory === 'ktp' && (job.category.includes('KTP') || job.title.includes('KTP'))) ||
        (currentCategory === 'uk-remote' && (job.category.includes('UK') || job.location.includes('United Kingdom') || job.location.includes('UK'))) ||
        (currentCategory === 'global-remote' && (job.category.includes('Global') || job.location.includes('Global'))) ||
        (currentCategory === 'linkedin' && ((job.source && job.source.includes('LinkedIn')) || job.category.includes('LinkedIn') || (job.tags && job.tags.includes('LinkedIn'))));

      // Search match
      const query = searchQuery;
      const matchesSearch = !query ||
        job.title.toLowerCase().includes(query) ||
        job.organization.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.summary.toLowerCase().includes(query) ||
        (job.tags && job.tags.some(t => t.toLowerCase().includes(query)));

      // Status match (from localStorage)
      const savedStatus = getJobStatus(job.id);
      const matchesStatus = (currentStatusFilter === 'all') || (savedStatus === currentStatusFilter);

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }

  // Render jobs into grid
  function renderJobs() {
    if (!jobsGrid) return;

    const filtered = getFilteredJobs();

    if (totalCountEl) {
      totalCountEl.textContent = `${filtered.length} Opportunities`;
    }

    if (filtered.length === 0) {
      jobsGrid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    jobsGrid.innerHTML = filtered.map(job => {
      const status = getJobStatus(job.id);
      const isKtp = job.category.includes('KTP') || job.title.includes('KTP');
      const isLinkedIn = (job.source && job.source.includes('LinkedIn')) || job.category.includes('LinkedIn');
      const catClass = isKtp ? 'cat-ktp' : (isLinkedIn ? 'cat-linkedin' : 'cat-remote');
      const catIcon = isKtp ? 'fa-graduation-cap' : (isLinkedIn ? 'fa-brands fa-linkedin' : 'fa-network-wired');
      const matchScore = job.match_score || 95;
      const matchClass = matchScore >= 95 ? 'match-high' : 'match-med';

      const tagsHtml = (job.tags || []).slice(0, 4).map(tag =>
        `<span class="radar-tag">${escapeHtml(tag)}</span>`
      ).join('');

      return `
        <div class="radar-job-card" data-job-id="${job.id}">
          <div class="radar-card-top">
            <span class="radar-category-pill ${catClass}">
              <i class="fas ${catIcon}"></i> ${escapeHtml(job.category)}
            </span>
            <span class="radar-match-badge ${matchClass}" title="Match based on Noah's backend systems & AI research background">
              <span class="match-pulse"></span> ${matchScore}% Match
            </span>
          </div>

          <h3 class="radar-card-title">${escapeHtml(job.title)}</h3>

          <div class="radar-card-meta">
            <div class="meta-item org-name">
              <i class="fas fa-building"></i>
              <strong>${escapeHtml(job.organization)}</strong>
            </div>
            <div class="meta-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${escapeHtml(job.location)}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-money-bill-wave"></i>
              <span>${escapeHtml(job.salary || 'Competitive')}</span>
            </div>
          </div>

          <p class="radar-card-summary">${escapeHtml(job.summary)}</p>

          <div class="radar-tags-list">
            ${tagsHtml}
          </div>

          <div class="radar-card-actions">
            <select class="status-tracker-select" data-job-id="${job.id}" aria-label="Tracking Status">
              <option value="none" ${status === 'none' ? 'selected' : ''}>Track Status...</option>
              <option value="saved" ${status === 'saved' ? 'selected' : ''}>⭐ Saved</option>
              <option value="applied" ${status === 'applied' ? 'selected' : ''}>📬 Applied</option>
              <option value="interviewing" ${status === 'interviewing' ? 'selected' : ''}>🎯 Interviewing</option>
              <option value="passed" ${status === 'passed' ? 'selected' : ''}>✕ Passed</option>
            </select>

            <button type="button" class="btn-primary btn-open-pitch" data-job-id="${job.id}">
              <i class="fas fa-magic"></i> Tailor Pitch
            </button>

            <a href="${job.apply_url}" target="_blank" rel="noopener noreferrer" class="btn-secondary radar-apply-btn">
              Apply <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');

    // Attach card event listeners
    attachCardListeners();
  }

  // Attach card event listeners
  function attachCardListeners() {
    // Status selectors
    document.querySelectorAll('.status-tracker-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const jobId = e.target.dataset.jobId;
        const newStatus = e.target.value;
        setJobStatus(jobId, newStatus);

        // Visual indicator
        const card = e.target.closest('.radar-job-card');
        if (card) {
          card.style.borderColor = newStatus === 'applied' ? '#00ff9d' :
            newStatus === 'interviewing' ? '#ffd166' :
              newStatus === 'saved' ? '#00f0ff' : 'var(--border-cyber)';
        }
      });
    });

    // Pitch generator buttons
    document.querySelectorAll('.btn-open-pitch').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobId = btn.dataset.jobId;
        const job = jobsData.find(j => j.id === jobId);
        if (job) openPitchModal(job);
      });
    });
  }

  // Update counts in tabs
  function updateCategoryCounts() {
    const total = jobsData.length;
    const ktpCount = jobsData.filter(j => j.category.includes('KTP') || j.title.includes('KTP')).length;
    const ukRemoteCount = jobsData.filter(j => j.category.includes('UK') || j.location.includes('United Kingdom') || j.location.includes('UK')).length;
    const globalCount = jobsData.filter(j => j.category.includes('Global') || j.location.includes('Global')).length;
    const linkedinCount = jobsData.filter(j => (j.source && j.source.includes('LinkedIn')) || j.category.includes('LinkedIn') || (j.tags && j.tags.includes('LinkedIn'))).length;

    const countAllEl = document.getElementById('count-all');
    const countKtpEl = document.getElementById('count-ktp');
    const countUkEl = document.getElementById('count-uk-remote');
    const countGlobalEl = document.getElementById('count-global-remote');
    const countLinkedInEl = document.getElementById('count-linkedin');

    if (countAllEl) countAllEl.textContent = total;
    if (countKtpEl) countKtpEl.textContent = ktpCount;
    if (countUkEl) countUkEl.textContent = ukRemoteCount;
    if (countGlobalEl) countGlobalEl.textContent = globalCount;
    if (countLinkedInEl) countLinkedInEl.textContent = linkedinCount;
  }

  // LocalStorage Helpers
  function getJobStatus(jobId) {
    try {
      return localStorage.getItem('noah_job_status_' + jobId) || 'none';
    } catch (e) {
      return 'none';
    }
  }

  function setJobStatus(jobId, status) {
    try {
      if (status === 'none') {
        localStorage.removeItem('noah_job_status_' + jobId);
      } else {
        localStorage.setItem('noah_job_status_' + jobId, status);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Open Tailored Pitch Modal
  function openPitchModal(job) {
    if (!modal) return;

    if (modalJobTitle) modalJobTitle.textContent = job.title;
    if (modalJobOrg) modalJobOrg.textContent = `${job.organization} · ${job.location}`;
    if (modalJobType) modalJobType.textContent = job.category;
    if (modalApplyBtn) modalApplyBtn.href = job.apply_url;

    // Generate Tailored Personal Statement
    const pitch = generateTailoredStatement(job);
    if (pitchTextarea) pitchTextarea.value = pitch;

    // Reset copy button state
    resetCopyButton();

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Context-Aware Personal Statement Generator
  function generateTailoredStatement(job) {
    const isKtp = job.category.includes('KTP') || job.title.includes('KTP');

    if (isKtp) {
      return `Dear Selection Committee and Academic/Commercial Supervisors at ${job.organization},

I am writing to express my strong enthusiasm for the ${job.title} position (Innovate UK Knowledge Transfer Partnership). With over 4 years of experience architecting resilient distributed systems and having co-authored peer-reviewed research in applied Artificial Intelligence ("The Role Of Artificial Intelligence In Managing Handwriting And Spelling Difficulties Among University Students With Perceived Specific Learning Disabilities", Jan 2026), I offer a unique combination of academic rigor and production-grade engineering excellence.

As an engineer who has spearheaded end-to-end backend architectures for mission-critical platforms—such as Alerte Universal (emergency response) and Agoldresourcing—I have demonstrated the ability to translate complex conceptual research into high-availability, scalable software solutions. My core technical expertise spans Python (FastAPI/Flask), Rust, Golang, PostgreSQL, and event-driven cloud telemetry, adhering to robust software design principles.

What excites me most about this KTP Associate role with ${job.organization} is the direct mandate to bridge academic research with tangible commercial and societal impact. Furthermore, as an active contributor to the wider technical ecosystem—regularly hosting panel sessions at Flaskcon Africa and participating in Google Developer Group initiatives—I am deeply committed to cross-disciplinary knowledge exchange and continuous professional growth.

I look forward to discussing how my technical background, research mindset, and proactive delivery can drive measurable success for this project and the partnering enterprise.

Sincerely,
${CANDIDATE.name}
Backend & Distributed Systems Engineer | AI Research Co-Author
Email: ${CANDIDATE.email}
Portfolio: ${CANDIDATE.portfolio}
LinkedIn: ${CANDIDATE.linkedin}
GitHub: ${CANDIDATE.github}`;
    }

    // Standard Backend / Distributed Systems Pitch
    return `Hi Hiring Team at ${job.organization},

I am excited to submit my application for the ${job.title} opening. 

With 4+ years of experience engineering high-throughput backend services and distributed systems, I specialize in building fault-tolerant, scalable architectures using Python (FastAPI, Flask, Django), Rust, Golang, PostgreSQL, and cloud-native infrastructure.

In my recent roles as Lead Backend Developer for Alerte Universal and Software Engineer for UK-based teams at Agoldresourcing and VitalinkPlus:
• I architected scalable microservices and real-time streaming architectures supporting high-concurrency environments.
• Optimized complex query performance and database indexing, reducing latency and operational overhead.
• Maintained rigorous standards for automated testing, CI/CD pipeline reliability, and structured telemetry.

Additionally, my background as a co-author of peer-reviewed artificial intelligence research (Jan 2026) and active panel host for Flaskcon Africa reflects my commitment to deep technical excellence and proactive team communication.

I would welcome the opportunity to connect and discuss how my hands-on backend expertise can accelerate your engineering roadmaps at ${job.organization}.

Best regards,
${CANDIDATE.name}
Email: ${CANDIDATE.email}
Portfolio: ${CANDIDATE.portfolio}
LinkedIn: ${CANDIDATE.linkedin}
GitHub: ${CANDIDATE.github}`;
  }

  // Clipboard Copy
  async function copyPitchToClipboard() {
    if (!pitchTextarea || !copyPitchBtn) return;

    try {
      await navigator.clipboard.writeText(pitchTextarea.value);
      copyPitchBtn.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard!';
      copyPitchBtn.classList.add('btn-copied');
      setTimeout(resetCopyButton, 3000);
    } catch (err) {
      // Fallback
      pitchTextarea.select();
      document.execCommand('copy');
      copyPitchBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyPitchBtn.classList.add('btn-copied');
      setTimeout(resetCopyButton, 3000);
    }
  }

  function resetCopyButton() {
    if (!copyPitchBtn) return;
    copyPitchBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Tailored Pitch';
    copyPitchBtn.classList.remove('btn-copied');
  }

  // Simple HTML Escaping
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
