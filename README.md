# Retro DevOps Portfolio - Amit Joshi

Welcome to my Retro DevOps Portfolio! This project showcases my 10+ years of experience in DevOps, AWS cloud architecture, and GenAI integration through a nostalgic command-line interface style reminiscent of classic computing.

## 🚀 About This Portfolio

This interactive terminal-based portfolio demonstrates my expertise in:
- **Cloud Architecture**: AWS Expert with APN Advanced Partner achievement
- **DevOps Engineering**: Terraform, Kubernetes, Docker, CI/CD
- **GenAI Integration**: 40% performance improvement, 50% cost reduction
- **Team Leadership**: Grew teams from 4 to 20+ certified engineers
- **Compliance**: HIPAA, SOC2 compliant system design

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
- **Nepal Time Clock**: Real-time clock display in header

## 🛠️ Technologies Used

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no frameworks!)
- **PWA**: Service Worker, Web App Manifest, Background Sync
- **AI Integration**: Custom OneAI for intelligent responses
- **Styling**: Custom CSS with CRT effects, retro fonts
- **Fonts**: VT323, Press Start 2P (Google Fonts)
- **Data**: JSON-based content management
- **Caching**: Advanced service worker with cache strategies
- **Hosting**: Static site hosting compatible (GitHub Pages, Netlify, Vercel)

## 📁 Project Structure

```
oneamitj.github.io/
├── index.html              # Main HTML file with PWA meta tags
├── manifest.json           # PWA manifest configuration
├── sw.js                   # Service worker for offline functionality
├── browserconfig.xml       # Browser configuration for Windows tiles
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
│   └── AmitJ_CV.pdf        # Downloadable resume
├── assets/
│   └── fonts/
│       └── terminal-font.css # Custom terminal font definitions
├── icons/                  # PWA icons for all device sizes
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-256x256.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
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
- **Real-time Clock**: Live Nepal Time display in header
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

- **Performance**: 10x product improvement (100+ to 1000+ pages)
- **Scale**: 500% increase in data processing capacity (8 to 40+ sources)
- **Cost**: 50% GenAI cost reduction with 40% performance gain
- **Team**: Grew engineering teams from 5 to 20+ members
- **Compliance**: HIPAA-compliant multi-tenant systems
- **AWS**: Led company to APN Advanced Partner status
- **Deployment**: 400% increase in deployment frequency
- **Onboarding**: 90% reduction in new service onboarding time

## 📈 Professional Highlights

- **Current Role**: Solution Architect @ Leapfrog Technology Inc.
- **Experience**: 10+ years in DevOps and Cloud Engineering
- **Specialization**: AWS, GenAI, Terraform, Kubernetes
- **Location**: Kathmandu, Nepal
- **Education**: B.E. Computer Science, Kathmandu University (2015)

## 🔧 Technical Stack Featured

### Cloud & DevOps
- **AWS Services**: EC2, EKS, Lambda, Bedrock, S3, RDS, CloudFormation
- **Infrastructure as Code**: Terraform, CloudFormation, Ansible
- **Container Orchestration**: Kubernetes, Docker, Amazon EKS
- **CI/CD**: Jenkins, GitHub Actions, GitLab CI, AWS CodePipeline
- **Monitoring**: Prometheus, Grafana, ELK Stack, CloudWatch

### GenAI & Machine Learning
- **LLM Platforms**: OpenAI GPT, Anthropic Claude, AWS Bedrock
- **GenAI Frameworks**: RAG (Retrieval-Augmented Generation), LangChain
- **AI Integration**: Custom API development, Prompt engineering
- **Performance Optimization**: Model fine-tuning, Cost optimization

### Programming & Automation
- **Languages**: Python, Bash, Go, JavaScript
- **Databases**: PostgreSQL, MongoDB, Redis, Amazon Aurora
- **Web Technologies**: HTML5, CSS3, Vanilla JavaScript, Progressive Web Apps
- **Security & Compliance**: HIPAA, SOC2, Multi-tenant architecture

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

**Live Demo**: [amitj.com.np](https://amitj.com.np)

---

### 🎉 Recent Updates

**v1.0.0** - Latest Features:
- ✅ Progressive Web App (PWA) support
- ✅ OneAI assistant integration  
- ✅ Complete offline functionality
- ✅ Advanced service worker caching
- ✅ Nepal Time clock integration
- ✅ Enhanced mobile responsiveness
- ✅ Extended command system with help documentation
- ✅ PWA installation and update management
- ✅ Background app updates

### 🔄 PWA Installation

1. **Desktop**: Look for install icon in browser address bar
2. **Mobile**: Tap "Add to Home Screen" in browser menu
3. **Terminal**: Use `pwa install` command for guided installation
4. **Status**: Check `pwa status` for current installation state
