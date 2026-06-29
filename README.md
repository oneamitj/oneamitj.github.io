# Retro DevOps Portfolio - Amit Joshi

Welcome to my Retro DevOps Portfolio! This project showcases my 11+ years of experience in DevOps, AWS cloud architecture, and GenAI integration through a nostalgic command-line interface style reminiscent of classic computing.

## 🚀 About This Portfolio

This interactive terminal-based portfolio demonstrates my expertise in:
- **Cloud Architecture**: AWS Expert with APN Advanced Partner & AWS GenAI Competency
- **DevOps Engineering**: Terraform, Kubernetes, Docker, CI/CD
- **GenAI Integration**: 10+ production LLM solutions, 40% performance improvement, 50% cost reduction
- **Team Leadership**: Grew teams from 5 to 25+ engineers
- **Compliance**: HIPAA, SOC2, GDPR, PCI-DSS compliant system design

## 🎯 Features

- **Progressive Web App (PWA)**: Installable as native app with offline support
- **Interactive Command-Line Interface**: Navigate using familiar terminal commands
- **AI Assistant (OneAI)**: Ask questions about my experience and skills
- **Real-time Typewriter Effects**: Authentic retro computing experience
- **Comprehensive Portfolio**: Skills, projects, experience, achievements
- **CRT Monitor Effects**: Nostalgic visual styling with scan lines
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Functionality**: Complete portfolio access without internet
- **Service Worker**: Background caching and updates
- **Easter Eggs**: Hidden commands for the curious explorer
- **Command History**: Navigate previous commands with arrow keys
- **Local Time Clock**: Real-time clock showing Amit's current timezone

## 🛠️ Technologies Used

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no frameworks!)
- **PWA**: Service Worker, Web App Manifest, Background Sync
- **AI Integration**: OneAI assistant backed by Pinecone vector store (RAG)
- **Styling**: Custom CSS with CRT effects, retro fonts
- **Fonts**: VT323, Press Start 2P (Google Fonts)
- **Data**: JSON-based content management + Markdown CV
- **Caching**: Advanced service worker with cache strategies
- **SEO**: Sitemap, robots.txt, structured metadata
- **Security**: .well-known/security.txt, HTTPS-only PWA
- **Hosting**: GitHub Pages with custom domain (amitj.me)

## 📁 Project Structure

```
oneamitj.github.io/
├── index.html              # Main HTML file with PWA meta tags
├── 404.html                # Custom 404 page
├── manifest.json           # PWA manifest configuration
├── sw.js                   # Service worker for offline functionality
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine crawling rules
├── humans.txt              # Credits and technology colophon
├── browserconfig.xml       # Browser configuration for Windows tiles
├── CNAME                   # Custom domain configuration
├── _config.yml             # Jekyll/GitHub Pages config
├── .well-known/
│   └── security.txt        # Security contact information
├── css/
│   ├── main.css            # Core styling with PWA support
│   ├── terminal.css        # Terminal-specific styles
│   └── retro-theme.css     # Retro CRT effects and animations
├── js/
│   ├── terminal.js         # Main terminal logic with PWA integration
│   ├── commands.js         # Command processing and utilities
│   ├── typewriter.js       # Typewriter effects engine
│   └── pwa.js              # PWA management and installation
├── data/
│   ├── skills.json         # Technical skills with GenAI technologies
│   ├── projects.json       # Portfolio projects including GenAI work
│   ├── experience.json     # Professional experience timeline
│   ├── AmitJ_CV.md         # CV in Markdown format
│   └── AmitJ_CV.pdf        # Downloadable resume/CV
├── facts/                  # OneAI knowledge base (Pinecone vector store)
│   ├── 01-personal-identity.md
│   ├── 02-education.md
│   ├── ...                 # 17 structured knowledge files
│   ├── upload_to_pinecone.py  # Vector DB upload script
│   └── requirements.txt    # Python dependencies for upload
├── assets/
│   └── fonts/
│       └── terminal-font.css # Custom terminal font definitions
├── icons/                  # PWA icons for all device sizes
│   ├── favicon.ico
│   ├── icon-16x16.png ... icon-512x512.png
│   └── icon.png
├── screenshots/            # Portfolio screenshots
│   ├── desktop-wide.png
│   └── mobile-narrow.png
├── archmentor/             # ArchMentor project page
│   └── index.html
├── career/                 # Career page
│   └── index.html
├── cv/                     # CV/Resume viewer page
│   └── index.html
├── resume/                 # Resume page (alternate route)
├── ijobber/                # iJobber app showcase
│   ├── index.html
│   ├── privacy.html
│   └── iJobber-*.png       # App screenshots
├── aug.ppt/                # Presentation page
│   ├── index.html
│   └── narration.html
└── README.md               # This file
```

