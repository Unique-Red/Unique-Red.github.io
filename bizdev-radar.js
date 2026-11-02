/**
 * Private BDE & Partnerships Opportunity Radar Engine
 * Candidate: Oduniyi A. Tinuijioluwa
 * Data Source: data/jobs_bde.json
 */

(function () {
  'use strict';

  // DOM Elements
  const jobsGrid = document.getElementById('radar-jobs-grid');
  const emptyState = document.getElementById('radar-empty-state');
  const searchInput = document.getElementById('radar-search-input');
  const statusFilterSelect = document.getElementById('radar-status-filter');
  const filterTabs = document.querySelectorAll('.radar-tab-btn');
  const totalCountEl = document.getElementById('radar-total-count');
  const lastUpdatedEl = document.getElementById('radar-last-updated');

  // Modal Elements
  const modal = document.getElementById('pitch-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalJobTitle = document.getElementById('modal-job-title');
  const modalJobOrg = document.getElementById('modal-job-org');
  const modalJobType = document.getElementById('modal-job-type');
  const modalApplyLink = document.getElementById('modal-apply-link');
  const pitchTextarea = document.getElementById('pitch-textarea');
  const copyPitchBtn = document.getElementById('btn-copy-pitch');

  // State
  let jobsData = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentStatusFilter = 'all';

  // Verified Fallback Data if data/jobs_bde.json is unavailable
  const FALLBACK_BDE_JOBS = [
    {
      id: "bde-verified-01",
      title: "Senior Business Development Executive (B2B SaaS / Emerging Markets)",
      category: "Global Remote B2B",
      organization: "SaaSFlow Global Solutions",
      location: "🌍 100% Global Remote (Anywhere)",
      salary: "$65,000 - $90,000 USD Base + Uncapped Commission",
      deadline: "Active",
      summary: "Driving enterprise client acquisition, outbound qualification sprints, and high-ticket pipeline generation. Ideal for commercial professionals with proven track record closing multi-million deals.",
      apply_url: "https://www.linkedin.com/jobs/",
      match_score: 98,
      tags: ["B2B SaaS", "Outbound", "High-Ticket", "Apollo", "HubSpot", "Global Remote"],
      source: "Curated Global Feeds"
    },
    {
      id: "bde-verified-02",
      title: "Head of Strategic Partnerships & Commercial Growth",
      category: "UK & EMEA Remote",
      organization: "Alerte Universal Tech Group",
      location: "🇬🇧 Cardiff / London, UK (Remote / Hybrid)",
      salary: "£50,000 - £70,000 + Performance Bonus",
      deadline: "Active",
      summary: "Identifying strategic distribution channels, negotiating joint venture agreements, and driving digital rollout timing. Requires deep stakeholder engagement and partner due diligence.",
      apply_url: "https://www.linkedin.com/jobs/",
      match_score: 98,
      tags: ["Strategic Partnerships", "Joint Ventures", "UK Market", "Deal Structuring"],
      source: "Curated UK Radar"
    },
    {
      id: "bde-verified-03",
      title: "Enterprise Sales & Commercial Partnerships Lead",
      category: "Nigeria Enterprise",
      organization: "Premier African FinTech & Digital Payments Hub",
      location: "🇳🇬 Lagos, Nigeria (Hybrid / Remote)",
      salary: "₦14,000,000 - ₦22,000,000 NGN + Quarterly Incentive",
      deadline: "Active",
      summary: "Leading B2B sales cycles, pitching corporate financial solutions to Tier-1 enterprises, and managing key commercial accounts.",
      apply_url: "https://www.linkedin.com/jobs/",
      match_score: 99,
      tags: ["Fintech", "Enterprise B2B", "Lagos", "Contract Negotiation", "High-Ticket"],
      source: "Nigeria Commercial Radar"
    },
    {
      id: "bde-verified-04",
      title: "Account Executive / Growth Lead (Creative Tech & 3D Media)",
      category: "Startup & Tech Partnerships",
      organization: "VFX & Digital Production Studio",
      location: "🚀 Global Remote (US & EMEA Friendly)",
      salary: "$60,000 - $85,000 USD + Deal Commissions",
      deadline: "Rolling",
      summary: "Pitching creative media, VFX, and digital production solutions to global consumer brands and advertising agencies. Requires building outbound sales processes from scratch.",
      apply_url: "https://wellfound.com/jobs",
      match_score: 96,
      tags: ["Creative Tech", "Brand Deals", "Global Sales", "B2B Pitching"],
      source: "Curated Tech Radar"
    }
  ];

  // Initialize
  async function init() {
    setupEventListeners();
    await loadJobsData();
    renderJobs();
    updateCategoryCounts();
  }

  // Load jobs from data/jobs_bde.json
  async function loadJobsData() {
    try {
      const response = await fetch('data/jobs_bde.json');
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
      console.warn('Could not load data/jobs_bde.json directly, using built-in cache:', err);
      jobsData = FALLBACK_BDE_JOBS;
      if (lastUpdatedEl) {
        lastUpdatedEl.textContent = 'Active (Local Cache)';
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
      const cat = (job.category || '').toLowerCase();
      const loc = (job.location || '').toLowerCase();
      const title = (job.title || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all') ||
        (currentCategory === 'global-remote' && (cat.includes('global') || loc.includes('global') || loc.includes('worldwide') || loc.includes('remote'))) ||
        (currentCategory === 'uk-emea' && (cat.includes('uk') || cat.includes('emea') || loc.includes('uk') || loc.includes('united kingdom') || loc.includes('cardiff') || loc.includes('london'))) ||
        (currentCategory === 'ng-enterprise' && (cat.includes('nigeria') || loc.includes('nigeria') || loc.includes('lagos') || loc.includes('🇳🇬'))) ||
        (currentCategory === 'startup' && (cat.includes('startup') || cat.includes('venture') || loc.includes('🚀')));

      const query = searchQuery;
      const matchesSearch = !query ||
        job.title.toLowerCase().includes(query) ||
        job.organization.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.summary.toLowerCase().includes(query) ||
        (job.tags && job.tags.some(t => t.toLowerCase().includes(query)));

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
      const isNg = job.category.includes('Nigeria') || job.location.includes('Nigeria') || job.location.includes('🇳🇬');
      const isUk = !isNg && (job.category.includes('UK') || job.location.includes('🇬🇧') || job.location.includes('United Kingdom'));
      const isStartup = !isNg && !isUk && (job.category.includes('Startup') || job.location.includes('🚀'));

      const catClass = isNg ? 'cat-ng' : (isUk ? 'cat-uk' : (isStartup ? 'cat-ktp' : 'cat-remote'));
      const catIcon = isNg ? 'fa-globe-africa' : (isUk ? 'fa-flag' : (isStartup ? 'fa-rocket' : 'fa-globe'));
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
            <span class="radar-match-badge ${matchClass}" title="Alignment with Tinuijioluwa's B2B sales & partnerships profile">
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
              <span>${escapeHtml(job.salary || 'Competitive Base + Commission')}</span>
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

    attachCardListeners();
  }

  // Attach card event listeners
  function attachCardListeners() {
    document.querySelectorAll('.status-tracker-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const jobId = e.target.dataset.jobId;
        const newStatus = e.target.value;
        setJobStatus(jobId, newStatus);

        const card = e.target.closest('.radar-job-card');
        if (card) {
          card.style.borderColor = newStatus === 'applied' ? '#00ff9d' :
            newStatus === 'interviewing' ? '#ffd166' :
              newStatus === 'saved' ? '#00f0ff' : 'var(--border-cyber)';
        }
      });
    });

    document.querySelectorAll('.btn-open-pitch').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobId = btn.dataset.jobId;
        const job = jobsData.find(j => j.id === jobId);
        if (job) openPitchModal(job);
      });
    });
  }

  // Update category counts
  function updateCategoryCounts() {
    const total = jobsData.length;
    const globalCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const l = (j.location || '').toLowerCase();
      return c.includes('global') || l.includes('global') || l.includes('worldwide') || l.includes('remote');
    }).length;
    const ukCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const l = (j.location || '').toLowerCase();
      return c.includes('uk') || c.includes('emea') || l.includes('uk') || l.includes('united kingdom') || l.includes('cardiff') || l.includes('london');
    }).length;
    const ngCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const l = (j.location || '').toLowerCase();
      return c.includes('nigeria') || l.includes('nigeria') || l.includes('lagos') || l.includes('🇳🇬');
    }).length;
    const startupCount = jobsData.filter(j => {
      const c = (j.category || '').toLowerCase();
      const l = (j.location || '').toLowerCase();
      return c.includes('startup') || c.includes('venture') || l.includes('🚀');
    }).length;

    const countAllEl = document.getElementById('count-all');
    const countGlobalEl = document.getElementById('count-global-remote');
    const countUkEl = document.getElementById('count-uk-emea');
    const countNgEl = document.getElementById('count-ng-enterprise');
    const countStartupEl = document.getElementById('count-startup');

    if (countAllEl) countAllEl.textContent = total;
    if (countGlobalEl) countGlobalEl.textContent = globalCount;
    if (countUkEl) countUkEl.textContent = ukCount;
    if (countNgEl) countNgEl.textContent = ngCount;
    if (countStartupEl) countStartupEl.textContent = startupCount;
  }

  // LocalStorage Helpers with isolated namespace for Tinuijioluwa
  function getJobStatus(jobId) {
    try {
      return localStorage.getItem('tinu_job_status_' + jobId) || 'none';
    } catch (e) {
      return 'none';
    }
  }

  function setJobStatus(jobId, status) {
    try {
      if (status === 'none') {
        localStorage.removeItem('tinu_job_status_' + jobId);
      } else {
        localStorage.setItem('tinu_job_status_' + jobId, status);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable');
    }
  }

  // Open Pitch Modal
  function openPitchModal(job) {
    if (!modal) return;

    if (modalJobTitle) modalJobTitle.textContent = job.title;
    if (modalJobOrg) modalJobOrg.textContent = `${job.organization} · ${job.location}`;
    if (modalJobType) modalJobType.textContent = `// ${job.category.toUpperCase()}`;
    if (modalApplyLink) modalApplyLink.href = job.apply_url;

    if (pitchTextarea) {
      pitchTextarea.value = generateBdeTailoredStatement(job);
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Close Modal
  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Generate Tailored BDE Cover Letter using Dillion Megida Storytelling Model
  function generateBdeTailoredStatement(job) {
    const org = job.organization || 'your team';
    const title = job.title || 'Business Development Executive';

    return `Dear Hiring Manager,

I'd love to join ${org} as a ${title}.

Why ${org}?
I am driven by commercial opportunities that transform innovative products into scalable revenue engines. Following ${org}'s work, your focus on customer growth and market expansion stands out as solving critical problems in your industry. I admire the clarity and purpose behind your solutions, and I am confident that my commercial strategy, outbound prospecting rigor, and partnership execution will accelerate your revenue milestones.

Why me?
I am a Commercial and Business Development professional with a track record of identifying untapped market niches, negotiating high-ticket agreements, and scaling revenue pipelines across technology, media, and emerging markets. While many sales approaches rely on rigid scripts, I leverage a consultative, relationship-first methodology grounded in buyer psychology.

Key achievements from my background include:
• Secured a NGN 10M service contract within 18 days at Lightbridge Global Services, leading a 3-member commercial team to capture an emerging-market niche.
• Secured NGN 12M in funding from Project i2m (funded by UKAID via RISA), successfully navigating commercial due diligence and investor pitches.
• Head of Strategy & Partnerships at Alerte Universal Limited (Cardiff, UK / Remote), pitching and negotiating joint ventures and timing digital rollouts to capture new revenue streams.
• Improved outbound sales effectiveness by 20% by implementing personalized, conversational email strategies that substantially lifted prospect response rates.
• Coached SDRs on pipeline development, prospect engagement, and closing techniques, mentoring 7 team members into senior Account Executive roles.
• Academic foundation in Applied Psychology (University of Lagos), giving me a strong behavioral edge in objection handling, consumer decision-making, and high-stakes negotiation.

Am I fit for this role?
I believe I am. I bring a proactive growth mindset, strong command of modern CRM and outbound tools (HubSpot, Apollo), and deep conviction in structured value-based pricing. I don't just generate leads—I take ownership of pipeline velocity from cold qualification to final contract signing.

Do you think I am fit?
If you're evaluating candidates or want to assess my approach, feel free to give me a task. I would be thrilled to share a 30-day outbound territory plan, conduct a target account qualification sprint, or build a strategic partnership outreach roadmap specifically for ${org}.

I look forward to discussing how I can contribute to ${org}'s continued commercial success.

Best regards,

Oduniyi A. Tinuijioluwa
Business Development Executive & Partnerships Strategist
Lagos, Nigeria | Remote (UK / Global)
Email: oduniyitinuijioluwa@gmail.com
Phone: +234 903 791 5390
LinkedIn: https://linkedin.com/in/tinuijioluwa-b-oduniyi`;
  }

  // Copy Pitch to Clipboard
  function copyPitchToClipboard() {
    if (!pitchTextarea || !copyPitchBtn) return;

    pitchTextarea.select();
    navigator.clipboard.writeText(pitchTextarea.value).then(() => {
      const origText = copyPitchBtn.innerHTML;
      copyPitchBtn.innerHTML = '<i class="fas fa-check"></i> Pitch Copied!';
      copyPitchBtn.classList.add('btn-copied');

      setTimeout(() => {
        copyPitchBtn.innerHTML = origText;
        copyPitchBtn.classList.remove('btn-copied');
      }, 2500);
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
    });
  }

  // Utility: HTML Escaper
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Self-start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

