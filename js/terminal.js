// Terminal functionality with command handling and typewriter effects

class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('input');
        this.promptElement = document.getElementById('main-prompt'); // Reference to the main prompt
        this.clockElement = document.getElementById('melbourne-clock');
        this.currentPath = '/home/amit';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.isTyping = false; // Track if we're currently typing
        this.shouldStop = false; // Flag to stop typing
        
        this.init();
        this.showWelcome();
        this.startClock();
    }

    // Clock functionality for Melbourne Time (AET, UTC+10/+11)
    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        // Get current time in Melbourne (Australia/Melbourne)
        const now = new Date();
        const melbourneTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
        
        const hours = String(melbourneTime.getHours()).padStart(2, '0');
        const minutes = String(melbourneTime.getMinutes()).padStart(2, '0');
        const seconds = String(melbourneTime.getSeconds()).padStart(2, '0');
        
        if (this.clockElement) {
            this.clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    init() {
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        this.input.focus();
        
        // Update the main prompt to show current path
        this.updateMainPrompt();
        
        // Keep input focused
        document.addEventListener('click', () => this.input.focus());
    }

    async showWelcome() {
        const welcomeText = `
╔═══════════════════════════════════════════════╗
║                    WELCOME TO AMIT'S SYSTEM
║
║        🚀 DevOps Engineer & GenAI Solution Architect 🤖
║                    @ Leapfrog Technology Inc.
║               https://www.linkedin.com/in/oneamitj
║
║  System initialized... Loading portfolio data...
║  AWS Services: ████████████████████████████████ 100%
║  GenAI Models: ████████████████████████████████ 100%
║  DevOps Tools: ████████████████████████████████ 100%
║  Compliance:   ████████████████████████████████ 100%
║
║  🎯 10+ Years Experience | 🎓 B.E. Computer Engineering
║  📍 Melbourne, Australia
║
║  Type 'help' to see available commands
║  Type 'about' to learn more about me
╚═══════════════════════════════════════════════╝

Boot sequence complete. Ready for commands...

🌟 Quick Facts:
• AWS Expert
• Led team growth from 4 to 25+ AWS certified engineers
• Optimized GenAI products: 40% performance ↑, 50% cost ↓
• Drove technical solutions from concept to deployment
• Spearheaded the development of GenAI products,
• Compliance audits for HIPAA, SOC2, and other standards.
• Guided company to be 🏆 APN Advanced Partner
`;
        
        await this.typeText(welcomeText, 3);
        // this.showPrompt();
    }

    async typeText(text, speed = 15) {
        this.isTyping = true;
        this.shouldStop = false;
        
        const lines = text.split('\n');
        for (const line of lines) {
            if (this.shouldStop) break;
            
            const div = document.createElement('div');
            this.output.appendChild(div);
            
            let charCount = 0;
            for (const char of line) {
                if (this.shouldStop) break;
                
                div.textContent += char;
                charCount++;
                await this.sleep(speed);
                
                // Auto-scroll every 5 characters or at end of line for smooth following
                if (charCount % 5 === 0 || char === line[line.length - 1]) {
                    this.scrollToBottom();
                }
            }
            // Always scroll at end of each line
            this.scrollToBottom();
        }
        
        this.isTyping = false;
        this.scrollToBottom();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Update the main input prompt
    updateMainPrompt() {
        if (this.promptElement) {
            this.promptElement.textContent = `oneamitj@devops:${this.currentPath}$`;
        }
    }

    // Show prompt in output (for command history)
    // showPrompt() {
    //     const promptDiv = document.createElement('div');
    //     promptDiv.innerHTML = `<span class="prompt">oneamitj@devops:${this.currentPath}$</span> `;
    //     this.output.appendChild(promptDiv);
    //     this.scrollToBottom();
    // }

    async handleInput(e) {
        // Handle Ctrl+C to stop typing
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            if (this.isTyping) {
                this.stopTyping();
                return;
            }
        }

        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            this.input.value = '';
            
            // Stop any ongoing typing from previous command
            if (this.isTyping) {
                this.stopTyping('silent');
                // Add a small delay to ensure the stopTyping completes
                await this.sleep(50);
            }
            
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                
                // Show the command in output
                const commandDiv = document.createElement('div');
                commandDiv.innerHTML = `<span class="prompt">oneamitj@devops:${this.currentPath}$</span> ${command}`;
                this.output.appendChild(commandDiv);
                
                // Immediately scroll to show the entered command
                this.scrollToBottom();
                
                await this.executeCommand(command);
            }
            
            // this.showPrompt();
            this.updateMainPrompt(); // Update the main prompt after each command
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        }
    }

    stopTyping() {
        this.shouldStop = true;
        this.isTyping = false;
        
        // Add the ^C indicator only if this was triggered by Ctrl+C
        // We'll modify this to be more selective about when to show ^C
        if (arguments.length === 0 || arguments[0] !== 'silent') {
            const interruptDiv = document.createElement('div');
            interruptDiv.textContent = '^C';
            this.output.appendChild(interruptDiv);
        }
        this.scrollToBottom();
    }

    async executeCommand(commandLine) {
        const parts = commandLine.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Check for --help flag
        if (args.includes('--help') || args.includes('-h')) {
            await this.showCommandHelp(command);
            return;
        }

        try {
            switch (command) {
                case 'help':
                    await this.showHelp();
                    break;
                case 'about':
                    await this.showAbout();
                    break;
                case 'skills':
                    await this.showSkills(args[0]);
                    break;
                case 'projects':
                    await this.showProjects(args[0]);
                    break;
                case 'experience':
                    await this.showExperience();
                    break;
                case 'contact':
                    await this.showContact();
                    break;
                case 'ls':
                    await this.listDirectory();
                    break;
                case 'clear':
                    this.clearScreen();
                    break;
                case 'whoami':
                    await this.whoAmI();
                    break;
                case 'pwd':
                    await this.showCurrentPath();
                    break;
                case 'cd':
                    await this.changeDirectory(args[0]);
                    break;
                case 'cat':
                    if (args[0]) {
                        await this.catFile(args[0]);
                    } else {
                        await this.showError('cat: missing file operand');
                    }
                    break;
                case 'resume':
                    if (args.includes('--download')) {
                        await this.downloadResume();
                    } else {
                        await this.showResume();
                    }
                    break;
                case 'cv':
                    if (args.includes('--download')) {
                        await this.downloadResume();
                    } else {
                        await this.showResume();
                    }
                    break;
                case 'easter':
                    await this.showEasterEgg();
                    break;
                case 'achievements':
                    await this.showAchievements();
                    break;
                case 'awards':
                    await this.showAwards();
                    break;
                case 'certifications':
                    await this.showCertifications();
                    break;
                case 'linkedin':
                    await this.openLinkedIn();
                    break;
                case 'github':
                    await this.openGitHub();
                    break;
                case 'present':
                    if (args.length > 0) {
                        await this.handlePresent(args[0]);
                    } else {
                        await this.showError('present: missing file operand. Usage: present <filename>');
                    }
                    break;
                case 'lunch':
                    if (args.length > 0) {
                        await this.handleLunch(args[0]);
                    } else {
                        await this.showError('lunch: missing file operand. Usage: lunch <filename>');
                    }
                    break;
                case 'roadmap':
                    await this.handleLunch('career');
                    break;
                case 'oneai':
                    if (args.length > 0) {
                        await this.handleOneAI(args.join(' '));
                    } else {
                        await this.showError('oneai: missing message. Usage: oneai <your question>');
                    }
                    break;
                case 'sudo':
                    await this.handleRickRoll(command);
                    break;
                case 'rm':
                    // Check if it's the dangerous rm -rf command
                    if (args.includes('-rf') || args.includes('-r')) {
                        await this.handleRickRoll(`${command} ${args.join(' ')}`);
                    } else {
                        await this.showError(`rm: ${args.join(' ')}: No such file or directory`);
                    }
                    break;
                case ':(){ :|:& };:':
                    await this.handleRickRoll('fork bomb');
                    break;
                case 'exit':
                    await this.handleExit();
                    break;
                case 'reboot':
                    await this.handleReboot();
                    break;
                case 'pwa':
                    await this.handlePWA(args);
                    break;
                case 'offline':
                    await this.showOfflineInfo();
                    break;
                case 'install':
                    await this.handleInstall();
                    break;
                default:
                    // Check for fork bomb pattern in the full command line
                    if (commandLine.includes(':(){ :|:& };:')) {
                        await this.handleRickRoll('fork bomb');
                        return;
                    }
                    await this.showError(`Command not found: ${command}. Type 'help' for available commands.`);
            }
        } catch (error) {
            await this.showError(`Error executing command: ${error.message}`);
        }
    }

    async downloadResume() {
        const downloadText = `
📥 Initializing resume download...

╔═══════════════════════════════════════════════╗
║                    DOWNLOADING RESUME
╚═══════════════════════════════════════════════╝

📄 File: AmitJ_CV.pdf
📊 Size: ~1.2 MB
🔗 Source: ./data/AmitJ_CV.pdf

📋 Resume Contents:
• Professional Experience (10+ years)
• Technical Skills & Certifications  
• Key Achievements & Metrics
• Project Portfolio
• Contact Information

💡 Tip: Use 'resume' (without --download) to view content in terminal
`;
        
        await this.typeText(downloadText, 10);
        
        // Trigger actual file download
        try {
            const link = document.createElement('a');
            link.href = './data/AmitJ_CV.pdf';
            link.download = 'AmitJ_CV.pdf';
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success message
            await this.typeText(`
🎉 Resume download initiated! Check your downloads folder.

⬇️  Download progress:
████████████████████████████████████████ 100%

✅ Download completed successfully!
📂 File saved to your default download location.`);

        } catch (error) {
            await this.showError('Download failed. Please try again or contact me directly.');
        }
    }

    async catFile(filename) {
        const files = {
            'about.txt': () => this.showAbout(),
            'contact.txt': () => this.showContact(),
            'achievements.txt': () => this.showAchievements(),
            'awards.txt': () => this.showAwards(),
            'linkedin.url': () => this.openLinkedIn(),
            'github.url': () => this.openGitHub(),
            'resume.pdf': () => this.showResume()
        };

        if (files[filename]) {
            await files[filename]();
        } else {
            await this.showError(`cat: ${filename}: No such file or directory`);
        }
    }

    async showResume() {
        const resumeText = `
╔═══════════════════════════════════════════════╗
║                            AMIT JOSHI
║   AWS | Terraform | CI/CD | Docker | GenAI | LLM | Python
╚═══════════════════════════════════════════════╝

🌐 LinkedIn: https://www.linkedin.com/in/oneamitj
📧 Email: one.amitj@gmail.com
🐙 GitHub: https://github.com/oneamitj
📍 Location: Melbourne, Victoria, Australia

💡 Tip: Use 'resume --download' to download PDF version

════════════════════════════════════════════════

📋 PROFESSIONAL SUMMARY
════════════════════════════════════════════════

Solution Architect specializing in the intersection of High-Scale 
Cloud Infrastructure and GenAI with deep expertise in AWS. Proven 
record of architecting LLM and GenAI systems, serverless multi-tenant 
platforms, and automated CI/CD pipelines.

Proven track record of modernizing legacy systems, optimizing costs, 
scaling services to hundreds of thousands of users, and leading 
cross-functional teams across multiple countries. Strong focus on 
reliability, compliance, and operational excellence in enterprise 
and consumer-facing applications.

════════════════════════════════════════════════

🛠️  CORE SKILLS
════════════════════════════════════════════════

☁️  Cloud Platforms:
    • AWS (Expert), GCP, Azure, DigitalOcean

🔧 DevOps Tools:
    • Terraform, CloudFormation, Pulumi, Docker, Kubernetes
    • GitHub Actions, Azure DevOps

🤖 GenAI/LLM:
    • OpenAI GPT, Anthropic Claude, Azure AI, AWS Bedrock
    • RAG, Prompt Engineering, LangChain, LangSmith
    • Pinecone, AWS OpenSearch VectorDB, AWS S3 Vector
    • Azure Document Intelligence, Amazon Textract
    • RAGAS, RAGChecker

💻 Programming Languages:
    • Python, Bash, Go, NodeJS

🔒 Monitoring & Security:
    • ELK, OpenSearch, Vanta, Drata, Wazuh, CloudFlare, Certbot, OWASP

🗄️  Database:
    • MySQL, PostgreSQL, DynamoDB, MongoDB, Redis

🌐 Other Technologies:
    • Linux, Windows, Nginx, Apache, HAProxy, Envoy Proxy, Kafka
    • Jenkins, Ansible

📋 Compliance:
    • HIPAA, SOC2, GDPR, PCI-DSS

════════════════════════════════════════════════

💼 PROFESSIONAL EXPERIENCE
════════════════════════════════════════════════

🏢 LEAPFROG TECHNOLOGY INC. | Seattle, Washington, USA

🎯 Solution Architect, DevOps | Dec 2023 - Present
   • Spearheaded AWS Generative AI Competency and APN Advanced membership
   • Architected 10+ production-level LLM and GenAI solutions with optimized RAG
   • Built HIPAA-compliant, multi-tenant serverless system with data isolation
   • Delivered 50% reduction in operational costs and 40% improvement in performance
   • Re-engineered document processing pipelines to scale throughput by 10x
   • Redesigned legacy EdTech products into automated, AI-driven systems
   • Led Addy AI: LLM-based U.S. healthcare back-office referral automation

🎯 Principal Engineer, DevOps | Dec 2021 - Dec 2023
   • Engineered multi-stage deployment architectures for diverse client projects
   • Scaled DevOps team from 5 to 25+ members
   • Increased supported data sources by 5x (8 to 40+ external integrations)
   • Streamlined CI/CD, increasing deployment frequency by 4x (monthly to weekly)
   • Led compliance initiatives for HIPAA, SOC2, and related regulatory standards
   • Re-architected ETL pipeline from batch-based to near real-time processing

🎯 Lead Engineer, DevOps | Dec 2020 - Dec 2021
   • Delivered DevOps solutions ensuring high availability and minimal downtime
   • Reduced deployment time by 20% for microservice-based product
   • Accelerated new service onboarding by ~90%
   • Built hybrid cloud setup with seamless in-house database integration
   • Optimized AWS-based product, reducing infrastructure costs by 30%
   • Automated CI/CD pipelines for microservices architecture

🏢 PROGRAMIZ.COM | Kathmandu, Nepal (Consultant)

🎯 DevOps Engineer Consultant | Sep 2022 - Mar 2025
   • Modernized decade-old Programiz.com deployment for high availability
   • Stabilized GKE-based infrastructure for Programiz Online Compiler
   • Engineered secure custom sandboxing solution for safer code execution
   • Reduced infrastructure costs by 50%
   • Scaled to 10+ compilers serving 150K+ concurrent users and 10M+ monthly users

🏢 HAMRO PATRO, INC. | Kathmandu, Nepal

🎯 Engineering Manager | Jul 2020 - Dec 2020
   • Led engineering team to build and launch products within HamroPatro app
   • Designed system architecture for cross-border mobile recharge and money transfer

🎯 Research Engineer / Sr. Research Engineer / Team Lead | Jul 2017 - Jun 2020
   • Built HamroStack: in-house deployment platform migrating from GCP App Engine
   • Led R&D for blockchain solutions across Bitcoin, Ethereum, and Hyperledger
   • Implemented server monitoring and observability using Prometheus and Grafana

🏢 JAVRA SOFTWARE PVT. LTD. | Kathmandu, Nepal

🎯 Software Engineer | May 2016 - June 2017
   • Enhanced eCommerce search functionality with fuzzy search
   • Added multilingual support for search systems

════════════════════════════════════════════════

🎓 EDUCATION
════════════════════════════════════════════════

Bachelor of Engineering in Computer Science
Kathmandu University, 2015

════════════════════════════════════════════════

🎤 SPEAKING ENGAGEMENTS
════════════════════════════════════════════════

🎙️ GenAI for Healthcare Providers and Digital Health Companies
   CIO.com Webcast | Co-hosted by AWS & Leapfrog Technology
   🔗 https://us.resources.cio.com/resources/genai-for-healthcare-providers-and-digital-health-companies-6/

🎙️ Dawn of the Agents — AWS User Group Meetup
   🔗 https://amitj.com.np/aug.ppt

════════════════════════════════════════════════

📝 References and recommendations available upon request

💡 For more details, visit: https://www.linkedin.com/in/oneamitj
📥 Use 'resume --download' to get the PDF version
`;
        
        await this.typeText(resumeText, 8);
    }

    async showCommandHelp(command) {
        const helpDocs = {
            help: {
                usage: 'help [--help]',
                description: 'Display available commands and their descriptions',
                examples: [
                    'help                 # Show all available commands',
                    'help --help          # Show this help message'
                ]
            },
            about: {
                usage: 'about [--help]',
                description: 'Display professional summary and biography',
                examples: [
                    'about                # Show complete professional profile',
                    'about --help         # Show this help message'
                ]
            },
            skills: {
                usage: 'skills [category] [--help]',
                description: 'Display technical skills and expertise',
                options: [
                    'category             # Show specific skill category'
                ],
                categories: [
                    'cloud_platforms      # AWS, GCP, Azure, DigitalOcean',
                    'devops_tools         # Terraform, Docker, Kubernetes',
                    'programming_languages # Python, Bash, Go, NodeJS',
                    'genai_technologies   # OpenAI, Claude, Bedrock, LangChain',
                    'monitoring_security  # Prometheus, Grafana, ELK, OpenSearch',
                    'infrastructure_automation # Nginx, HAProxy, Kafka',
                    'databases            # PostgreSQL, MySQL, DynamoDB, MongoDB, Redis',
                    'compliance           # HIPAA, SOC2, GDPR, PCI-DSS'
                ],
                examples: [
                    'skills               # Show all skills with categories',
                    'skills cloud_platforms # Show only cloud platform skills',
                    'skills --help        # Show this help message'
                ]
            },
            projects: {
                usage: 'projects [filter] [--help]',
                description: 'Display portfolio projects and achievements',
                options: [
                    'filter               # Filter projects by type (future feature)'
                ],
                examples: [
                    'projects             # Show all featured and notable projects',
                    'projects --help      # Show this help message'
                ]
            },
            experience: {
                usage: 'experience [--help]',
                description: 'Display professional work history and timeline',
                examples: [
                    'experience           # Show complete work history',
                    'experience --help    # Show this help message'
                ]
            },
            contact: {
                usage: 'contact [--help]',
                description: 'Display contact information and availability',
                examples: [
                    'contact              # Show all contact details',
                    'contact --help       # Show this help message'
                ]
            },
            ls: {
                usage: 'ls [--help]',
                description: 'List directory contents and available files',
                examples: [
                    'ls                   # List current directory contents',
                    'ls --help           # Show this help message'
                ]
            },
            pwd: {
                usage: 'pwd [--help]',
                description: 'Print working directory (show current path)',
                examples: [
                    'pwd                  # Show current directory path',
                    'pwd --help          # Show this help message'
                ]
            },
            cd: {
                usage: 'cd [directory] [--help]',
                description: 'Change current directory',
                options: [
                    'directory            # Target directory to navigate to'
                ],
                directories: [
                    '~, home              # Go to home directory',
                    'skills               # Navigate to skills directory',
                    'projects             # Navigate to projects directory',
                    'about                # Navigate to about directory',
                    '..                   # Go to parent directory',
                    '/                    # Go to root directory'
                ],
                examples: [
                    'cd                   # Go to home directory',
                    'cd skills            # Go to skills directory',
                    'cd ..                # Go to parent directory',
                    'cd --help           # Show this help message'
                ]
            },
            cat: {
                usage: 'cat <filename> [--help]',
                description: 'Display file contents',
                options: [
                    'filename             # Required: name of file to display'
                ],
                files: [
                    'about.txt            # Professional summary',
                    'contact.txt          # Contact information',
                    'achievements.txt     # Key career achievements',
                    'awards.txt           # Awards and recognition',
                    'resume.pdf           # Complete resume/CV',
                    'linkedin.url         # LinkedIn profile link',
                    'github.url           # GitHub profile link'
                ],
                examples: [
                    'cat about.txt        # Display professional summary',
                    'cat resume.pdf       # Display complete resume',
                    'cat achievements.txt # Show career achievements',
                    'cat --help          # Show this help message'
                ]
            },
            resume: {
                usage: 'resume [--download] [--help]',
                description: 'Display complete resume with professional experience and skills',
                options: [
                    '--download           # Download PDF version of resume'
                ],
                examples: [
                    'resume               # Show complete resume in terminal',
                    'resume --download    # Download PDF version',
                    'resume --help        # Show this help message'
                ]
            },
            cv: {
                usage: 'cv [--download] [--help]',
                description: 'Display complete curriculum vitae (same as resume)',
                options: [
                    '--download           # Download PDF version of CV'
                ],
                examples: [
                    'cv                   # Show complete CV in terminal',
                    'cv --download        # Download PDF version',
                    'cv --help            # Show this help message'
                ]
            },
            whoami: {
                usage: 'whoami [--help]',
                description: 'Display current user information and quick introduction',
                examples: [
                    'whoami               # Show quick user profile',
                    'whoami --help        # Show this help message'
                ]
            },
            clear: {
                usage: 'clear [--help]',
                description: 'Clear the terminal screen',
                examples: [
                    'clear                # Clear terminal output',
                    'clear --help         # Show this help message'
                ]
            },
            achievements: {
                usage: 'achievements [--help]',
                description: 'Display key career achievements and metrics',
                examples: [
                    'achievements         # Show all career achievements',
                    'achievements --help  # Show this help message'
                ]
            },
            awards: {
                usage: 'awards [--help]',
                description: 'Display competition wins and professional recognition',
                examples: [
                    'awards               # Show awards and recognition',
                    'awards --help        # Show this help message'
                ]
            },
            certifications: {
                usage: 'certifications [--help]',
                description: 'Display professional certifications and learning',
                examples: [
                    'certifications       # Show all certifications',
                    'certifications --help # Show this help message'
                ]
            },
            linkedin: {
                usage: 'linkedin [--help]',
                description: 'Display LinkedIn profile information and stats',
                examples: [
                    'linkedin             # Show LinkedIn profile info',
                    'linkedin --help      # Show this help message'
                ]
            },
            github: {
                usage: 'github [--help]',
                description: 'Display GitHub profile and repository information',
                examples: [
                    'github               # Show GitHub profile info',
                    'github --help        # Show this help message'
                ]
            },
            sudo: {
                usage: 'sudo <command> [--help]',
                description: 'Attempt to run commands with elevated privileges (easter egg)',
                examples: [
                    'sudo rm -rf /        # Try dangerous command (safe)',
                    'sudo --help          # Show this help message'
                ]
            },
            easter: {
                usage: 'easter [--help]',
                description: 'Activate hidden easter egg',
                examples: [
                    'easter               # Reveal the easter egg',
                    'easter --help        # Show this help message'
                ]
            },
            matrix: {
                usage: 'matrix [--help]',
                description: 'Enter the Matrix (special effect)',
                examples: [
                    'matrix               # Enter the Matrix',
                    'matrix --help        # Show this help message'
                ]
            },
            exit: {
                usage: 'exit [--help]',
                description: 'Exit the terminal',
                examples: [
                    'exit                 # Exit terminal',
                    'exit --help          # Show this help message'
                ]
            },
            reboot: {
                usage: 'reboot [--help]',
                description: 'Restart/reload the system',
                examples: [
                    'reboot               # Restart the system',
                    'reboot --help        # Show this help message'
                ]
            },
            oneai: {
                usage: 'oneai <message> [--help]',
                description: 'Ask AI questions about Amit and get intelligent responses',
                options: [
                    'message              # Required: your question or message'
                ],
                examples: [
                    'oneai "What are your main skills?"',
                    'oneai "Tell me about your AWS experience"',
                    'oneai "What projects have you worked on?"',
                    'oneai "How can you help my company?"',
                    'oneai --help          # Show this help message'
                ]
            },
            present: {
                usage: 'present <filename> [--help]',
                description: 'Open presentation slides in a new window',
                options: [
                    'filename             # Required: name of presentation file'
                ],
                files: [
                    'aug.ppt              # Dawn of the Agents - GenAI presentation'
                ],
                examples: [
                    'present aug.ppt      # Open AWS User Group presentation',
                    'present --help       # Show this help message'
                ]
            },
            lunch: {
                usage: 'lunch <filename> [--help]',
                description: 'Open training platforms and learning resources',
                options: [
                    'filename             # Required: name of training platform'
                ],
                files: [
                    'archmentor           # Next-Gen Solution Architect Training'
                ],
                examples: [
                    'lunch archmentor     # Open ArchMentor training platform',
                    'lunch --help         # Show this help message'
                ]
            }
        };
        
        const helpInfo = helpDocs[command];
        if (!helpInfo) {
            await this.showError(`No help available for command: ${command}`);
            return;
        }

        let helpText = `
╔═══════════════════════════════════════════════╗
║                    COMMAND HELP: ${command.toUpperCase().padEnd(16)}
╚═══════════════════════════════════════════════╝

📖 USAGE:
${helpInfo.usage}

📝 DESCRIPTION:
${helpInfo.description}
`;

        if (helpInfo.options) {
            helpText += `\n🔧 OPTIONS:\n`;
            helpInfo.options.forEach(option => {
                helpText += `${option}\n`;
            });
        }

        if (helpInfo.categories) {
            helpText += `\n📂 AVAILABLE CATEGORIES:\n`;
            helpInfo.categories.forEach(category => {
                helpText += `${category}\n`;
            });
        }

        if (helpInfo.directories) {
            helpText += `\n📁 AVAILABLE DIRECTORIES:\n`;
            helpInfo.directories.forEach(dir => {
                helpText += `${dir}\n`;
            });
        }

        if (helpInfo.files) {
            helpText += `\n📄 AVAILABLE FILES:\n`;
            helpInfo.files.forEach(file => {
                helpText += `${file}\n`;
            });
        }

        helpText += `\n💡 EXAMPLES:\n`;
        helpInfo.examples.forEach(example => {
            helpText += `${example}\n`;
        });

        helpText += `\n🎯 TIP: Most commands support --help or -h for detailed information`;

        await this.typeText(helpText, 8);
    }

    async showHelp() {
        const helpText = `
Available Commands:
==================
🏠 Navigation:
   ls          - List available directories and files
   pwd         - Show current directory path
   cd <dir>    - Change current directory
   cat <file>  - Display file contents

👨‍💻 About Me:
   about       - Professional summary and bio
   whoami      - Quick introduction
   skills      - Technical skills and expertise
   projects    - Portfolio projects and achievements
   experience  - Professional work history
   contact     - Contact information

🤖 AI Assistant:
   oneai <msg> - Ask AI questions about me

🏆 Career:
   achievements - Key career achievements and metrics
   awards      - Competition wins and recognition
   certifications - Professional certifications

📄 Resume/CV:
   resume      - Display resume in terminal
   resume --download - Download PDF resume
   cv          - Display CV in terminal (same as resume)
   cv --download - Download PDF CV

🔗 Links:
   linkedin    - Open LinkedIn profile
   github      - Open GitHub profile

🔧 System:
   clear       - Clear the terminal screen
   help        - Show this help message
   exit        - Exit terminal
   reboot      - Restart/reload the system

📱 PWA Commands:
   pwa status  - Show PWA installation status
   pwa install - Install portfolio as app
   pwa update  - Update to latest version
   install     - Quick install command
   offline     - Show offline capabilities

📊 Presentations:
   present <file> - Open presentation slides
                    Available: aug.ppt

🍽️  Lunch & Learn:
   lunch <file> - Open training platforms
                  Available: archmentor, career
   roadmap     - Open DevOps Learning Path

🎯 Special:
   easter      - Find the hidden easter egg!
   matrix      - Enter the Matrix
   sudo        - Try to gain admin access

Tip: Use arrow keys to navigate command history
`;
        await this.typeText(helpText, 10);
    }

    async showAbout() {
        const aboutText = `
╔═══════════════════════════════════════════════╗
║                          ABOUT AMIT JOSHI
╚═══════════════════════════════════════════════╝

🚀 Solution Architect | Cloud Infrastructure & GenAI

📍 Location: Melbourne, Victoria, Australia
🎓 Education: B.E. Computer Engineering, Kathmandu University (2015)
💼 Current Role: Solution Architect @ Leapfrog Technology Inc.
⏱️ Experience: 10+ years in DevOps & Cloud Engineering

🌟 Professional Summary:
═════════════════════════════════════════════════

Solution Architect specializing in the intersection of High-Scale 
Cloud Infrastructure and GenAI with deep expertise in AWS. Proven 
record of architecting LLM and GenAI systems, serverless multi-tenant 
platforms, and automated CI/CD pipelines.

Proven track record of modernizing legacy systems, optimizing costs, 
scaling services to hundreds of thousands of users, and leading 
cross-functional teams across multiple countries. Strong focus on 
reliability, compliance, and operational excellence in enterprise 
and consumer-facing applications.

🏆 Key Achievements:
═════════════════════════════════════════════════
• Spearheaded AWS Generative AI Competency and APN Advanced membership
• Architected 10+ production-level LLM and GenAI solutions
• Scaled document processing throughput by 10x (1000+ pages vs 100+)
• Optimized GenAI costs by 50% while boosting performance by 40%
• Scaled Programiz Online Compiler to 150K+ concurrent users, 10M+ monthly
• Scaled data processing by 500% (8 to 40+ external connections)
• Boosted CI/CD frequency by 400% (monthly to weekly deployments)
• Reduced deployment time by 20% and onboarding by 90%
• Designed HIPAA-compliant multi-tenant serverless systems

💡 Core Specializations:
═════════════════════════════════════════════════
• Cloud-Native Architecture (AWS Expert Level)
• GenAI/LLM Integration & Optimization
• Infrastructure as Code (Terraform, CloudFormation, Pulumi)
• HIPAA/SOC2/GDPR/PCI-DSS Compliance & Security
• DevOps Team Leadership & Scaling
• Multi-tenant Serverless Architecture
• Real-time Data Processing & ETL
• RAG Systems & Prompt Engineering

🎯 Current Focus:
════════════════════════════════
Based in Melbourne, Australia. Passionate about leveraging 
cutting-edge GenAI tools to ensure seamless deployment, 
operational excellence, and high availability while maintaining 
the highest standards of security and compliance.

🏅 Awards & Recognition:
• Ncell App Camp 2014 Winner (Corporate Solutions)
• Global Startup Weekend Kathmandu Winner (Techstars)
• CIO.com Webcast Speaker: GenAI for Healthcare (with AWS)
`;
        await this.typeText(aboutText, 10);
    }

    async showSkills(category) {
        try {
            const response = await fetch('./data/skills.json');
            const skills = await response.json();
            
            if (category) {
                if (skills[category]) {
                    await this.displaySkillCategory(category, skills[category]);
                } else {
                    await this.showError(`Skill category '${category}' not found. Available: ${Object.keys(skills).join(', ')}`);
                }
            } else {
                await this.displayAllSkills(skills);
            }
        } catch (error) {
            await this.showError('Error loading skills data');
        }
    }

    async displayAllSkills(skills) {
        let skillsText = `
╔═══════════════════════════════════════════════╗
║                        TECHNICAL SKILLS
╚═══════════════════════════════════════════════╝

`;
        
        const categoryDisplayNames = {
            'cloud_platforms': 'CLOUD PLATFORMS',
            'devops_tools': 'DEVOPS TOOLS',
            'programming_languages': 'PROGRAMMING LANGUAGES',
            'monitoring_security': 'MONITORING & SECURITY',
            'infrastructure_automation': 'INFRASTRUCTURE & AUTOMATION',
            'databases': 'DATABASES',
            'genai_technologies': 'GENAI TECHNOLOGIES',
            'compliance': 'COMPLIANCE & STANDARDS'
        };
        
        for (const [category, items] of Object.entries(skills)) {
            const displayName = categoryDisplayNames[category] || category.toUpperCase().replace('_', ' ');
            skillsText += `\n🔧 ${displayName}:\n`;
            skillsText += '━'.repeat(49) + '\n';
            
            items.forEach(skill => {
                const stars = skill.level === 'Expert' ? '★★★★★' : 
                             skill.level === 'Advanced' ? '★★★★☆' : 
                             skill.level === 'Intermediate' ? '★★★☆☆' : '★★☆☆☆';
                const years = skill.years ? ` (${skill.years})` : '';
                skillsText += `${skill.icon} ${skill.name.padEnd(25)} ${stars}${years}\n`;
            });
        }
        
        skillsText += `\n💡 Skill Levels: ★★★★★ Expert | ★★★★☆ Advanced | ★★★☆☆ Intermediate
📅 Years shown in parentheses indicate experience duration
🎯 Use 'skills <category>' to view specific category details`;
        await this.typeText(skillsText, 8); // Faster for skills since it's longer
    }

    async displaySkillCategory(category, items) {
        const categoryDisplayNames = {
            'cloud_platforms': 'CLOUD PLATFORMS',
            'devops_tools': 'DEVOPS TOOLS',
            'programming_languages': 'PROGRAMMING LANGUAGES',
            'monitoring_security': 'MONITORING & SECURITY',
            'infrastructure_automation': 'INFRASTRUCTURE & AUTOMATION',
            'databases': 'DATABASES',
            'genai_technologies': 'GENAI TECHNOLOGIES',
            'compliance': 'COMPLIANCE & STANDARDS'
        };
        
        const displayName = categoryDisplayNames[category] || category.toUpperCase().replace('_', ' ');
        
        let categoryText = `
╔═══════════════════════════════════════════════╗
║                        ${displayName.padStart(35)}
╚═══════════════════════════════════════════════╝

`;
        
        items.forEach((skill, index) => {
            const stars = skill.level === 'Expert' ? '★★★★★' : 
                         skill.level === 'Advanced' ? '★★★★☆' : 
                         skill.level === 'Intermediate' ? '★★★☆☆' : '★★☆☆☆';
            const years = skill.years ? ` (${skill.years} experience)` : '';
            
            categoryText += `${index + 1}. ${skill.icon} ${skill.name}\n`;
            categoryText += `   Level: ${skill.level} ${stars}\n`;
            if (skill.years) {
                categoryText += `   Experience: ${skill.years}\n`;
            }
            categoryText += '\n';
        });
        
        categoryText += `💡 Use 'skills' to view all categories\n`;
        categoryText += `🎯 Total skills in this category: ${items.length}`;
        
        await this.typeText(categoryText, 12);
    }

    async showProjects(filter) {
        try {
            const response = await fetch('./data/projects.json');
            const projects = await response.json();
            
            let projectText = `
╔═══════════════════════════════════════════════╗
║                      PORTFOLIO PROJECTS
╚═══════════════════════════════════════════════╝

🌟 FEATURED PROJECTS:
═════════════════════════════════════════════════

`;
            
            projects.featured_projects.forEach((project, index) => {
                projectText += `${index + 1}. ${project.name}\n`;
                projectText += `   Company: ${project.company}\n`;
                projectText += `   Period: ${project.period}\n`;
                projectText += `   Category: ${project.category}\n`;
                projectText += `   \n   ${project.description}\n`;
                projectText += `   \n   Tech Stack: ${project.technologies.join(', ')}\n`;
                projectText += `   \n   Key Achievements:\n`;
                project.achievements.forEach(achievement => {
                    projectText += `   • ${achievement}\n`;
                });
                projectText += '\n' + '─'.repeat(60) + '\n\n';
            });
            
            projectText += `\n💡 OTHER NOTABLE PROJECTS:\n`;
            projectText += '═════════════════════════════════════════════════\n\n';
            
            projects.other_projects.forEach((project, index) => {
                projectText += `${index + 1}. ${project.name} (${project.period})\n`;
                projectText += `   ${project.description}\n`;
                projectText += `   Tech: ${project.technologies.join(', ')}\n\n`;
            });
            
            await this.typeText(projectText, 8); // Faster since it's very long
        } catch (error) {
            await this.showError('Error loading projects data');
        }
    }

    async showExperience() {
        try {
            const response = await fetch('./data/experience.json');
            const experience = await response.json();
            
            let expText = `
╔═══════════════════════════════════════════════╗
║                    PROFESSIONAL EXPERIENCE
╚═══════════════════════════════════════════════╝

🎯 CURRENT ROLE:
═════════════════════════════════════════════════

${experience.current_role.title}
${experience.current_role.company} | ${experience.current_role.period}
${experience.current_role.location}

${experience.current_role.description}

Key Achievements:
`;
            
            experience.current_role.key_achievements.forEach(achievement => {
                expText += `• ${achievement}\n`;
            });
            
            expText += `\n📈 CAREER TIMELINE:\n`;
            expText += '═════════════════════════════════════════════════\n\n';
            
            experience.experience_timeline.forEach(job => {
                expText += `${job.title}\n`;
                expText += `${job.company} | ${job.period} (${job.duration})\n\n`;
                expText += `Highlights:\n`;
                job.highlights.forEach(highlight => {
                    expText += `• ${highlight}\n`;
                });
                expText += '\n' + '─'.repeat(50) + '\n\n';
            });
            
            expText += `🎓 EDUCATION:\n`;
            expText += `${experience.education.degree}\n`;
            expText += `${experience.education.university} (${experience.education.year})\n`;
            expText += `Specialization: ${experience.education.specialization}\n`;
            
            await this.typeText(expText, 8); // Faster since it's very long
        } catch (error) {
            await this.showError('Error loading experience data');
        }
    }

    async showContact() {
        const contactText = `
╔═══════════════════════════════════════════════╗
║                        CONTACT INFO
╚═══════════════════════════════════════════════╝

📧 Email:     one.amitj@gmail.com
🐙 GitHub:    github.com/oneamitj  
💼 LinkedIn:  linkedin.com/in/oneamitj
📍 Location:  Melbourne, Victoria, Australia
🏢 Company:   Leapfrog Technology Inc.

🤝 Let's Connect!
═════════════════════════════════════════════════

I'm always open to discussing:
• DevOps architecture and best practices
• GenAI/LLM integration strategies  
• AWS cloud solutions and optimization
• Infrastructure automation with Terraform
• HIPAA/SOC2 compliance implementations
• Team leadership and scaling DevOps teams
• Multi-tenant serverless architectures

Feel free to reach out for:
🎯 Collaboration opportunities
💼 Consulting and freelance projects
🤝 Networking and knowledge sharing
☕ Tech chat over virtual coffee!

🌟 Available for:
• Full-time opportunities (Solution Architect/Principal Engineer)
• Contract/consulting work (DevOps/GenAI projects)
• Speaking engagements and tech talks
• Mentoring junior engineers

📊 Response Time: Usually within 24 hours
🌍 Time Zone: Australian Eastern Time (AET, UTC+10/+11)
`;
        await this.typeText(contactText, 10);
    }

    async listDirectory() {
        let dirText = `
📁 Current directory: ${this.currentPath}
═════════════════════════════════════════════════

`;

        // Show different content based on current path
        if (this.currentPath === '/home/amit') {
            dirText += `drwxr-xr-x  about/            📁 Professional summary
drwxr-xr-x  skills/           📂 Technical skills directory
drwxr-xr-x  projects/         📂 Portfolio projects  
drwxr-xr-x  experience/       📂 Work history
drwxr-xr-x  contact/          📂 Contact information
drwxr-xr-x  career/           📂 DevOps learning path
-rw-r--r--  achievements.txt  📄 Key career achievements
-rw-r--r--  awards.txt        📄 Competition wins & recognition
-rw-r--r--  resume.pdf        📄 Download resume
-rwxr-xr-x  linkedin.url      🔗 LinkedIn profile
-rwxr-xr-x  github.url        🔗 GitHub repositories
-rwxr-xr-x  easter.exe        🎮 Hidden easter egg
-rwxr-xr-x  matrix.exe        🔮 Enter the Matrix

Total: 13 items`;
        } else if (this.currentPath === '/home/amit/skills') {
            dirText += `drwxr-xr-x  ..                📂 Parent directory
-rw-r--r--  cloud_platforms   📄 AWS, GCP, Azure expertise
-rw-r--r--  devops_tools      📄 Terraform, Docker, K8s
-rw-r--r--  programming       📄 Python, Bash, Go, JS
-rw-r--r--  genai_tech        📄 OpenAI, Claude, Bedrock
-rw-r--r--  monitoring        📄 Prometheus, Grafana, ELK
-rw-r--r--  compliance        📄 HIPAA, SOC2 standards

Total: 7 items`;
        } else if (this.currentPath === '/home/amit/projects') {
            dirText += `drwxr-xr-x  ..                📂 Parent directory
drwxr-xr-x  learning-list/    📂 GenAI Alignment Checker
drwxr-xr-x  addy-healthcare/  📂 HIPAA-compliant AI Platform
drwxr-xr-x  genai-platform/   📂 GenAI R&D Platform
drwxr-xr-x  evoke-medical/    📂 Remote Device Monitoring
drwxr-xr-x  mindera-atlas/    📂 Skin Atlas Data Warehouse
drwxr-xr-x  blockchain-systems/ 📂 Various blockchain projects

Total: 7 items`;
        } else if (this.currentPath === '/') {
            dirText += `drwxr-xr-x  home/             📂 User directories
drwxr-xr-x  usr/              📂 System utilities
drwxr-xr-x  var/              📂 Variable data
drwxr-xr-x  etc/              📂 Configuration files

Total: 4 items`;
        } else {
            // For other directories, show generic content
            dirText += `drwxr-xr-x  ..                📂 Parent directory
-rw-r--r--  info.txt          📄 Directory information

💡 Use 'cd ..' to go back or 'cd ~' to go home
Total: 2 items`;
        }

        dirText += `

💡 Navigation tips:
• Use 'cd <directory>' to change directories
• Use 'cd ..' to go to parent directory  
• Use 'cd ~' or 'cd' to go to home directory
• Use 'pwd' to see current path
`;
        await this.typeText(dirText, 10);
    }

    async catFile(filename) {
        switch(filename.toLowerCase()) {
            case 'about.txt':
                await this.showAbout();
                break;
            case 'contact.txt':
                await this.showContact();
                break;
            case 'achievements.txt':
                await this.showAchievements();
                break;
            case 'awards.txt':
                await this.showAwards();
                break;
            case 'resume.pdf':
                await this.typeText('\n📄 Opening resume.pdf...\n🔗 Resume download functionality would be implemented here\n💼 Contains detailed work history and technical skills\n');
                break;
            case 'linkedin.url':
                await this.openLinkedIn();
                break;
            case 'github.url':
                await this.openGitHub();
                break;
            default:
                await this.showError(`cat: ${filename}: No such file or directory`);
        }
    }

    async whoAmI() {
        const whoText = `
oneamitj@devops:~$ whoami

🚀 Amit Joshi - Solution Architect | Cloud Infrastructure & GenAI

Quick Facts:
• 10+ years in DevOps and Cloud Engineering
• Based in Melbourne, Australia
• AWS Expert | 10+ production-level GenAI solutions architected
• HIPAA/SOC2/GDPR/PCI-DSS compliance specialist
• Currently architecting solutions at Leapfrog Technology
`;
        await this.typeText(whoText, 12);
    }

    async showCurrentPath() {
        await this.typeText(`\n${this.currentPath}\n`);
    }

    async changeDirectory(directory) {
        if (!directory) {
            // cd with no arguments goes to home
            this.currentPath = '/home/amit';
            this.updateMainPrompt();
            await this.typeText(`\nChanged to: ${this.currentPath}\n`);
            return;
        }

        // Define available directories
        const availableDirectories = {
            '~': '/home/amit',
            'home': '/home/amit',
            'skills': '/home/amit/skills',
            'projects': '/home/amit/projects',
            'experience': '/home/amit/experience',
            'contact': '/home/amit/contact',
            'about': '/home/amit/about',
            '..': this.getParentDirectory(),
            '.': this.currentPath
        };

        if (directory === '/') {
            this.currentPath = '/';
            this.updateMainPrompt();
            await this.typeText(`\nChanged to: ${this.currentPath}\n`);
            return;
        }

        if (availableDirectories[directory]) {
            this.currentPath = availableDirectories[directory];
            this.updateMainPrompt();
            await this.typeText(`\nChanged to: ${this.currentPath}\n`);
        } else {
            await this.showError(`cd: ${directory}: No such directory`);
            await this.typeText(`\nAvailable directories: ${Object.keys(availableDirectories).join(', ')}\n`);
        }
    }

    getParentDirectory() {
        if (this.currentPath === '/' || this.currentPath === '/home/amit') {
            return '/';
        }
        const parts = this.currentPath.split('/');
        parts.pop();
        return parts.join('/') || '/';
    }

    async showEasterEgg() {
        const easterText = `
🎮 EASTER EGG ACTIVATED! 🎮

    ╔═════════════════════════════════╗
    ║          RETRO GAME OVER
    ║
    ║    🕹️  ACHIEVEMENT UNLOCKED! 🕹️
    ║
    ║  You found the secret command!
    ║
    ║  🏆 Master Terminal Navigator 🏆
    ║
    ║  Score: 1337 points
    ║  Level: DevOps Wizard
    ║
    ║    Press any key to continue...
    ╚═════════════════════════════════╝

Fun fact: This portfolio was built with pure vanilla JS,
no frameworks needed! Sometimes the old ways are the best ways. 🚀
`;
        await this.typeText(easterText, 15); // Easter egg can be a bit slower for effect
    }

    async showAchievements() {
        const achievementsText = `
╔═══════════════════════════════════════════════╗
║                      KEY ACHIEVEMENTS
╚═══════════════════════════════════════════════╝

📈 PERFORMANCE & SCALE:
═════════════════════════════════════════════════
🚀 Improved product performance by 10x (100+ to 1000+ pages)
📊 Scaled systems to handle 500% more data sources (8 → 40+)
⚡ Boosted CI/CD deployment frequency by 400% (monthly → weekly)
⏱️ Reduced deployment time by 20% and onboarding by 90%
🎯 Reduced new service onboarding time by 90%

💰 COST OPTIMIZATION:
═════════════════════════════════════════════════
💡 Optimized GenAI product performance by 40% while reducing costs by 50%
💰 Decreased AWS infrastructure costs by 30%
📉 Achieved significant cost savings through infrastructure optimization

👥 TEAM LEADERSHIP:
═════════════════════════════════════════════════
🎓 Spearheaded AWS Generative AI Competency and APN Advanced membership
📈 Scaled DevOps team from 5 to 25+ members
🏆 Architected 10+ production-level LLM and GenAI solutions
🎯 Led cross-functional teams across multiple countries

🏥 COMPLIANCE & SECURITY:
═════════════════════════════════════════════════
🔒 Built HIPAA-compliant multi-tenant serverless systems
🛡️ Led compliance initiatives for HIPAA, SOC2, GDPR, PCI-DSS
🏥 Designed secure healthcare data processing pipelines
🔐 Implemented data isolation and rapid tenant onboarding

🤖 GENAI INNOVATION:
═════════════════════════════════════════════════
🧠 Spearheaded company's AWS Generative AI Competency
🔬 Architected 10+ production-level LLM and GenAI solutions
⚡ Automated EdTech manual processes using GenAI
🎓 Improved educational alignment checking by 90% efficiency
🎤 Featured speaker on CIO.com webcast with AWS: "GenAI for Healthcare"

🌐 PROGRAMIZ.COM:
═════════════════════════════════════════════════
🖥️ Stabilized GKE-based infrastructure with near-zero downtime
🔒 Engineered secure custom sandboxing for safer code execution
💰 Reduced infrastructure costs by 50%
📈 Scaled to 150K+ concurrent users and 10M+ monthly users
`;
        await this.typeText(achievementsText, 10);
    }

    async showAwards() {
        const awardsText = `
╔═══════════════════════════════════════════════╗
║                    AWARDS & RECOGNITION
╚═══════════════════════════════════════════════╝

🏆 COMPETITION WINS:
═════════════════════════════════════════════════

🥇 Ncell App Camp 2014 (Corporate Solutions Winner)
   📅 December 2014 | 🏢 Issued by Ncell
   📱 Developed "Opinio" - Corporate decision-making app
   📊 Analyzed social media data for business insights
   🌟 Nation-level app development competition

🥇 Global Startup Weekend Kathmandu (Winner)
   📅 November 2014 | 🏢 Issued by Techstars
   🤖 Built sentiment analysis API for business analytics
   💼 Helped businesses analyze customer sentiments
   🌍 International startup competition

🎯 PROFESSIONAL RECOGNITION:
═════════════════════════════════════════════════

🚀 Led company to AWS APN Advanced Partner status
👥 Recognized for exceptional team leadership and growth
🏥 Successfully delivered multiple HIPAA-compliant solutions
💡 Innovation leader in GenAI integration and optimization

🎤 SPEAKING ENGAGEMENTS:
═════════════════════════════════════════════════

🎙️ CIO.com Webcast: GenAI for Healthcare Providers
   📅 Co-hosted by AWS and Leapfrog Technology
   🔗 https://us.resources.cio.com/resources/genai-for-healthcare-providers-and-digital-health-companies-6/
   👥 Co-speakers: Manu Chatterjee (VP/Head of AI, Leapfrog)
                    Jim Malone (Sr. Contributing Editor, CIO)
   📋 Topics: Moving GenAI past POC in healthcare, security
      and compliance at scale, real use cases, partner advantage

🎙️ Dawn of the Agents — AWS User Group Meetup
   🔗 https://amitj.com.np/aug.ppt
   📋 GenAI maturing into the age of autonomous agents

📈 IMPACT METRICS:
═════════════════════════════════════════════════
• 500% increase in system scale and capacity
• 400% improvement in deployment frequency
• 50% cost reduction with 40% performance improvement
• 90% reduction in manual processes through automation
`;
        await this.typeText(awardsText, 10);
    }

    async showCertifications() {
        const certificationsText = `
╔═══════════════════════════════════════════════╗
║                    CERTIFICATIONS & LEARNING
╚═══════════════════════════════════════════════╝

🎓 PROFESSIONAL CERTIFICATIONS:
═════════════════════════════════════════════════

🧠 Self-Awareness: Leading with Emotional Intelligence
   📅 January 2022 | 🏢 Dale Carnegie Digital
   🎯 Leadership and emotional intelligence development

💪 Secrets of Motivation
   📅 January 2022 | 🏢 Dale Carnegie Digital
   🎯 Team motivation and performance optimization

☁️ AWS EXPERTISE:
═════════════════════════════════════════════════
🏆 Led company to AWS APN Advanced Partner status
👥 Grew team from 5 to 25+ members
🎓 Expert-level knowledge across AWS services:
   • EC2, ECS, EKS, Lambda
   • RDS, S3, CloudFormation
   • Bedrock, SageMaker, Glue
   • VPC, IAM, CloudWatch

🤖 GENAI EXPERTISE:
═════════════════════════════════════════════════
• OpenAI GPT, Anthropic Claude, Azure AI, AWS Bedrock
• RAG (Retrieval-Augmented Generation)
• Prompt Engineering optimization
• LangChain, LangSmith, Pinecone
• Azure Document Intelligence, Amazon Textract
• RAGAS, RAGChecker

🛡️ COMPLIANCE EXPERTISE:
═════════════════════════════════════════════════
🏥 HIPAA Compliance (Expert level)
🔒 SOC2 Audit experience
🇪🇺 GDPR Compliance
💳 PCI-DSS Standards
🛡️ Security best practices implementation (OWASP)
`;
        await this.typeText(certificationsText, 10);
    }

    async openLinkedIn() {
        const linkedinText = `
🔗 Opening LinkedIn Profile...

Profile: linkedin.com/in/oneamitj
═════════════════════════════════════════════════

📊 Profile Stats:
• 500+ connections
• 273 profile views (past 7 days)
• 1,613 post impressions
• 80 search appearances

🌟 Recent Activity:
• Posted about AI-Assisted Programming
• Shared LeapTalk session on "Avoiding Over-Engineering in AWS"
• Active in DevOps and GenAI communities

💼 Connect with me for:
• DevOps architecture discussions
• GenAI integration strategies
• AWS cloud solutions
• Team leadership insights

🚀 Link: https://linkedin.com/in/oneamitj
`;
        await this.typeText(linkedinText, 10);
        // In a real implementation, you could use window.open()
    }

    async openGitHub() {
        const githubText = `
🐙 Opening GitHub Profile...

Profile: github.com/oneamitj
═════════════════════════════════════════════════

💻 Repositories:
• Infrastructure as Code (Terraform)
• DevOps automation scripts
• GenAI integration examples
• CI/CD pipeline templates

🔧 Technologies:
• Python, Go, Bash scripting
• Docker, Kubernetes configs
• AWS CloudFormation templates
• Monitoring and logging setups

⭐ Featured Projects:
• Multi-tenant serverless architectures
• HIPAA-compliant system designs
• GenAI optimization frameworks
• Hybrid cloud implementations

🚀 Link: https://github.com/oneamitj

Note: Some repositories may be private due to client confidentiality
`;
        await this.typeText(githubText, 10);
    }

    async handlePresent(filename) {
        const presentations = {
            'aug.ppt': {
                title: 'Dawn of the Agents',
                subtitle: 'GenAI Matures → The Age of Agents',
                path: 'aug.ppt/index.html',
                date: 'AWS User Group Meetup',
                speaker: 'Amit Joshi · Solutions Architect · Leapfrog Technology'
            }
        };

        if (!presentations[filename]) {
            await this.showError(`present: cannot open '${filename}': No such presentation file\n\nAvailable presentations:\n${Object.keys(presentations).map(f => `  • ${f}`).join('\n')}`);
            return;
        }

        const pres = presentations[filename];
        const presentText = `
📊 Opening Presentation...

╔═══════════════════════════════════════════════╗
║  ${pres.title.padEnd(45)}
║  ${pres.subtitle.padEnd(45)}
╚═══════════════════════════════════════════════╝

📅 Event: ${pres.date}
👤 Speaker: ${pres.speaker}
📄 File: ${filename}

🚀 Launching presentation in new window...
`;
        
        await this.typeText(presentText, 10);
        
        // Open the presentation in a new window
        window.open(pres.path, '_blank');
        
        await this.typeText(`\n✅ Presentation opened successfully!\n💡 Use arrow keys or click to navigate slides`);
    }

    async handleLunch(filename) {
        const lunchItems = {
            'archmentor': {
                title: 'ArchMentor',
                subtitle: 'Next-Gen Solution Architect Training',
                path: 'archmentor/index.html',
                description: 'Lead with the Product, Choose the Tech',
                type: 'Training Platform'
            },
            'career': {
                title: 'DevOps Learning Path',
                subtitle: 'Interactive Roadmap to DevOps Mastery',
                path: 'career/index.html',
                description: 'A 10-stage guided curriculum from foundations to GenAI',
                type: 'Learning Path'
            }
        };

        if (!lunchItems[filename]) {
            await this.showError(`lunch: cannot open '${filename}': No such file\n\nAvailable items:\n${Object.keys(lunchItems).map(f => `  • ${f}`).join('\n')}`);
            return;
        }

        const item = lunchItems[filename];
        const lunchText = `
🚀 Opening ${item.type}...

╔═══════════════════════════════════════════════╗
║  ${item.title.padEnd(45)}
║  ${item.subtitle.padEnd(45)}
╚═══════════════════════════════════════════════╝

📋 Description: ${item.description}
📄 File: ${filename}

🌐 Launching in new window...
`;
        
        await this.typeText(lunchText, 10);
        
        // Open the page in a new window
        window.open(item.path, '_blank');
        
        await this.typeText(`\n✅ ${item.type} opened successfully!`);
    }

    async handleSudo(args) {
        if (args.includes('rm') && args.includes('-rf')) {
            const dangerText = `
⚠️  DANGER ZONE DETECTED ⚠️

sudo: rm -rf /: Operation not permitted
Access denied. Nice try though! 😄

This is a portfolio website, not a real server.
No systems were harmed in the making of this command.

Fun fact: In real DevOps work, we use:
• Infrastructure as Code to prevent manual mistakes
• Proper access controls and permissions
• Backup and disaster recovery procedures
• Immutable infrastructure patterns

Safety first! 🛡️
`;
            await this.typeText(dangerText, 12);
        } else {
            const sudoText = `
🔒 sudo: Sorry, user amit is not in the sudoers file.
This incident will be reported to the administrator.

Just kidding! 😄 This is a portfolio website.
In real life, I practice the principle of least privilege:
• Users get only the permissions they need
• Regular audits of access rights
• Proper IAM policies and role-based access
• Multi-factor authentication everywhere

Security through proper design, not through obscurity! 🔐
`;
            await this.typeText(sudoText, 12);
        }
    }

    async showMatrix() {
        const matrixText = `
🔴 RED PILL DETECTED 🔴

01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100
01000001 01101101 01101001 01110100 01001010
01101111 01110011 01101000 01101001 00100001

Wake up, Neo... The Matrix has you...
Following the white rabbit led you here.

But in the real world, I work with:
• Container orchestration matrices (Kubernetes)
• Infrastructure matrices (multi-cloud, multi-region)
• Data matrices (ETL pipelines, data lakes)
• Service meshes (connecting all the dots)

The Matrix is everywhere... even in DevOps! 🤖

01000101 01111000 01101001 01110100 01101001
01101110 01100111 00100000 01001101 01100001
01110100 01110010 01101001 01111000 00101110
`;
        await this.typeText(matrixText, 20); // Matrix can be a bit slower for dramatic effect
    }

    async handleExit() {
        const exitText = `
🚪 Exiting terminal...

Goodbye! Thanks for exploring my portfolio.

Hope to connect with you soon! 🚀
`;
        await this.typeText(exitText, 12);
        // // Small delay before redirect for better UX
        setTimeout(() => {
            window.location.href = "about:blank";
        }, 333);
    }

    async handleRickRoll(command) {
        let rickRollText = '';
        
        if (command === 'sudo') {
            rickRollText = `
🔒 sudo: Attempting to gain root access...

Checking credentials...
██████████████████████████████████████ 100%

Access DENIED! But wait... 🤔

Never gonna give you up! 🎶
Never gonna let you down! 🎵
Never gonna run around and desert you! 🎤

You've been RICK ROLLED! 😄

(Trying to sudo your way into my system? Nice try!)
`;
        } else if (command.includes('rm') && command.includes('-rf')) {
            rickRollText = `
⚠️  DANGER: Attempting to delete everything...

$ ${command}
Starting deletion process...

Deleting: resume.pdf ........................... ✓ DELETED
Deleting: achievements.txt ..................... ✓ DELETED
Deleting: linkedin.url ......................... ✓ DELETED
Deleting: github.url ........................... ✓ DELETED
Deleting: contact.txt .......................... ✓ DELETED

OH NO! You're deleting my portfolio! 😱

Deleting: skills/ .............................. ❌ BLOCKED
Deleting: projects/ ............................ ❌ BLOCKED

SYSTEM PROTECTION ACTIVATED! 🛡️

Wait... something's not right here... 🤔

Never gonna give you up! 🎶
Never gonna let you down! 🎵
Never gonna run around and desert you! 🎤

You've been RICK ROLLED! 😄

(Trying to nuke my portfolio? That's destructive!)
Don't worry, all files are safe and sound! 💾
`;
        } else if (command === 'fork bomb') {
            rickRollText = `
💣 FORK BOMB DETECTED!

:(){ :|:& };:

Creating infinite processes...
Process 1: ████████████████████████████████████████ 
Process 2: ████████████████████████████████████████ 
Process 3: ████████████████████████████████████████ 
Process ∞: ████████████████████████████████████████ 

SYSTEM OVERLOAD! But actually... 🤔

Never gonna give you up! 🎶
Never gonna let you down! 🎵
Never gonna run around and desert you! 🎤

You've been RICK ROLLED! 😄

(Fork bomb? Really? That's hardcore!)
`;
        } else {
            // Default rick roll for other commands like vim, nano
            rickRollText = `
🎵 Opening ${command}...

Loading editor interface...
██████████████████████████████████████ 100%

Wait... something's not right here... 🤔

Never gonna give you up! 🎶
Never gonna let you down! 🎵
Never gonna run around and desert you! 🎤

You've been RICK ROLLED! 😄

(You tried to be too smart with '${command}', didn't you?)
`;
        }
        
        await this.typeText(rickRollText, 12);
        
        // Small delay before redirect
        setTimeout(() => {
            window.location.href = 'https://kutt.it/amitj-exit';
        }, 2000);
    }

    async handleReboot() {
        const rebootText = `
🔄 System reboot initiated...

Shutting down services:
[  OK  ] Stopped terminal.service
[  OK  ] Stopped skills.service  
[  OK  ] Stopped projects.service
[  OK  ] Stopped contact.service

Preparing for restart...
██████████████████████████████████████ 100%

Rebooting system...

See you in a moment! 🚀
`;
        await this.typeText(rebootText, 10);
        
        // Small delay before reload for better UX
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    // PWA-related command handlers
    async handlePWA(args) {
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand) {
            await this.showPWAStatus();
            return;
        }
        
        switch (subCommand) {
            case 'status':
                await this.showPWAStatus();
                break;
            case 'install':
                await this.handlePWAInstall();
                break;
            case 'update':
                await this.handlePWAUpdate();
                break;
            case 'help':
                await this.showPWAHelp();
                break;
            default:
                await this.showError(`Unknown PWA command: ${subCommand}. Use 'pwa help' for available options.`);
        }
    }

    async showPWAStatus() {
        const status = window.pwaManager ? window.pwaManager.getPWAStatus() : null;
        
        if (!status) {
            await this.typeText(`
❌ PWA Manager not available
`, 10);
            return;
        }

        const statusText = `
╔═══════════════════════════════════════════════╗
║                    PWA STATUS
╚═══════════════════════════════════════════════╝

📱 Progressive Web App Information:
═════════════════════════════════════════════════

🔧 Service Worker: ${status.hasServiceWorker ? '✅ Supported' : '❌ Not Supported'}
📲 Installation: ${status.isInstalled ? '✅ Installed' : '❌ Not Installed'}
🖥️  Standalone Mode: ${status.isStandalone ? '✅ Running as App' : '❌ Running in Browser'}
⬇️  Can Install: ${status.canInstall ? '✅ Available' : '❌ Not Available'}
🌐 Online Status: ${status.isOnline ? '✅ Online' : '❌ Offline'}

💡 Available PWA Commands:
═════════════════════════════════════════════════
• pwa status   - Show current PWA status
• pwa install  - Install portfolio as app
• pwa update   - Update to latest version
• pwa help     - Show PWA command help
• install      - Quick install command
• offline      - Show offline capabilities

${status.canInstall ? '🚀 Ready to install! Type "pwa install" or "install"' : ''}
${status.isInstalled ? '🎉 App is installed and ready to use!' : ''}
`;

        await this.typeText(statusText, 8);
    }

    async handlePWAInstall() {
        if (!window.pwaManager) {
            await this.showError('PWA Manager not available');
            return;
        }

        await this.typeText(`
📲 Installing portfolio as Progressive Web App...

╔═══════════════════════════════════════════════╗
║                    INSTALLING PWA
╚═══════════════════════════════════════════════╝

`, 10);

        const result = await window.pwaManager.installPWA();
        
        const installText = `
${result.success ? '✅' : '❌'} ${result.message}

${result.success ? `
🎉 Installation Benefits:
• Access from home screen/desktop
• Faster loading with offline support
• App-like experience without browser UI
• Background updates
• Push notifications (coming soon)

📱 Look for "AmitJ Terminal" on your device!
` : `
💡 Alternative Access Methods:
• Bookmark this page for quick access
• Add to home screen manually (mobile)
• Use browser's "Install App" option
`}
`;

        await this.typeText(installText, 10);
    }

    async handlePWAUpdate() {
        if (!window.pwaManager) {
            await this.showError('PWA Manager not available');
            return;
        }

        await this.typeText(`
🔄 Checking for updates...

╔═══════════════════════════════════════════════╗
║                    UPDATING PWA
╚═══════════════════════════════════════════════╝

`, 10);

        const result = await window.pwaManager.updatePWA();
        
        const updateText = `
${result.success ? '✅' : '❌'} ${result.message}

${result.success ? `
📦 Update Features:
• Latest portfolio content
• Performance improvements
• Bug fixes and enhancements
• New PWA capabilities
` : `
💡 Manual Update Options:
• Refresh browser (Ctrl+F5 / Cmd+R)
• Clear browser cache
• Reinstall the PWA
`}
`;

        await this.typeText(updateText, 10);
    }

    async showPWAHelp() {
        const helpText = `
╔═══════════════════════════════════════════════╗
║                    PWA COMMANDS HELP
╚═══════════════════════════════════════════════╝

📱 Progressive Web App Commands:
═════════════════════════════════════════════════

pwa status     Show current PWA installation status
pwa install    Install portfolio as a native app
pwa update     Update to the latest version
pwa help       Show this help message

install        Quick command to install PWA
offline        Show offline capabilities info

🌟 What is a PWA?
═════════════════════════════════════════════════
Progressive Web Apps combine the best of web and mobile apps:

✅ Install like a native app
✅ Work offline with cached content
✅ Fast loading and performance
✅ Automatic updates
✅ App-like experience
✅ Cross-platform compatibility

📲 Installation Benefits:
═════════════════════════════════════════════════
• Access from home screen/desktop
• No browser address bar
• Faster loading times
• Offline browsing capability
• Background updates
• Native app-like feel

💡 Try: 'pwa install' to get started!
`;

        await this.typeText(helpText, 8);
    }

    async handleInstall() {
        // Quick install command - same as pwa install
        await this.handlePWAInstall();
    }

    async showOfflineInfo() {
        const isOnline = navigator.onLine;
        const offlineText = `
╔═══════════════════════════════════════════════╗
║                    OFFLINE CAPABILITIES
╚═══════════════════════════════════════════════╝

🌐 Current Status: ${isOnline ? '✅ Online' : '❌ Offline'}
📶 Network: ${isOnline ? 'Connected' : 'Disconnected'}

📱 Offline Features:
═════════════════════════════════════════════════

✅ Core Functionality Available:
• Complete portfolio browsing
• All commands work normally  
• Skills, projects, experience data
• Contact information
• Resume viewing
• Terminal interface

✅ Cached Content:
• HTML, CSS, JavaScript files
• JSON data files
• Fonts and styling
• Essential assets

❌ Limited When Offline:
• Resume PDF download
• External links (LinkedIn, GitHub)
• Real-time updates
• Web font loading (fallback fonts used)

🔄 Automatic Sync:
• Updates download when connection restored
• Background sync for improved performance
• Smart caching strategies

💡 Installation Tip:
Install as PWA for the best offline experience!
Type 'pwa install' to get started.

${!isOnline ? `
📱 You're currently offline, but everything still works!
The portfolio is fully functional thanks to service worker caching.
` : ''}
`;

        await this.typeText(offlineText, 8);
    }

    // Essential method for auto-scrolling functionality
    scrollToBottom() {
        // Use requestAnimationFrame for smooth scrolling performance
        requestAnimationFrame(() => {
            // Scroll the output element to the bottom
            this.output.scrollTop = this.output.scrollHeight;
            
            // Also scroll the main terminal container if needed
            const terminal = document.getElementById('terminal');
            if (terminal) {
                terminal.scrollTop = terminal.scrollHeight;
            }
            
            // Scroll the window itself if content exceeds viewport
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'auto' // Use 'auto' instead of 'smooth' for real-time typing
            });
        });
    }


    async handleOneAI(userMessage) {
        try {
            // Show loading message
            await this.typeText(`
🤖 🔄 Thinking...\n\n
`);
            const xft0 = Date.now();
            const tokenHeaders = new Headers();
            tokenHeaders.append("X-Factor", xft0.toString());

            const tokenResponse = await fetch("https://oneai-proxy.vercel.app/t0", {
                method: "GET",
                headers: tokenHeaders,
                redirect: "follow"
            });

            if (!tokenResponse.ok) {
                throw new Error(`Failed to get token: ${tokenResponse.status}`);
            }

            const tokenData = await tokenResponse.json();
            const token = tokenData.token;
            const xfp0 = Date.now();
            const aiHeaders = new Headers();
            aiHeaders.append("X-Factor", xfp0.toString());
            aiHeaders.append("Content-Type", "text/plain");
            aiHeaders.append("Authorization", `Bearer ${token}`);

            const aiResponse = await fetch("https://oneai-proxy.vercel.app/p0", {
                method: "POST",
                headers: aiHeaders,
                body: userMessage,
                redirect: "follow"
            });

            if (!aiResponse.ok) {
                throw new Error(`AI request failed: ${aiResponse.status}`);
            }

            const aiResult = await aiResponse.text();

            // Display the AI response
            const responseText = aiResult;

            await this.typeText(responseText, 8);

        } catch (error) {
            await this.showError(`OneAI Error: ${error.message}`);
            await this.typeText(`
💡 Alternative: Try 'about', 'skills', or 'experience' for detailed info
`);
        }
    }

    async showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        this.output.appendChild(errorDiv);
        this.scrollToBottom();
    }

    clearScreen() {
        this.output.innerHTML = '';
        // this.showPrompt();
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});
