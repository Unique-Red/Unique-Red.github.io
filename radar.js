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
      const cat = (job.category || '').toLowerCase();
      const loc = (job.location || '').toLowerCase();
      const title = (job.title || '').toLowerCase();
      const tags = (job.tags || []).map(t => t.toLowerCase());

      const matchesCategory = (currentCategory === 'all') ||
        (currentCategory === 'ktp' && (cat.includes('ktp') || title.includes('ktp'))) ||
        (currentCategory === 'uk-remote' && (cat.includes('uk') || loc.includes('uk') || loc.includes('united kingdom') || loc.includes('london'))) ||
        (currentCategory === 'ng-roles' && (cat.includes('nigeria') || loc.includes('nigeria') || loc.includes('lagos') || loc.includes('🇳🇬'))) ||
        (currentCategory === 'visa-sponsored' && (cat.includes('visa') || title.includes('visa') || loc.includes('visa') || tags.some(t => t.includes('visa')))) ||
        (currentCategory === 'global-remote' && (cat.includes('remote') || cat.includes('global') || loc.includes('worldwide') || loc.includes('remote') || loc.includes('everywhere')));

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
      const isNg = job.category.includes('Nigeria') || job.location.includes('Nigeria') || job.location.includes('🇳🇬');
      const isVisa = job.category.includes('Visa') || job.title.toLowerCase().includes('visa') || (job.tags && job.tags.some(t => t.toLowerCase().includes('visa')));
      const isUk = !isKtp && !isNg && !isVisa && (job.category.includes('UK') || job.location.includes('🇬🇧') || job.location.includes('United Kingdom'));

      const catClass = isKtp ? 'cat-ktp' : (isNg ? 'cat-ng' : (isVisa ? 'cat-visa' : (isUk ? 'cat-uk' : 'cat-remote')));
      const catIcon = isKtp ? 'fa-graduation-cap' : (isNg ? 'fa-globe-africa' : (isVisa ? 'fa-plane-departure' : (isUk ? 'fa-flag' : 'fa-network-wired')));
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
    const ktpCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const t = (j.title || '').toLowerCase();
      return c.includes('ktp') || t.includes('ktp');
    }).length;
    const ukCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const l = (j.location || '').toLowerCase();
      return c.includes('uk') || l.includes('uk') || l.includes('united kingdom') || l.includes('london');
    }).length;
    const ngCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const l = (j.location || '').toLowerCase();
      return c.includes('nigeria') || l.includes('nigeria') || l.includes('lagos') || l.includes('🇳🇬');
    }).length;
    const visaCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const t = (j.title || '').toLowerCase();
      const tags = (j.tags || []).map(x => x.toLowerCase());
      return c.includes('visa') || t.includes('visa') || tags.some(x => x.includes('visa'));
    }).length;
    const globalCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const l = (j.location || '').toLowerCase();
      return c.includes('remote') || c.includes('global') || l.includes('worldwide') || l.includes('remote') || l.includes('everywhere');
    }).length;

    const countAllEl = document.getElementById('count-all');
    const countKtpEl = document.getElementById('count-ktp');
    const countUkEl = document.getElementById('count-uk-remote');
    const countNgEl = document.getElementById('count-ng-roles');
    const countVisaEl = document.getElementById('count-visa-sponsored');
    const countGlobalEl = document.getElementById('count-global-remote');

    if (countAllEl) countAllEl.textContent = total;
    if (countKtpEl) countKtpEl.textContent = ktpCount;
    if (countUkEl) countUkEl.textContent = ukCount;
    if (countNgEl) countNgEl.textContent = ngCount;
    if (countVisaEl) countVisaEl.textContent = visaCount;
    if (countGlobalEl) countGlobalEl.textContent = globalCount;
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

  // Context-Aware Storytelling Cover Letter Generator (Why Company, Why Me, Proof Points, Challenge Offer)
  function generateTailoredStatement(job) {
    const isKtp = (job.category || '').includes('KTP') || (job.title || '').includes('KTP');
    const isNg = (job.category || '').includes('Nigeria') || (job.location || '').includes('Nigeria') || (job.location || '').includes('🇳🇬');

    if (isKtp) {
      return `Dear Selection Committee and Supervisors at ${job.organization},

I'd love to serve as the KTP Associate for ${job.organization}.

Why ${job.organization}? The mandate of Knowledge Transfer Partnerships—translating frontier academic research into tangible commercial impact—deeply aligns with my background. Looking at the objectives for the ${job.title} role, your team is tackling high-impact technical challenges bridging university research with commercial delivery. I love the mission driving this partnership and I believe I can contribute my skills to the continued success and execution of this project.

Why me? I am a Software & Backend Systems Engineer with 4+ years of experience and a published researcher who loves learning, architecting, and building resilient platforms from the ground up. Having co-authored peer-reviewed applied AI research while engineering high-availability production platforms, I offer a unique combination of academic rigor and production velocity:
• Alerte Universal (Safety & Emergency Response Platform): Architected high-availability backend microservices and engineered a real-time geospatial bounding-box notification engine ensuring rapid, mission-critical delivery.
• Agoldresourcing: Engineered the ECS Time Spine on AWS for canonical cloud reconciliation, cutting API response times by 30% and eliminating ledger sync discrepancies.
• VitalinkPlus (Smart Health Assistant): Built fractional backend services for biometric telemetry ingestion, data pipelines, and streaming infrastructure maintaining 99.9% uptime.
• AI Academic Research Publication (Jan 2026): Co-authored peer-reviewed research on "The Role Of Artificial Intelligence In Managing Handwriting And Spelling Difficulties Among University Students With Perceived Specific Learning Disabilities", indexed on ResearchGate and Zenodo/CERN.
• Leadership & Community: Hosted panel sessions at Flaskcon Africa featuring 4 tech leaders; active contributor and speaker at Google Developer Group (GDG) Lagos.
• Production Core Stack: Python (FastAPI, Flask, Django), Rust, Golang, PostgreSQL, Redis, Docker, and distributed event-driven systems.

Am I fit for this? I believe I am. I'm passionate about high-impact engineering and cross-disciplinary knowledge exchange. I bring both the academic discipline required for UKRI reporting and the production velocity needed by enterprise partners. I'd love you to take a chance on me. I'm confident about this role.

Do you think I am fit? If you aren't yet convinced, you can assess my skills with a task. I could provide a technical research breakdown, complete a system architecture design challenge, or build a proof-of-concept prototype leveraging your partnership goals.

Looking forward to hearing more about this opportunity.

Sincerely,
${CANDIDATE.name}
Backend & Distributed Systems Engineer | AI Research Co-Author
Email: ${CANDIDATE.email}
Portfolio: ${CANDIDATE.portfolio}
LinkedIn: ${CANDIDATE.linkedin}
GitHub: ${CANDIDATE.github}`;
    }

    if (isNg) {
      return `Dear Hiring Manager at ${job.organization},

I'd love to work for ${job.organization}.

Why ${job.organization}? I love working on products that contribute to the growth and digital empowerment of businesses across Nigeria and emerging markets. Looking at the work your engineering team is doing on ${job.title}, your team is solving interesting, high-scale problems in the tech space. I love the purpose that drives ${job.organization} and I believe I can contribute my skills to the continued success and scale of the product.

Why me? I'm currently a Software & Backend Systems Engineer with 4+ years of experience who loves learning, architecting, and building high-throughput web platforms and APIs. I believe you'd want to consider my application with my achievements below:
• Alerte Universal (Safety & Emergency Response Platform): Architected high-availability backend microservices and engineered a real-time geospatial bounding-box notification engine ensuring rapid, mission-critical delivery.
• Agoldresourcing: Engineered the ECS Time Spine on AWS for canonical cloud reconciliation, cutting API response times by 30% and eliminating ledger sync discrepancies.
• VitalinkPlus (Smart Health Assistant): Built fractional backend services for biometric telemetry ingestion, data pipelines, and streaming infrastructure maintaining 99.9% uptime.
• AI Academic Research Publication (Jan 2026): Co-authored peer-reviewed research on "The Role Of Artificial Intelligence In Managing Handwriting And Spelling Difficulties Among University Students With Perceived Specific Learning Disabilities", indexed on ResearchGate and Zenodo/CERN.
• Leadership & Community: Hosted panel sessions at Flaskcon Africa featuring 4 tech leaders; active contributor and speaker at Google Developer Group (GDG) Lagos.
• Production Core Stack: Python (FastAPI, Flask, Django), Rust, Golang, PostgreSQL, Redis, Docker, and distributed event-driven systems.

Am I fit for this? I believe I am. I'm passionate about engineering excellence and community. The major reason I love building is that I want to create systems that simplify operations, handle high concurrency without downtime, and empower thousands of users reliably. I'd love you to take a chance on me. I'm confident about this role.

Do you think I am fit? If you aren't yet convinced, you can assess my skills with a task. I could complete a technical take-home task, build an architectural proof of concept, or solve a system design challenge leveraging your product.

Looking forward to hearing more about this opportunity.

Sincerely,
${CANDIDATE.name}
Backend & Distributed Systems Engineer | AI Research Co-Author
Email: ${CANDIDATE.email}
Portfolio: ${CANDIDATE.portfolio}
LinkedIn: ${CANDIDATE.linkedin}
GitHub: ${CANDIDATE.github}`;
    }

    // Default: UK Tech & Remote / Visa Sponsored / Remote Worldwide
    return `Dear Hiring Manager at ${job.organization},

I'd love to work for ${job.organization}.

Why ${job.organization}? I love working on products that contribute to the growth of other businesses and solve complex, high-impact problems. Looking at the work your team is doing on ${job.title}, your team is solving compelling challenges in the modern tech space. I love the purpose and technical standard that drives ${job.organization} and I believe I can contribute my skills to the continued success of the product.

Why me? I'm currently a Software & Backend Systems Engineer with 4+ years of experience who loves learning, architecting, and building resilient web platforms and microservices. I believe you'd want to consider my application with my achievements below:
• Alerte Universal (Emergency Response & Safety Platform): Architected high-availability backend microservices and engineered a real-time geospatial bounding-box notification engine ensuring rapid, mission-critical delivery.
• Agoldresourcing: Engineered the ECS Time Spine on AWS for canonical cloud reconciliation, cutting API response times by 30% and eliminating ledger sync discrepancies.
• VitalinkPlus (Smart Health Assistant): Built fractional backend services for biometric telemetry ingestion, data pipelines, and streaming infrastructure maintaining 99.9% uptime.
• AI Academic Research Publication (Jan 2026): Co-authored peer-reviewed research on "The Role Of Artificial Intelligence In Managing Handwriting And Spelling Difficulties Among University Students With Perceived Specific Learning Disabilities", indexed on ResearchGate and Zenodo/CERN.
• Leadership & Community: Hosted panel sessions at Flaskcon Africa featuring 4 tech leaders; active contributor and speaker at Google Developer Group (GDG) Lagos.
• Production Core Stack: Python (FastAPI, Flask, Django), Rust, Golang, PostgreSQL, Redis, Docker, and distributed event-driven systems.

Am I fit for this? I believe I am. I'm passionate about building robust systems and community. The major reason I love engineering is solving deep architectural challenges, writing clean, tested code, and designing systems that scale seamlessly under high concurrency. I'd love you to take a chance on me. I'm confident about this role.

Do you think I am fit? If you aren't yet convinced, you can assess my skills with a task. I could build an open-source proof of concept, complete a system design architecture challenge, or complete a technical take-home task leveraging your product and stack.

Looking forward to hearing more about this opportunity.

Sincerely,
${CANDIDATE.name}
Backend & Distributed Systems Engineer | AI Research Co-Author
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
