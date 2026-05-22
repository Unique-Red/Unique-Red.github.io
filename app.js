/**
 * Noah Useghan — Portfolio Main Application Script
 * Precision-engineered vanilla JavaScript for high performance and smooth interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Set dynamic copyright year
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 1. STATE & VIEW MANAGEMENT (DUAL-MODE SWITCH)
  // ==========================================================================
  const body = document.body;
  const modeToggle = document.getElementById('mode-toggle');
  const labelInteractive = document.getElementById('label-interactive');
  const labelPrintable = document.getElementById('label-printable');
  const interactiveWrapper = document.getElementById('interactive-wrapper');
  const printableWrapper = document.getElementById('printable-wrapper');
  
  const btnPrintCv = document.getElementById('btn-print-cv');
  const btnBackInteractive = document.getElementById('btn-back-interactive');

  function switchMode(toPrintable) {
    if (toPrintable) {
      body.classList.remove('interactive-mode');
      body.classList.add('printable-mode');
      
      interactiveWrapper.classList.remove('active');
      printableWrapper.classList.add('active');
      
      labelInteractive.classList.remove('active');
      labelPrintable.classList.add('active');
      modeToggle.checked = true;
      
      
      customCursor.style.display = 'none';
      customCursorRing.style.display = 'none';
    } else {
      body.classList.remove('printable-mode');
      body.classList.add('interactive-mode');
      
      printableWrapper.classList.remove('active');
      interactiveWrapper.classList.add('active');
      
      labelPrintable.classList.remove('active');
      labelInteractive.classList.add('active');
      modeToggle.checked = false;
      
      
      customCursor.style.display = 'block';
      customCursorRing.style.display = 'block';
    }
  }

  modeToggle.addEventListener('change', (e) => {
    switchMode(e.target.checked);
  });

  btnBackInteractive.addEventListener('click', () => {
    switchMode(false);
  });

  btnPrintCv.addEventListener('click', () => {
    window.print();
  });


  
  
  
  const customCursor = document.getElementById('custom-cursor');
  const customCursorRing = document.getElementById('custom-cursor-ring');
  
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    
    customCursor.style.left = `${mouseX}px`;
    customCursor.style.top = `${mouseY}px`;
  });

  
  function animateRing() {
    if (body.classList.contains('interactive-mode')) {
      const lerpFactor = 0.15;
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;
      
      customCursorRing.style.left = `${ringX}px`;
      customCursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  
  const hoverables = 'a, button, select, input, textarea, .project-card, .arch-node, #mode-controls label';
  
  function addCursorHoverEffects() {
    document.querySelectorAll(hoverables).forEach(el => {
      
      el.removeEventListener('mouseenter', onMouseEnterHoverable);
      el.removeEventListener('mouseleave', onMouseLeaveHoverable);
      
      el.addEventListener('mouseenter', onMouseEnterHoverable);
      el.addEventListener('mouseleave', onMouseLeaveHoverable);
    });
  }

  function onMouseEnterHoverable() {
    customCursor.classList.add('hovered');
    customCursorRing.classList.add('hovered');
  }

  function onMouseLeaveHoverable() {
    customCursor.classList.remove('hovered');
    customCursorRing.classList.remove('hovered');
  }

  addCursorHoverEffects();


  
  
  
  
  
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksWrapper = document.querySelector('.nav-links-wrapper');
  const navLinks = document.querySelectorAll('.nav-links a');

  mobileNavToggle.addEventListener('click', () => {
    mobileNavToggle.classList.toggle('active');
    navLinksWrapper.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.classList.remove('active');
      navLinksWrapper.classList.remove('active');
    });
  });

  
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));


  
  
  
  const tabBtns = document.querySelectorAll('.sandbox-tab-btn');
  const panes = document.querySelectorAll('.sandbox-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`pane-${targetTab}`).classList.add('active');
    });
  });


  
  
  
  const terminalInput = document.getElementById('terminal-input');
  const terminalScreen = document.getElementById('terminal-screen-logs');
  const terminalClearBtn = document.getElementById('terminal-clear-btn');
  
  let commandHistory = [];
  let historyIndex = -1;

  
  const mockFileSystem = {
    'bio.json': {
      name: "Noah Useghan",
      role: "Backend & Systems Engineer",
      location: "Lagos, Nigeria",
      focus: "Writing APIs that do not break, designing optimal schemas, and handling async messaging stacks."
    },
    'skills.json': {
      languages: ["Rust", "Python", "Golang", "JavaScript"],
      frameworks: ["Flask", "FastAPI", "Django", "Flask-RESTX"],
      databases: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis"],
      devops: ["Docker", "AWS", "Google Cloud", "Render", "GitHub Actions", "CI/CD", "GitOps"]
    },
    'contact.json': {
      email: "noahuseghan@gmail.com",
      github: "https://github.com/Unique-Red",
      linkedin: "https://linkedin.com/in/noahuseghan"
    }
  };

  const availableCommands = {
    'help': 'Display active backend commands.',
    'ls': 'List mock configuration files available to inspect.',
    'cat [file]': 'View details inside a configuration file.',
    'skills': 'Print summary of technical programming assets.',
    'experience': 'Print summary of commercial roles history.',
    'ping': 'Run latency diagnostics ping to mock server API gateway.',
    'migrate': 'Simulate relational database schema migration cycle (Flask/Alembic).',
    'clear': 'Reset screen history lines.',
    'sudo [cmd]': 'Invoke root execution (careful with system root).'
  };

  
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = terminalInput.value.trim();
      if (inputVal) {
        handleTerminalCommand(inputVal);
        commandHistory.push(inputVal);
        historyIndex = commandHistory.length;
      }
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  terminalClearBtn.addEventListener('click', () => {
    terminalScreen.innerHTML = `
      <div class="terminal-row welcome-msg">
        <p class="accent-text">NOAH-OS (v1.2.0-STABLE) Web Console</p>
        <p>Logs reset. Enter <span class="cyan">help</span> for commands.</p>
        <p>&nbsp;</p>
      </div>
    `;
  });

  function appendTerminalRow(text, type = 'output-row', isRawHtml = false) {
    const row = document.createElement('div');
    row.className = `terminal-row ${type}`;
    if (isRawHtml) {
      row.innerHTML = text;
    } else {
      row.textContent = text;
    }
    terminalScreen.appendChild(row);
    
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function handleTerminalCommand(cmdString) {
    
    appendTerminalRow(`visitor@noah-backend:~$ ${cmdString}`, 'command-input-row');

    const args = cmdString.split(/\s+/);
    const primaryCmd = args[0].toLowerCase();

    switch (primaryCmd) {
      case 'help':
        let helpOutput = 'Available console commands:<br>';
        for (const [cmd, desc] of Object.entries(availableCommands)) {
          helpOutput += `&nbsp;&nbsp;<span class="cyan">${cmd.padEnd(12)}</span> &mdash; ${desc}<br>`;
        }
        appendTerminalRow(helpOutput, 'output-row', true);
        break;

      case 'ls':
        appendTerminalRow(Object.keys(mockFileSystem).join('    '), 'output-row');
        break;

      case 'cat':
        if (args.length < 2) {
          appendTerminalRow('Usage: cat [filename] (e.g. cat bio.json)', 'error-row');
        } else {
          const fileName = args[1];
          if (mockFileSystem[fileName]) {
            appendTerminalRow(JSON.stringify(mockFileSystem[fileName], null, 2), 'output-row');
          } else {
            appendTerminalRow(`cat: ${fileName}: No such file or configuration.`, 'error-row');
          }
        }
        break;

      case 'skills':
        const skillsOutput = `
<span class="accent-text">--- TECHNICAL COMPASS ---</span>
<span class="cyan">Languages:</span> Rust, Python, Golang, Javascript
<span class="cyan">Frameworks:</span> Flask, FastAPI, Django, Flask-RESTX
<span class="cyan">Databases:</span> PostgreSQL, MySQL, MongoDB, SQLite, Redis (Caching/Streams)
<span class="cyan">DevOps/Infra:</span> Docker, AWS, Google Cloud, Render, GitHub Actions, CI/CD, GitOps, Monitoring & Observability
        `;
        appendTerminalRow(skillsOutput, 'output-row', true);
        break;

      case 'experience':
        const expOutput = `
<span class="accent-text">--- CAREER MILESTONES ---</span>
* <span class="cyan">Agoldresourcing (Lead Backend Engineer)</span> | Apr 2025 - Present
  - Engineered ECS Time Spine reconciliation engine.
* <span class="cyan">Alerte Universal (Lead Backend Developer)</span> | Oct 2024 - Present
  - Bounding-box spatial engine & family safety modules.
* <span class="cyan">VitalinkPlus (Fractional Backend Eng - Contract)</span> | Sep 2025 - Mar 2026
  - Telemetry streaming & health integration pipelines.
* <span class="cyan">Cashom (Backend Engineer - Part-time Contract)</span> | Oct - Dec 2025
  - P2P transfers, digital wallets & social payment escrows.
* <span class="cyan">Help Experience (HEx) (Backend Developer)</span> | Oct 2022 - Dec 2023
  - API query optimizations reducing latency by 30%.
        `;
        appendTerminalRow(expOutput, 'output-row', true);
        break;

      case 'ping':
        appendTerminalRow('PING gateway.noahuseghan.com (172.217.16.142) 56(84) bytes of data.', 'output-row');
        let pingCount = 0;
        
        
        terminalInput.disabled = true;
        
        const pingInterval = setInterval(() => {
          pingCount++;
          const latency = (Math.random() * 15 + 15).toFixed(1);
          appendTerminalRow(`64 bytes from gateway.noahuseghan.com (172.217.16.142): icmp_seq=${pingCount} ttl=56 time=${latency} ms`, 'output-row');
          
          if (pingCount >= 4) {
            clearInterval(pingInterval);
            appendTerminalRow('--- gateway.noahuseghan.com ping statistics ---', 'output-row');
            appendTerminalRow('4 packets transmitted, 4 received, 0% packet loss, time 3004ms', 'output-row');
            terminalInput.disabled = false;
            terminalInput.focus();
            addCursorHoverEffects();
          }
        }, 800);
        break;

      case 'migrate':
        appendTerminalRow('Initializing Flask Alembic database engine...', 'output-row');
        terminalInput.disabled = true;
        
        let progress = 0;
        appendTerminalRow('[ ] Fetching pending database models...', 'output-row');
        
        setTimeout(() => {
          appendTerminalRow('Found 2 pending migrations:', 'output-row');
          appendTerminalRow('  -> 8a1f8c_add_ledger_records_table.py', 'output-row');
          appendTerminalRow('  -> 2d4e8a_create_subscription_indexing.py', 'output-row');
          appendTerminalRow('Applying migrations...', 'output-row');
          
          const progressInterval = setInterval(() => {
            progress += 25;
            appendTerminalRow(`Applying changes: [${'#'.repeat(progress/10)}${'.'.repeat(10-progress/10)}] ${progress}%`, 'output-row');
            if (progress >= 100) {
              clearInterval(progressInterval);
              appendTerminalRow('OK  - Applied 8a1f8c_add_ledger_records_table', 'output-row');
              appendTerminalRow('OK  - Applied 2d4e8a_create_subscription_indexing', 'output-row');
              appendTerminalRow('SUCCESS - Relational schemas synchronized successfully.', 'accent-text');
              terminalInput.disabled = false;
              terminalInput.focus();
              addCursorHoverEffects();
            }
          }, 400);
        }, 1000);
        break;

      case 'clear':
        terminalScreen.innerHTML = '';
        break;

      case 'sudo':
        if (args.length < 2) {
          appendTerminalRow('Usage: sudo [command]', 'error-row');
        } else {
          const subCommand = args.slice(1).join(' ');
          if (subCommand.includes('rm -rf')) {
            appendTerminalRow('⚠️ WARNING: DESTRUCTION INSTRUCTIONS DETECTED ⚠️', 'error-row');
            appendTerminalRow('Initiating kernel security defense measures...', 'error-row');
            
            terminalInput.disabled = true;
            setTimeout(() => {
              
              terminalScreen.classList.add('glitch-active');
              appendTerminalRow('ERROR: Nice try! Sandbox node isolated. Root system remains intact.', 'accent-text');
              setTimeout(() => {
                terminalScreen.classList.remove('glitch-active');
                terminalInput.disabled = false;
                terminalInput.focus();
              }, 1200);
            }, 1000);
          } else {
            appendTerminalRow('guest is not in the sudoers file. This incident will be reported.', 'error-row');
          }
        }
        break;

      default:
        appendTerminalRow(`bash: command not found: ${primaryCmd}. Enter 'help' for details.`, 'error-row');
        break;
    }
  }

  
  const heroTypingText = document.getElementById('hero-typing-text');
  const heroTerminalResponse = document.getElementById('hero-terminal-response');
  const heroCommands = [
    'curl -s https://noahuseghan.com/summary',
    'python manage.py runserver',
    'docker-compose up --build -d'
  ];
  
  
  if (heroTypingText) {
    let heroCmdText = heroCommands[0];
    heroTypingText.textContent = '';
    let idx = 0;
    
    function typeHeroCmd() {
      if (idx < heroCmdText.length) {
        heroTypingText.textContent += heroCmdText.charAt(idx);
        idx++;
        setTimeout(typeHeroCmd, 60);
      } else {
        
        setTimeout(() => {
          heroTerminalResponse.style.display = 'block';
        }, 400);
      }
    }
    
    setTimeout(typeHeroCmd, 1200);
  }


  
  
  
  const apiEndpointSelect = document.getElementById('api-endpoint');
  const requestMethodBadge = document.getElementById('request-method-badge');
  const apiBodyGroup = document.getElementById('api-body-group');
  const btnSendRequest = document.getElementById('btn-send-request');
  const apiLatencyInput = document.getElementById('api-latency');
  const apiLatencyVal = document.getElementById('api-latency-val');
  
  const responseStatusBadge = document.getElementById('response-status-badge');
  const responseTimeVal = document.getElementById('response-time-val');
  const apiResponseCode = document.getElementById('api-response-code');
  const contactForm = document.getElementById('contact-form');

  
  const simulatedDBResponses = {
    '/api/v1/profile': {
      status: 200,
      statusText: 'OK',
      data: {
        engineer: "Noah Useghan",
        title: "Backend & Systems Engineer",
        experience_years: 5,
        metrics: {
          uptime_target: "99.99%",
          average_db_latency: "12ms",
          concurrent_connections: "10k+"
        },
        focus_disciplines: [
          "Robust API Contract Design (OpenAPI/REST)",
          "Complex Relational DB Query Tuning",
          "Asynchronous Event Brokers & Pipelines",
          "Containerized Cloud Orchestration"
        ]
      }
    },
    '/api/v1/skills': {
      status: 200,
      statusText: 'OK',
      data: {
        languages: {
          primary: ["Rust", "Python", "Golang"],
          secondary: ["JavaScript (ES6+)", "SQL (Structured Query Language)"]
        },
        frameworks: {
          flask: "Highly Proficient (Auth, Custom Decorators, Caching, RESTX)",
          fastapi: "Proficient (Pydantic models, Async endpoints, API Docs)",
          django: "Prior Production Experience"
        },
        databases: {
          relational: ["PostgreSQL (Optimized Indexing, Complex Joins)", "MySQL", "SQLite"],
          nosql: ["MongoDB (Document aggregation)"],
          cache: ["Redis (Rate limiting, Key-Value locks)"]
        },
        infra: ["Docker", "AWS (EC2, RDS, S3)", "Google Cloud", "Render", "GitHub Actions", "CI/CD pipelines", "GitOps workflows", "Monitoring & Observability"]
      }
    },
    '/api/v1/projects': {
      status: 200,
      statusText: 'OK',
      data: [
        {
          id: "easy-transact",
          name: "Easy Transact System",
          type: "Fintech Ledger Core",
          features: ["Double-entry reconciliation", "JWT Auth", "Celery async ledger reporting"],
          scale: "Handles micro-transaction ledger balancing within PostgreSQL"
        },
        {
          id: "stma",
          name: "STMA Portal API",
          type: "Education Registry Backend",
          features: ["Flask RESTful framework", "PostgreSQL database integration", "Token gating"],
          scale: "Proven to hold high transaction processing rates"
        },
        {
          id: "redroute",
          name: "RedRoute URL Core",
          type: "High-Performance Link Router",
          features: ["Sub-10ms redirects via Redis read-through caching", "SQLite database statistics persistence", "QR code API generation"]
        }
      ]
    },
    '/api/v1/projects/easy-transact': {
      status: 200,
      statusText: 'OK',
      data: {
        id: "easy-transact",
        name: "Easy Transact System",
        architecture: {
          web: "Flask Core APIs",
          workers: "Celery Task Queue with Redis Broker",
          database: "PostgreSQL with ACID transaction safety",
          security: "Bcrypt hash checks and OAuth state parameters"
        },
        audit_trail: "Records all ledger adjustments with high-precision timestamp audits."
      }
    },
    '/api/v1/projects/stma': {
      status: 200,
      statusText: 'OK',
      data: {
        id: "stma",
        name: "STMA Student Portal Backend",
        architecture: {
          web: "Flask-RESTX API Engine",
          database: "PostgreSQL normalized schemas",
          validation: "Marshmallow object deserialization & strict type validation"
        },
        metrics: "API load tested to handle peak registration events safely."
      }
    },
    '/api/v1/projects/redroute': {
      status: 200,
      statusText: 'OK',
      data: {
        id: "redroute",
        name: "RedRoute URL Engine",
        architecture: {
          web: "FastAPI with async routing",
          cache: "Redis caching redirect mappings to bypass database read bottlenecks",
          datastore: "SQLite with WAL logging mode enabled"
        },
        performance: "Redirection latency average: 8.4 milliseconds"
      }
    },
    '/api/v1/architecture': {
      status: 200,
      statusText: 'OK',
      data: {
        topology: "Stateless Microservices Grid",
        gateway: "Nginx rate-limiting & SSL offloader",
        app_nodes: "Python Gunicorn clusters",
        cache_tier: "Redis cluster",
        persistent_storage: "PostgreSQL master-slave replica node set"
      }
    },
    '/api/v1/contact': {
      status: 201,
      statusText: 'Created',
      data: {
        success: true,
        message: "Message processed successfully. Simulated notification pushed to Noah Useghan via Firebase FCM.",
        timestamp: new Date().toISOString()
      }
    }
  };

  
  apiEndpointSelect.addEventListener('change', () => {
    const selectedOption = apiEndpointSelect.options[apiEndpointSelect.selectedIndex];
    const method = selectedOption.getAttribute('data-method') || 'GET';
    
    requestMethodBadge.textContent = method;
    requestMethodBadge.className = `http-method-badge ${method.toLowerCase()}`;
    
    if (method === 'POST') {
      apiBodyGroup.style.display = 'block';
    } else {
      apiBodyGroup.style.display = 'none';
    }
  });

  
  apiLatencyInput.addEventListener('input', () => {
    apiLatencyVal.textContent = `${apiLatencyInput.value}ms`;
  });

  
  function syntaxHighlightJson(jsonObj) {
    let jsonStr = JSON.stringify(jsonObj, null, 2);
    
    jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    
    return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
          
          return `<span class="${cls}">${match.replace(':', '')}</span>:`;
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }

  
  function executeMockApiCall(endpointPath, methodType, bodyData = null, customLatency = null) {
    
    btnSendRequest.disabled = true;
    const btnText = btnSendRequest.querySelector('.btn-text');
    const btnSpinner = btnSendRequest.querySelector('.spinner');
    
    if (btnText && btnSpinner) {
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-block';
    }

    responseStatusBadge.textContent = 'PENDING';
    responseStatusBadge.className = 'response-status pending';
    apiResponseCode.textContent = '// Dispatching simulated request...';
    
    const startTime = performance.now();
    const latency = customLatency !== null ? customLatency : parseInt(apiLatencyInput.value, 10);
    
    setTimeout(() => {
      const responseDataObj = simulatedDBResponses[endpointPath];
      const endTime = performance.now();
      const actualDuration = Math.round(endTime - startTime);
      
      if (responseDataObj) {
        
        responseStatusBadge.textContent = `${responseDataObj.status} ${responseDataObj.statusText}`;
        responseStatusBadge.className = `response-status ${responseDataObj.status < 400 ? 'success' : 'error'}`;
        responseTimeVal.textContent = `${actualDuration}ms`;
        
        
        if (methodType === 'POST' && endpointPath === '/api/v1/contact') {
          try {
            const parsedBody = bodyData ? JSON.parse(bodyData) : {};
            const finalResponse = JSON.parse(JSON.stringify(responseDataObj.data));
            
            
            finalResponse.received_payload = {
              sender: parsedBody.name || "Anonymous",
              email: parsedBody.email || "no-email@test.com",
              message_preview: parsedBody.message ? (parsedBody.message.slice(0, 40) + '...') : ""
            };
            apiResponseCode.innerHTML = syntaxHighlightJson(finalResponse);
          } catch(e) {
            responseStatusBadge.textContent = '400 Bad Request';
            responseStatusBadge.className = 'response-status error';
            apiResponseCode.innerHTML = syntaxHighlightJson({
              error: "Malformed request body. Please ensure JSON is valid."
            });
          }
        } else {
          apiResponseCode.innerHTML = syntaxHighlightJson(responseDataObj.data);
        }
      } else {
        
        responseStatusBadge.textContent = '404 Not Found';
        responseStatusBadge.className = 'response-status error';
        responseTimeVal.textContent = `${actualDuration}ms`;
        apiResponseCode.innerHTML = syntaxHighlightJson({
          error: "Endpoint resource path not configured.",
          valid_endpoints: Object.keys(simulatedDBResponses)
        });
      }

      
      btnSendRequest.disabled = false;
      if (btnText && btnSpinner) {
        btnText.style.display = 'inline-block';
        btnSpinner.style.display = 'none';
      }
      addCursorHoverEffects();
    }, latency);
  }

  btnSendRequest.addEventListener('click', () => {
    const endpoint = apiEndpointSelect.value;
    const option = apiEndpointSelect.options[apiEndpointSelect.selectedIndex];
    const method = option.getAttribute('data-method') || 'GET';
    const bodyVal = document.getElementById('api-post-body').value;
    
    executeMockApiCall(endpoint, method, bodyVal);
  });

  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const senderName = document.getElementById('contact-name').value;
    const senderEmail = document.getElementById('contact-email').value;
    const senderMsg = document.getElementById('contact-message').value;
    
    const submitBtn = document.getElementById('contact-submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Pinging...';
    
    // Optional Web3Forms Integration: Paste your Access Key here to receive real emails!
    // Get your free key at: https://web3forms.com/
    const WEB3FORMS_ACCESS_KEY = "f1e12cf4-2878-44df-ac1e-2e56a9acbfda"; 
    
    if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY") {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: senderName,
          email: senderEmail,
          message: senderMsg,
          subject: `New Portfolio Message from ${senderName}`
        })
      }).catch(err => console.error("Web3Forms submission error:", err));
    }
    
    
    const apiTabBtn = document.querySelector('.sandbox-tab-btn[data-tab="api"]');
    if (apiTabBtn) apiTabBtn.click();
    
    
    apiEndpointSelect.value = '/api/v1/contact';
    
    const event = new Event('change');
    apiEndpointSelect.dispatchEvent(event);
    
    
    document.getElementById('api-post-body').value = JSON.stringify({
      name: senderName,
      email: senderEmail,
      message: senderMsg
    }, null, 2);
    
    
    document.getElementById('sandbox').scrollIntoView({ behavior: 'smooth' });
    
    
    setTimeout(() => {
      executeMockApiCall('/api/v1/contact', 'POST', JSON.stringify({
        name: senderName,
        email: senderEmail,
        message: senderMsg
      }), 400);
      
      
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 600);
  });


  
  
  
  const archNodes = document.querySelectorAll('.arch-node');
  const archNodeName = document.getElementById('arch-node-name');
  const archNodeDesc = document.getElementById('arch-node-desc');
  const archNodeStatsBox = document.getElementById('arch-node-stats-box');
  const archStatTech = document.getElementById('arch-stat-tech');
  const archStatPractice = document.getElementById('arch-stat-practice');

  const nodeDetailsDatabase = {
    'client': {
      title: 'Client Web Browser',
      desc: '<p>The portal entry point. In modern setups, I serve static UI assets (HTML/CSS/JS) via high-performance CDN edges like Vercel or Cloudflare.</p><p>The client communicates with the backend via secure AJAX/fetch REST API requests authenticated with <strong>JSON Web Tokens (JWT)</strong>.</p>',
      tech: 'Browser / Mobile Client',
      practice: 'Cross-Origin Resource Sharing (CORS), secure HTTP headers.'
    },
    'gateway': {
      title: 'API Gateway & Nginx Load Balancer',
      desc: '<p>Acts as the system gatekeeper. I deploy Nginx as a reverse proxy to manage <strong>SSL/TLS termination</strong>, route API traffic to internal clusters, and configure rate limiting blocks to mitigate DDoS threats.</p><p>For instance, I configure <strong>token bucket rate limiting</strong> algorithms to limit user requests (e.g. max 60 calls per minute) protecting backend servers from being bottlenecked.</p>',
      tech: 'Nginx, WSGI, SSL Gateway',
      practice: 'SSL offloading, CORS gating, request rate-limiting.'
    },
    'server': {
      title: 'Python Web Server (Flask / FastAPI)',
      desc: '<p>The backend application logic node. I write modular, object-oriented microservices using Python micro-frameworks:</p><ul><li><strong>Flask:</strong> Ideal for building lightweight, scalable API layers. Deployed with Gunicorn WSGI servers in production.</li><li><strong>FastAPI:</strong> Ideal for high-throughput async routes utilizing asyncio loops and type-safe Pydantic models.</li></ul><p>I design request decorators to restrict billing endpoints based on subscription states (using Stripe/Paystack callback integrations).</p>',
      tech: 'Flask, FastAPI, Gunicorn, Python',
      practice: 'Stateless design, MVC architecture, custom decorators, input sanitization.'
    },
    'redis': {
      title: 'Redis Caching & Queue Broker',
      desc: '<p>An in-memory key-value store. I deploy Redis to solve database bottleneck challenges: </p><ul><li><strong>Read-Through Caching:</strong> Storing heavy index results, reducing latency times down to sub-10ms.</li><li><strong>Rate Limiting Data:</strong> Storing IP rate buckets due to lightning-fast execution write speeds.</li><li><strong>Broker:</strong> Serving as the communication queue broker connecting Python Gunicorn threads to Celery async worker processes.</li></ul>',
      tech: 'Redis (In-Memory Key-Value)',
      practice: 'Cache eviction keys (TTL), read-through configurations, distributed locks.'
    },
    'database': {
      title: 'Relational Database (PostgreSQL / MySQL)',
      desc: '<p>The persistent data store. I focus heavily on writing well-structured schemas (Third Normal Form) and optimizing query performance:</p><ul><li><strong>Indexing:</strong> Designing composite and B-Tree indexes on active query filter keys (like user_id, timestamp) to prevent full-table scans. This cut average database latency at HEx by 30%.</li><li><strong>ORM/SQLAlchemy:</strong> Using lazy load query strategies to prevent N+1 query overheads, and implementing transaction rollback safeguards.</li></ul>',
      tech: 'PostgreSQL, MySQL, SQLAlchemy ORM',
      practice: 'Schema normalization, B-Tree index optimization, transaction isolation levels.'
    },
    'worker': {
      title: 'Asynchronous Task Worker (Celery / Cron)',
      desc: '<p>The background computation engine. To prevent web threads from blocking, heavy computations are delegated to background workers:</p><ul><li><strong>Asynchronous Tasks:</strong> Triggering email confirmations (Flask-Mail), pushing push alerts (Firebase FCM), or processing reports.</li><li><strong>Cron Schedules:</strong> Performing daily ledger audits, generating billing updates, and refreshing cache states.</li></ul>',
      tech: 'Celery, Python-Cron, Redis Broker',
      practice: 'Task retry backoff mechanisms, stateless execution, isolated execution queues.'
    },
    'external': {
      title: 'External API Integrations',
      desc: '<p>Connecting the internal architecture to verified third-party vendors securely:</p><ul><li><strong>Stripe / Paystack:</strong> Processing financial subscriptions. Webhook endpoints verify digital signing signatures before reconciling wallet balances.</li><li><strong>Firebase FCM:</strong> Launching real-time notifications for telemetry triggers.</li><li><strong>Google Gemini AI:</strong> Integrating advanced AI assistants via secure API calls.</li></ul>',
      tech: 'Stripe API, Paystack Webhooks, Firebase FCM, Gemini AI SDK',
      practice: 'Secure secret vaults (env files), webhook digital signature verification, API retry handlers.'
    }
  };

  archNodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeKey = node.getAttribute('data-node');
      const details = nodeDetailsDatabase[nodeKey];
      
      if (details) {
        
        archNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        
        
        archNodeName.textContent = details.title;
        archNodeDesc.innerHTML = details.desc;
        
        archStatTech.textContent = details.tech;
        archStatPractice.textContent = details.practice;
        
        archNodeStatsBox.style.display = 'block';
      }
    });
  });


  
  
  
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const apiEndpoint = card.getAttribute('data-api-target');
      const archNodeId = card.getAttribute('data-arch-target');
      
      
      const apiTabBtn = document.querySelector('.sandbox-tab-btn[data-tab="api"]');
      if (apiTabBtn) apiTabBtn.click();
      
      
      if (apiEndpoint) {
        apiEndpointSelect.value = apiEndpoint;
        
        const event = new Event('change');
        apiEndpointSelect.dispatchEvent(event);
        
        
        executeMockApiCall(apiEndpoint, 'GET');
      }

      
      if (archNodeId) {
        let nodeElement = null;
        if (archNodeId === 'finance') {
          nodeElement = document.getElementById('node-database'); 
        } else if (archNodeId === 'stma') {
          nodeElement = document.getElementById('node-server'); 
        } else if (archNodeId === 'redroute') {
          nodeElement = document.getElementById('node-redis'); 
        }

        if (nodeElement) {
          
          nodeElement.dispatchEvent(new Event('click'));
        }
      }

      
      document.getElementById('sandbox').scrollIntoView({ behavior: 'smooth' });
    });
  });

});