## 🚦 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oneamitj/oneamitj.github.io.git
   cd oneamitj.github.io
   ```

2. **Serve locally (recommended):**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000` to view the portfolio.

4. **For production deployment:**
   Upload all files to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

> **Note**: The portfolio works best when served over HTTP/HTTPS. PWA features require HTTPS in production.

## 💻 Usage Guide

Once the portfolio loads, you'll see a retro terminal interface. Here are the main commands:

### Navigation Commands
- `help` - Show all available commands
- `ls` - List available files and directories
- `pwd` - Show current directory path
- `cd <dir>` - Change current directory
- `clear` - Clear the terminal screen

### Portfolio Commands
- `about` - Professional summary and biography
- `skills` - Technical skills and expertise
- `projects` - Portfolio projects and achievements
- `experience` - Professional work history
- `contact` - Contact information and social links

### AI Assistant Commands
- `oneai <message>` - Ask AI questions about my experience and skills
- `oneai "What projects have you worked on?"` - Example query
- `oneai "How can you help my company?"` - Business-focused query

### PWA Commands
- `pwa status` - Show PWA installation status
- `pwa install` - Install portfolio as native app
- `pwa update` - Update to latest version
- `pwa help` - Show PWA command help
- `install` - Quick install command
- `offline` - Show offline capabilities

### Resume/CV Commands
- `resume` - Display resume in terminal
- `resume --download` - Download PDF resume
- `cv` - Display CV in terminal (same as resume)
- `cv --download` - Download PDF CV

### Career Commands
- `achievements` - Key career achievements and metrics
- `awards` - Competition wins and recognition
- `certifications` - Professional certifications

### File Operations
- `cat <filename>` - Display specific file contents
  - `cat about.txt` - Professional summary
  - `cat contact.txt` - Contact information
  - `cat achievements.txt` - Career achievements
  - `cat resume.pdf` - Complete resume

### Social Links
- `linkedin` - Display LinkedIn profile information
- `github` - Display GitHub profile and repositories

