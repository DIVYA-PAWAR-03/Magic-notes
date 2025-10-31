# Magic Notes ✨

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

</div>

A **simple**, **elegant**, and **responsive** note-taking web application that helps you capture and organize your thoughts with a touch of magic! ✨

Whether you're brainstorming ideas, organizing tasks, or taking quick notes, Magic Notes provides a seamless experience across all your devices.

## 📸 Screenshots

> **Note**: Screenshots will be added soon! Feel free to contribute by adding them.

<!--
Add screenshots here:
- ![Main Interface](screenshots/main-interface.png)
- ![Add Note Modal](screenshots/add-note.png)
- ![Mobile View](screenshots/mobile-view.png)
-->

## ✨ Features

- 📝 **Quick Note Creation**: Add notes with titles and rich content instantly
- ✏️ **Easy Editing**: Update your existing notes with a smooth modal editing experience
- 🗑️ **Smart Deletion**: Remove notes you no longer need with confirmation
- 🏷️ **Categories & Tags**: Organize notes with 6 color-coded categories (Work, Personal, Ideas, Important, Study, Other)
- 🎨 **Advanced Filtering**: Filter notes by category with a single click
- 🎯 **Visual Organization**: Color-coded badges on note cards for instant recognition
- 📱 **Responsive Design**: Perfect experience on desktop, tablet, and mobile devices
- 💾 **Local Storage**: Your notes persist between browser sessions automatically
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- ⚡ **Fast Performance**: Vanilla JavaScript for lightning-fast interactions
- 🔍 **Visual Feedback**: Real-time alerts and smooth transitions
- 📅 **Timestamps**: Track when your notes were created and modified (with edit indicator)
- 🔍 **Enhanced Search**: Search notes by title, content, and category tags
- ⌨️ **Keyboard Shortcuts**: Speed up your workflow with handy shortcuts
- 💾 **Auto-save Drafts**: Never lose your work with automatic draft saving

## 🛠️ Tech Stack

| Technology                 | Purpose                                    | Version |
| -------------------------- | ------------------------------------------ | ------- |
| **HTML5**                  | Structure and semantic markup              | Latest  |
| **CSS3**                   | Styling, animations, and responsive layout | Latest  |
| **JavaScript (ES6+)**      | Dynamic functionality and interactivity    | ES6+    |
| **Bootstrap 5.3.3**        | UI components and responsive grid          | 5.3.3   |
| **Bootstrap Icons**        | Icon library for UI elements               | 1.11.1  |
| **Google Fonts (Poppins)** | Typography and font styling                | Latest  |

## 🚀 Quick Start

### Prerequisites

- **Web Browser**: Any modern web browser (Chrome, Firefox, Safari, Edge)
- **Text Editor**: VS Code, Sublime Text, or any code editor (for development)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/DIVYA-PAWAR-03/Magic-notes.git
   cd Magic-notes
   ```

2. **Open the application**

   - **Option 1**: Double-click `index.html` to open in your default browser
   - **Option 2**: Use a local development server:

     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js (with http-server installed globally)
     npx http-server

     # Using VS Code Live Server extension
     # Right-click index.html → "Open with Live Server"
     ```

3. **Start taking notes!** 🎉

### 📁 Project Structure

```
Magic-notes/
├── index.html          # Main HTML file
├── js/
│   └── app.js          # JavaScript functionality
├── README.md           # Project documentation
└── .vscode/            # VS Code workspace settings
```

## 📖 Usage Guide

### Adding a Note

1. Enter a **title** for your note
2. Write your **content** in the text area
3. **Optional**: Select a **category** (Work, Personal, Ideas, Important, Study, or Other)
4. Click **"Save Note"** to save

### Organizing with Categories

Magic Notes includes 6 beautiful color-coded categories to help you organize your thoughts:

| Category | Icon | Color | Use Case |
|----------|------|-------|----------|
| 🏢 **Work** | Briefcase | Blue | Work-related tasks and projects |
| 👤 **Personal** | Person | Green | Personal thoughts and reminders |
| 💡 **Ideas** | Lightbulb | Orange | Creative ideas and brainstorming |
| ⚠️ **Important** | Exclamation | Red | Urgent or critical notes |
| 📚 **Study** | Book | Purple | Learning materials and study notes |
| 📁 **Other** | Folder | Gray | Everything else |

### Managing Notes

- **View**: All notes are displayed as cards with titles, timestamps, and category badges
- **Edit**: Click the "Edit" button on any note to open the edit modal and modify it
- **Delete**: Click the "Delete" button to remove a note (with confirmation)
- **Filter**: Use the filter bar to view notes from specific categories
- **Search**: Use the search bar to find notes by title, content, or category
- **Persistence**: Notes automatically save to your browser's local storage

### Filtering & Searching

- **Category Filtering**: Click any category button in the filter bar to show only notes from that category
- **Search**: Type in the search box to find notes by title, content, or category name
- **Combined**: Use filtering and search together for powerful note organization
- **Clear Filters**: Click "All Notes" to see everything again

### Keyboard Shortcuts

- `Ctrl + S` (or `Cmd + S` on Mac): Save the current note
- `Ctrl + F` (or `Cmd + F` on Mac): Focus on the search bar
- `Ctrl + Enter` (or `Cmd + Enter` on Mac): Save edited note in the edit modal
- `Escape`: Close any open modal or cancel editing

## 🎯 Roadmap

