// Command definitions and utilities for the terminal interface

class CommandProcessor {
    constructor(terminal) {
        this.terminal = terminal;
        this.aliases = {
            'll': 'ls -la',
            'dir': 'ls',
            'cls': 'clear',
            'resume': 'cat resume.pdf',
            'cv': 'cat resume.pdf'
        };
    }

    // Process command with aliases
    processCommand(commandLine) {
        const trimmed = commandLine.trim();
        return this.aliases[trimmed] || trimmed;
    }

    // Validate command arguments
    validateArgs(command, args, expectedCount) {
        if (args.length < expectedCount) {
            throw new Error(`${command}: missing required arguments`);
        }
        return true;
    }

    // Format skill level display
    formatSkillLevel(level) {
        const levels = {
            'Expert': '★★★★★',
            'Advanced': '★★★★☆',
            'Intermediate': '★★★☆☆',
            'Beginner': '★★☆☆☆'
        };
        return levels[level] || '★☆☆☆☆';
    }

    // Format duration for experience
    formatDuration(startDate, endDate = 'Present') {
        // Simple duration calculation
        if (endDate === 'Present') {
            return 'Current';
        }
        return endDate;
    }

    // Generate ASCII art headers
    generateHeader(title) {
        const width = 60;
        const padding = Math.max(0, Math.floor((width - title.length) / 2));
        return `
╔${'═'.repeat(width + 2)}╗
║${' '.repeat(padding)}${title}${' '.repeat(width + 1 - padding - title.length)}║
╚${'═'.repeat(width + 2)}╝`;
    }

    // Color-code text based on content type
    getTextClass(type) {
        const classes = {
            'error': 'error',
            'success': 'success',
            'highlight': 'highlight',
            'prompt': 'prompt'
        };
        return classes[type] || '';
    }

    // Parse complex commands with flags
    parseCommand(commandLine) {
        const parts = commandLine.split(' ');
        return {
            command: parts[0],
            args: parts.slice(1).filter(arg => !arg.startsWith('-')),
            flags: parts.slice(1).filter(arg => arg.startsWith('-'))
        };
    }

    // Utility to create loading animation
    async showLoading(message = 'Loading') {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = `${frames[i]} ${message}...`;
        this.terminal.output.appendChild(loadingDiv);
        
        const interval = setInterval(() => {
            i = (i + 1) % frames.length;
            loadingDiv.textContent = `${frames[i]} ${message}...`;
        }, 100);

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        clearInterval(interval);
        loadingDiv.remove();
    }

    // Help system for individual commands
    getCommandHelp(command) {
        const helpTexts = {
            'help': 'Usage: help [command]\nShow available commands or help for specific command',
            'about': 'Usage: about\nDisplay professional summary and biography',
            'skills': 'Usage: skills [category]\nShow technical skills, optionally filtered by category',
            'projects': 'Usage: projects [filter]\nDisplay portfolio projects and achievements',
            'experience': 'Usage: experience\nShow professional work history and timeline',
            'contact': 'Usage: contact\nDisplay contact information and social links',
            'ls': 'Usage: ls\nList available directories and files',
            'cat': 'Usage: cat <filename>\nDisplay contents of specified file',
            'clear': 'Usage: clear\nClear the terminal screen',
            'whoami': 'Usage: whoami\nDisplay current user information',
            'pwd': 'Usage: pwd\nShow current directory path'
        };
        
        return helpTexts[command] || `No help available for command: ${command}`;
    }

    // Easter egg commands
    getEasterEggCommands() {
        return {
            'matrix': () => this.showMatrix(),
            'konami': () => this.showKonami(),
            'sudo': (args) => this.showSudo(args),
            'hack': () => this.showHack()
        };
    }

    async showMatrix() {
        const chars = '01';
        let output = '';
        for (let i = 0; i < 10; i++) {
            let line = '';
            for (let j = 0; j < 50; j++) {
                line += chars[Math.floor(Math.random() * chars.length)];
            }
            output += line + '\n';
        }
        return `
🔴 RED PILL DETECTED 🔴

${output}

Wake up, Neo... The Matrix has you...
Following the white rabbit led you here.
`;
    }

    showSudo(args) {
        if (args.includes('rm') && args.includes('-rf')) {
            return `
⚠️  DANGER ZONE DETECTED ⚠️

sudo: rm -rf /: Operation not permitted
Access denied. Nice try though! 😄

This is a portfolio website, not a real server.
No systems were harmed in the making of this command.
`;
        }
        return 'sudo: Sorry, user amit is not in the sudoers file. This incident will be reported.';
    }

    async showHack() {
        return `
🎭 HACKING INITIATED 🎭

Accessing mainframe...
Bypassing firewall...
Decrypting passwords...
Installing backdoor...

██████████████████████████████ 100%

HACK COMPLETE! 
Just kidding! This is just a portfolio website 😄
The only thing being hacked here is your expectations!
`;
    }
}

// Export for use in terminal.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandProcessor;
} else {
    window.CommandProcessor = CommandProcessor;
}