### Fun Commands
- `easter` - Hidden easter egg
- `matrix` - Enter the Matrix
- `sudo` - Try to gain admin access (spoiler: it won't work!)
- `exit` - Exit terminal
- `reboot` - Restart/reload the system

### Special Features
- **Command History**: Use ↑/↓ arrow keys to navigate previous commands
- **Command Interruption**: Press Ctrl+C to stop long-running commands
- **Auto-completion**: Type commands and use tab for suggestions (future feature)
- **Help System**: Add `--help` to any command for detailed information

## 🤖 OneAI Integration

The portfolio features an intelligent AI assistant powered by custom OneAI integration:

### Features
- **Natural Language Queries**: Ask questions about my experience in plain English
- **Contextual Responses**: AI understands my background and provides relevant answers
- **Real-time Processing**: Fast response times with loading indicators
- **Comprehensive Knowledge**: Knows about my skills, projects, experience, and achievements

### Example Queries
```bash
oneai "What are your main technical skills?"
oneai "Tell me about your AWS experience"
oneai "What GenAI projects have you worked on?"
oneai "How can you help my company with DevOps?"
oneai "What's your experience with HIPAA compliance?"
```

### Usage
- Simply type `oneai` followed by your question
- The AI will process your query and provide detailed, personalized responses
- Use quotes around your question for complex queries
- Add `--help` for more information about the command

## 🎨 Customization

The portfolio is designed to be easily customizable:

1. **Update Personal Information**: Edit the JSON files in `data/`
2. **Modify Styling**: Adjust CSS files for different color schemes
3. **Add Commands**: Extend `terminal.js` with new functionality
4. **Change Fonts**: Update `terminal-font.css` for different typography
5. **PWA Configuration**: Modify `manifest.json` for app settings
6. **Offline Content**: Update service worker cache in `sw.js`

## 📱 Progressive Web App (PWA) Features

This portfolio is a fully functional Progressive Web App with the following capabilities:

### ✅ Installation
- **Install as Native App**: Add to home screen on mobile or desktop
- **Standalone Mode**: Runs without browser UI when installed
- **Cross-Platform**: Works on Windows, macOS, Linux, iOS, Android
- **App Icon**: Custom terminal-themed icons for all device sizes

### ✅ Offline Functionality
- **Complete Offline Access**: Browse entire portfolio without internet
- **Cached Content**: All pages, styles, scripts, and data available offline
- **Service Worker**: Advanced caching strategies for optimal performance
- **Background Updates**: Automatic updates when online

### ✅ Performance
- **Fast Loading**: Instant load times after first visit
- **Background Caching**: Pre-loads content for immediate access
- **Efficient Updates**: Only downloads changed content
- **Mobile Optimized**: Smooth performance on all devices

### ✅ Native Features
- **App-like Experience**: Full-screen mode without browser chrome
- **Home Screen Icon**: Quick access from device home screen
- **Splash Screen**: Custom loading screen during app startup
- **Theme Integration**: Matches device theme preferences

### 🚀 Installation Instructions
1. Visit the portfolio in a modern browser
2. Look for "Install App" prompt or use `pwa install` command
3. Click "Install" to add to your device
4. Access from home screen/desktop like any native app

### 💡 PWA Commands
- `pwa status` - Check installation and PWA status
- `pwa install` - Trigger installation prompt
- `pwa update` - Check for and apply updates
- `offline` - View offline capabilities and cached content

## 🚀 Advanced Features

### ⚡ Performance Optimizations
- **Service Worker Caching**: Multiple cache strategies for different content types
- **Lazy Loading**: Efficient resource loading for better performance  
- **Minimal Dependencies**: Pure vanilla JavaScript for fast load times
- **Optimized Images**: Compressed icons and assets for quick loading

### 🔄 Auto-Updates
- **Background Updates**: Automatic content updates when online
- **Version Management**: Intelligent cache invalidation and updates
- **Update Notifications**: In-terminal notifications for new versions
- **Seamless Upgrades**: No interruption to user experience during updates

### 🛡️ Security Features
- **HTTPS Only**: Secure connections required for PWA functionality
- **Content Security Policy**: Protection against XSS attacks
- **Safe Command Execution**: All commands run in sandboxed environment
- **Data Privacy**: No external tracking or analytics

### 🎮 Interactive Elements
- **Easter Eggs**: Hidden commands and features for exploration
- **Command History**: Navigate previous commands with arrow keys
- **Real-time Clock**: Live clock display in Amit's current timezone
- **Typing Interruption**: Ctrl+C support for stopping long outputs
- **Responsive Design**: Adapts to all screen sizes and orientations

## 💾 Offline Capabilities

When installed as a PWA or when offline, the portfolio provides:

- ✅ **Complete Portfolio Browsing**: All content available offline
- ✅ **Command Execution**: All terminal commands work without internet
- ✅ **Skills & Experience**: Full access to professional information
- ✅ **Projects Showcase**: Browse all project details and achievements
- ✅ **Resume Access**: View complete resume and download capability
- ✅ **Contact Information**: Access to all contact details
- ❌ **OneAI Assistant**: Requires internet connection for AI responses
- ❌ **External Links**: LinkedIn/GitHub links require internet

## 🌟 Key Achievements Showcased

- **Performance**: 10x document processing throughput (100+ to 1000+ pages)
- **Scale**: 500% increase in data processing capacity (8 to 40+ sources)
- **Cost**: 50% GenAI cost reduction with 40% performance gain
- **Team**: Grew DevOps team from 5 to 25+ members
- **Compliance**: HIPAA-compliant multi-tenant serverless systems
- **AWS**: Led company to APN Advanced Partner + GenAI Competency + DevOps Competency
- **Deployment**: 400% increase in deployment frequency
- **Onboarding**: 90% reduction in new service onboarding time
- **Infrastructure**: 50% cost reduction on GKE serving 10M+ monthly users

## 📈 Professional Highlights

- **Current Role**: Solution Architect, DevOps @ Leapfrog Technology Inc. (Seattle, WA)
- **Experience**: 11+ years in DevOps, Cloud Engineering, and Solution Architecture
- **Specialization**: AWS, GenAI/LLM, Terraform, Kubernetes, HIPAA-compliant systems
- **Key Product**: [Addy AI](https://www.addy.ai) - LLM-based healthcare referral automation
- **Speaking**: [CIO Online Webcast](https://us.resources.cio.com/resources/genai-for-healthcare-providers-and-digital-health-companies-6/) with AWS on GenAI in Healthcare
- **Education**: B.E. Computer Science, Kathmandu University (2015)

## 🔧 Technical Stack Featured

### Cloud & DevOps
- **AWS Services**: EC2, EKS, Lambda, Bedrock, S3, RDS, CloudFormation, OpenSearch
- **Infrastructure as Code**: Terraform, CloudFormation, Pulumi, Ansible
- **Container Orchestration**: Kubernetes, Docker, Amazon EKS, GKE
- **CI/CD**: GitHub Actions, Azure DevOps, Jenkins, GitLab CI, AWS CodePipeline
- **Monitoring**: Prometheus, Grafana, ELK Stack, OpenSearch, CloudWatch

### GenAI & Machine Learning
- **LLM Platforms**: OpenAI GPT, Anthropic Claude, AWS Bedrock, Azure AI
- **GenAI Frameworks**: RAG, LangChain, LangSmith, RAGAS, RAGChecker
- **Vector Databases**: Pinecone, AWS OpenSearch VectorDB, AWS S3 Vector
- **AI Services**: Azure Document Intelligence, Amazon Textract
- **Optimization**: Prompt engineering, model selection, token optimization, cost engineering

### Programming & Automation
- **Languages**: Python, Bash, Go, NodeJS
- **Databases**: PostgreSQL, MySQL, DynamoDB, MongoDB, Redis
- **Web Technologies**: HTML5, CSS3, Vanilla JavaScript, Progressive Web Apps
- **Security & Compliance**: HIPAA, SOC2, GDPR, PCI-DSS, Vanta, Drata, OWASP

## 🤝 Connect With Me

- **Email**: one.amitj@gmail.com
- **LinkedIn**: [linkedin.com/in/oneamitj](https://linkedin.com/in/oneamitj)
- **GitHub**: [github.com/oneamitj](https://github.com/oneamitj)

## 📄 License

This project is licensed under the MIT License. Feel free to use it as inspiration for your own portfolio!

## 🙏 Acknowledgments

Inspired by the golden age of computing and terminal interfaces. Built with passion for both retro aesthetics and modern engineering practices.

---

*"Sometimes the old ways are the best ways."* - Built with vanilla JavaScript, no frameworks needed! 🚀

**Live Demo**: [amitj.me](https://amitj.me)

---

### 🎉 Recent Updates

**v2.0.0** - Latest Features:
- ✅ OneAI powered by Pinecone vector store with 17 structured knowledge files
- ✅ ArchMentor project page
- ✅ Career page with detailed experience timeline
- ✅ CV/Resume viewer with Markdown and PDF formats
- ✅ Screenshots for desktop and mobile views
- ✅ .well-known/security.txt for responsible disclosure
- ✅ sitemap.xml and robots.txt for SEO
- ✅ Custom 404 page

**v1.0.0** - Initial Release:
- ✅ Progressive Web App (PWA) support
- ✅ OneAI assistant integration  
- ✅ Complete offline functionality
- ✅ Advanced service worker caching
- ✅ Local time clock integration
- ✅ Enhanced mobile responsiveness
- ✅ Extended command system with help documentation
- ✅ PWA installation and update management
- ✅ Background app updates

### 🔄 PWA Installation

1. **Desktop**: Look for install icon in browser address bar
2. **Mobile**: Tap "Add to Home Screen" in browser menu
3. **Terminal**: Use `pwa install` command for guided installation
4. **Status**: Check `pwa status` for current installation state