### Planned Features

- [x] **Search & Filter**: Search through your notes by title or content ✅
- [x] **Categories/Tags**: Organize notes with color-coded categories ✅
- [ ] **Export Options**: Export notes as PDF, Markdown, or Plain Text
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Rich Text Editor**: Add formatting options (bold, italic, lists, etc.)
- [ ] **Cloud Sync**: Sync notes across devices (Firebase/Supabase integration)
- [ ] **Keyboard Navigation**: Full keyboard accessibility
- [ ] **Note Archiving**: Archive old notes instead of deleting them
- [ ] **Backup & Restore**: Import/export all notes as JSON
- [ ] **PWA Support**: Install as a Progressive Web App

### Recently Added

- ✅ **Categories & Tags System**: 6 color-coded categories with visual badges and filtering
- ✅ **Advanced Filtering**: Filter notes by category with dedicated filter bar
- ✅ **Category Integration**: Search now includes category tags for better discovery
- ✅ **Edit Note Feature**: Full CRUD functionality with modal-based editing
- ✅ **Enhanced Search**: Search notes by title, content, and categories
- ✅ **Auto-save Drafts**: Automatic draft saving for unsaved notes
- ✅ **Keyboard Shortcuts**: Quick access with Ctrl+S, Ctrl+F shortcuts
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Local Storage**: Persistent note storage
- ✅ **Beautiful UI**: Modern gradient design

## 🤝 Contributing

We welcome contributions from everyone! Whether you're a beginner or an experienced developer, there are many ways to help improve Magic Notes.

### 🌟 Ways to Contribute

1. **🐛 Report Bugs**: Found a bug? [Open an issue](https://github.com/DIVYA-PAWAR-03/Magic-notes/issues/new?template=bug_report.md)
2. **💡 Suggest Features**: Have an idea? [Request a feature](https://github.com/DIVYA-PAWAR-03/Magic-notes/issues/new?template=feature_request.md)
3. **📚 Improve Documentation**: Help make our docs better
4. **🎨 Design Improvements**: Enhance the UI/UX
5. **⚡ Performance Optimizations**: Make the app faster
6. **🧪 Add Tests**: Help us add testing coverage

### 🛠️ Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Magic-notes.git
   cd Magic-notes
   ```
3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and test them thoroughly
5. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request** on GitHub

### 📝 Commit Message Guidelines

We use conventional commits for clear and consistent commit messages:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**

```bash
git commit -m "feat: add search functionality to notes"
git commit -m "fix: resolve mobile responsive issues"
git commit -m "docs: update installation instructions"
```

### 🐛 Issues & Bug Reports

When reporting bugs, please include:

- **Browser** and version
- **Operating System**
- **Steps to reproduce** the bug
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)

### 💡 Feature Requests

For feature requests, please provide:

- **Clear description** of the feature
- **Use case** or problem it solves
- **Proposed implementation** (if you have ideas)
- **Mockups or examples** (if applicable)

### 🎨 Design Guidelines

- Follow the existing color scheme and design patterns
- Ensure responsive design works on all screen sizes
- Maintain accessibility standards (WCAG 2.1)
- Use consistent spacing and typography
- Test on multiple browsers and devices

### 🧪 Testing

Before submitting a PR, please:

- Test your changes on different browsers (Chrome, Firefox, Safari, Edge)
- Verify responsive design on various screen sizes
- Check that existing functionality still works
- Ensure your code follows the project's style guidelines

## 🔧 Troubleshooting

### Common Issues

**Notes not saving?**

- Check if your browser supports localStorage
- Clear browser cache and cookies
- Ensure JavaScript is enabled

**Responsive issues?**

- Check if you're using a modern browser
- Verify viewport meta tag is present
- Test on different screen sizes

**Performance problems?**

- Clear browser cache
- Check for JavaScript console errors
- Ensure you're using the latest version

## 📊 Browser Support

| Browser | Version | Status             |
| ------- | ------- | ------------------ |
| Chrome  | 70+     | ✅ Fully Supported |
| Firefox | 65+     | ✅ Fully Supported |
| Safari  | 12+     | ✅ Fully Supported |
| Edge    | 79+     | ✅ Fully Supported |
| IE      | ❌      | Not Supported      |

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ Use for personal and commercial projects
- ✅ Modify and distribute
- ✅ Private use
- ❌ No warranty provided
- ❌ Authors not liable for damages

## 🙏 Acknowledgments

- **Bootstrap Team** - For the amazing UI framework
- **Google Fonts** - For the beautiful Poppins font
- **Bootstrap Icons** - For the comprehensive icon library
- **All Contributors** - Thank you for making Magic Notes better!

## 📞 Support & Contact

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/DIVYA-PAWAR-03/Magic-notes/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/DIVYA-PAWAR-03/Magic-notes/discussions)
- 📧 **Email**: [your-email@example.com](mailto:your-email@example.com)
- 🌐 **Website**: [Live Demo](https://DIVYA-PAWAR-03.github.io/Magic-notes/)

## ⭐ Show Your Support

If you found this project helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** any bugs you find
- 💡 **Suggesting** new features
- 🤝 **Contributing** to the codebase
- 📢 **Sharing** with others who might find it useful

---

<div align="center">

**Made with ❤️ by [DIVYA-PAWAR-03](https://github.com/DIVYA-PAWAR-03)**

_"A little magic in your note-taking makes all the difference!"_ ✨

</div>
