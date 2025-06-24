// Terminal functionality with command handling and typewriter effects

class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('input');
        this.promptElement = document.getElementById('main-prompt'); // Reference to the main prompt
        this.clockElement = document.getElementById('nepal-clock');
        this.currentPath = '/home/amit';
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
        this.showWelcome();
        this.startClock();
    }

    // Clock functionality for Nepal Time (NPT, UTC+5:45)
    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        // Get current time and convert to Nepal Time (UTC+5:45)
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const nepalTime = new Date(utc + (5.75 * 3600000)); // NPT is UTC+5:45
        
        const hours = String(nepalTime.getHours()).padStart(2, '0');
        const minutes = String(nepalTime.getMinutes()).padStart(2, '0');
        const seconds = String(nepalTime.getSeconds()).padStart(2, '0');
        
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
║  🎯 8+ Years Experience | 🎓 B.E. Computer Science
║  📍 Kathmandu, Nepal
║
║  Type 'help' to see available commands
║  Type 'about' to learn more about me
╚═══════════════════════════════════════════════╝

Boot sequence complete. Ready for commands...

🌟 Quick Facts:
• AWS Expert
• Led team growth from 4 to 20+ AWS certified engineers
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
        const lines = text.split('\n');
        for (const line of lines) {
            const div = document.createElement('div');
            this.output.appendChild(div);
            
            let charCount = 0;
            for (const char of line) {
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
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            this.input.value = '';
            
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

    async executeCommand(commandLine) {
        const parts = commandLine.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

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
                case 'sudo':
                    await this.handleSudo(args);
                    break;
                case 'matrix':
                    await this.showMatrix();
                    break;
                default:
                    await this.showError(`Command not found: ${command}. Type 'help' for available commands.`);
            }
        } catch (error) {
            await this.showError(`Error executing command: ${error.message}`);
        }
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

🏆 Career:
   achievements - Key career achievements and metrics
   awards      - Competition wins and recognition
   certifications - Professional certifications

🔗 Links:
   linkedin    - Open LinkedIn profile
   github      - Open GitHub profile

🔧 System:
   clear       - Clear the terminal screen
   help        - Show this help message

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

🚀 Dynamic DevOps and GenAI Solution Architect

📍 Location: Kathmandu, Bāgmatī, Nepal
🎓 Education: B.E. Computer Science, Kathmandu University (2015)
💼 Current Role: Solution Architect @ Leapfrog Technology Inc.
⏱️ Experience: 8+ years in DevOps & Cloud Engineering

🌟 Professional Summary:
═════════════════════════════════════════════════

Dynamic DevOps and GenAI developer with deep expertise in AWS, 
Terraform, Kubernetes, and modern CI/CD pipelines, alongside 
hands-on experience in developing and optimizing LLM workflows 
and integrating cloud-native GenAI solutions.

Proven ability to design scalable, secure, and cost-efficient 
infrastructures, including HIPAA-compliant and multi-tenant 
systems. Skilled at leading cross-functional teams, driving 
GenAI innovation, and improving product performance by up to 40% 
while cutting costs by 50%.

🏆 Key Achievements:
═════════════════════════════════════════════════
• Led AWS efforts earning APN Advanced membership
• Grew certified engineers from 4 to 20+ team members
• Improved product performance by 10x (100+ to 1000+ pages)
• Optimized GenAI costs by 50% while boosting performance by 40%
• Scaled data processing by 500% (8 to 40+ external connections)
• Boosted CI/CD frequency by 400% (monthly to weekly deployments)
• Reduced deployment time by 20% and onboarding by 90%
• Designed HIPAA-compliant multi-tenant serverless systems

💡 Core Specializations:
═════════════════════════════════════════════════
• Cloud-Native Architecture (AWS Expert Level)
• GenAI/LLM Integration & Optimization
• Infrastructure as Code (Terraform, CloudFormation)
• HIPAA/SOC2 Compliance & Security
• DevOps Team Leadership & Scaling
• Multi-tenant System Architecture
• Real-time Data Processing & ETL

🎯 Current Focus:
═════════════════════════════════════════════════
Passionate about leveraging cutting-edge GenAI tools to ensure 
seamless deployment, operational excellence, and high availability
while maintaining the highest standards of security and compliance.

🏅 Awards & Recognition:
• Ncell App Camp 2014 Winner (Corporate Solutions)
• Global Startup Weekend Kathmandu Winner (Techstars)
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
            'infrastructure_automation': 'INFRASTRUCTURE AUTOMATION',
            'genai_technologies': 'GENAI TECHNOLOGIES',
            'compliance': 'COMPLIANCE & STANDARDS'
        };
        
        for (const [category, items] of Object.entries(skills)) {
            const displayName = categoryDisplayNames[category] || category.toUpperCase().replace('_', ' ');
            skillsText += `\n🔧 ${displayName}:\n`;
            skillsText += '━'.repeat(60) + '\n';
            
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
            'infrastructure_automation': 'INFRASTRUCTURE AUTOMATION',
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
📍 Location:  Kathmandu, Bāgmatī, Nepal
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
🌍 Time Zone: Nepal Time (NPT, UTC+5:45)
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
            dirText += `drwxr-xr-x  about/            � Professional summary
drwxr-xr-x  skills/           📂 Technical skills directory
drwxr-xr-x  projects/         📂 Portfolio projects  
drwxr-xr-x  experience/       📂 Work history
drwxr-xr-x  contact/          📂 Contact information
-rw-r--r--  achievements.txt  📄 Key career achievements
-rw-r--r--  awards.txt        📄 Competition wins & recognition
-rw-r--r--  resume.pdf        📄 Download resume
-rwxr-xr-x  linkedin.url      🔗 LinkedIn profile
-rwxr-xr-x  github.url        🔗 GitHub repositories
-rwxr-xr-x  easter.exe        🎮 Hidden easter egg
-rwxr-xr-x  matrix.exe        � Enter the Matrix

Total: 12 items`;
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
drwxr-xr-x  learning-list/    � GenAI Alignment Checker
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
-rw-r--r--  info.txt          � Directory information

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

🚀 Amit Joshi - DevOps Engineer & GenAI Solution Architect

Quick Facts:
• 8+ years in DevOps and Cloud Engineering
• AWS Expert with 20+ certified team members led
• GenAI enthusiast optimizing LLM workflows
• HIPAA/SOC2 compliance specialist
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
⏱️ Reduced deployment time by 20%
🎯 Reduced new service onboarding time by 90%

💰 COST OPTIMIZATION:
═════════════════════════════════════════════════
💡 Optimized GenAI product performance by 40% while reducing costs by 50%
💰 Decreased AWS infrastructure costs by 30%
📉 Achieved significant cost savings through infrastructure optimization

👥 TEAM LEADERSHIP:
═════════════════════════════════════════════════
🎓 Led team growth from 4 to 20+ AWS certified engineers
📈 Expanded DevOps team from 5 to 20+ members
🏆 Achieved AWS APN Advanced Partner status for company
🎯 Established company's GenAI development services

🏥 COMPLIANCE & SECURITY:
═════════════════════════════════════════════════
🔒 Built HIPAA-compliant multi-tenant serverless systems
🛡️ Conducted successful SOC2 compliance audits
🏥 Designed secure healthcare data processing pipelines
🔐 Implemented data isolation and rapid tenant onboarding

🤖 GENAI INNOVATION:
═════════════════════════════════════════════════
🧠 Spearheaded company's GenAI product development
🔬 Researched and established GenAI development services
⚡ Automated EdTech manual processes using GenAI
🎓 Improved educational alignment checking by 90% efficiency
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
👥 Grew team from 4 to 20+ AWS certified engineers
🎓 Expert-level knowledge across AWS services:
   • EC2, ECS, EKS, Lambda
   • RDS, S3, CloudFormation
   • Bedrock, SageMaker, Glue
   • VPC, IAM, CloudWatch

🤖 GENAI EXPERTISE:
═════════════════════════════════════════════════
• OpenAI GPT-4, Claude, Llama models
• RAG (Retrieval-Augmented Generation)
• Prompt Engineering optimization
• Azure AI Foundry integration
• AWS Bedrock implementation

🛡️ COMPLIANCE EXPERTISE:
═════════════════════════════════════════════════
🏥 HIPAA Compliance (Expert level)
🔒 SOC2 Audit experience
🛡️ Security best practices implementation
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

    async showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        this.output.appendChild(errorDiv);
        this.scrollToBottom();
    }

    clearScreen() {
        this.output.innerHTML = '';
        this.showPrompt();
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});
