# Contributing to AI Algorithm Simulator

Thank you for your interest in contributing to AI Algorithm Simulator! We welcome contributions from the community and are excited to collaborate with you.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Standards](#development-standards)
- [Recognition](#recognition)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior through GitHub issues.

## How to Contribute

There are many ways to contribute to AI Algorithm Simulator:

### 🐛 Report Bugs
- Check existing issues to avoid duplicates
- Use the bug report template
- Include clear steps to reproduce
- Provide system information and browser details

### 💡 Suggest Features
- Open a feature request issue
- Describe the problem you're solving
- Explain your proposed solution
- Consider implementation complexity

### 📝 Improve Documentation
- Fix typos and grammar
- Add examples and clarifications
- Create tutorials or guides
- Improve API documentation

### 🔧 Submit Code Changes
- Fix bugs and implement features
- Add new algorithms
- Improve performance
- Enhance UI/UX

### 🎓 Educational Content
- Create algorithm explanations
- Write tutorials
- Record demo videos
- Share use cases

## Development Setup

### Prerequisites

Before you begin, ensure you have:

- **Python 3.12.7+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Yarn 4.9.4+** - Install via `npm install -g yarn`
- **Git** - [Download Git](https://git-scm.com/)

### Local Development

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/YOUR_USERNAME/AI-Algorithm-Simulator.git
   cd AI-Algorithm-Simulator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Activate virtual environment (Windows)
   .\venv\Scripts\Activate.ps1
   # For Linux/Mac: source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser (optional)
   python manage.py createsuperuser
   
   # Start backend server
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   # In new terminal
   cd frontend
   
   # Install dependencies
   yarn install
   
   # Start development server
   yarn dev
   ```

4. **Verify Setup**
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173
   - Admin Panel: http://localhost:8000/admin

## Contribution Guidelines

### Creating Issues

**Bug Reports**
- Use the bug report template
- Include steps to reproduce
- Provide expected vs actual behavior
- Add screenshots if relevant
- Include browser/OS information

**Feature Requests**
- Use the feature request template
- Describe the problem clearly
- Propose a solution
- Consider breaking down large features

**Questions**
- Check existing documentation first
- Use GitHub Discussions for general questions
- Be specific and provide context

### Branch Naming

Use descriptive branch names following this pattern:

- `feature/algorithm-name` - New algorithm implementation
- `fix/bug-description` - Bug fixes
- `docs/improvement-area` - Documentation updates
- `refactor/component-name` - Code refactoring
- `style/area-updated` - UI/styling changes

Examples:
- `feature/bidirectional-bfs`
- `fix/grid-centering-issue`
- `docs/setup-guide-improvement`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code change that neither fixes bug nor adds feature
- `test` - Adding missing tests
- `chore` - Updating build tasks, package manager configs, etc.

**Examples:**
```bash
feat(algorithms): implement bidirectional BFS algorithm
fix(ui): center grid properly in visualizer
docs(readme): add troubleshooting section
style(navbar): improve responsive design
refactor(api): optimize algorithm execution endpoint
test(algorithms): add unit tests for A* algorithm
chore(deps): update Django to 5.2.8
```

## Pull Request Process

### Before Submitting

1. **Update Your Fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**
   ```bash
   # Backend tests
   cd backend
   python manage.py test
   
   # Frontend tests
   cd frontend
   yarn test
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Submitting the PR

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub and create a PR
   - Use the PR template
   - Link related issues
   - Add screenshots for UI changes
   - Request reviews

3. **PR Requirements**
   - Clear, descriptive title
   - Detailed description of changes
   - Link to related issues
   - Screenshots for visual changes
   - Tests passing
   - Documentation updated

### PR Review Process

1. **Automated Checks**
   - All tests must pass
   - Code style checks must pass
   - No merge conflicts

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments
   - Make requested changes promptly

3. **Merge Process**
   - Maintainer will merge after approval
   - PR branch will be deleted automatically
   - Thank you message and recognition

## Issue Reporting

### Bug Reports

**Required Information:**
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Screenshots (if relevant)
- Console errors (if any)

**Template:**
```markdown
**Bug Description**
A clear and concise description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
Add screenshots to help explain the problem.

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

### Feature Requests

**Template:**
```markdown
**Feature Request**
Brief description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
Describe your proposed solution.

**Alternatives Considered**
Other approaches you've considered.

**Additional Context**
Screenshots, mockups, or examples.
```

## Development Standards

### Code Quality

**Python (Backend)**
- Follow [PEP 8](https://pep8.org/) style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions small and focused
- Use meaningful variable names

**TypeScript/React (Frontend)**
- Use functional components with hooks
- Follow React best practices
- Use TypeScript types consistently
- Keep components small and reusable
- Use proper prop types

### Testing

**Backend Testing**
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test algorithms_app

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

**Frontend Testing**
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Documentation

- Update README.md if needed
- Add docstrings to new functions
- Comment complex algorithms
- Update API documentation
- Add examples for new features

### Algorithm Implementation

When adding new algorithms:

1. **Algorithm File** (`backend/algorithms_app/algorithms.py`)
   - Implement algorithm function
   - Return step-by-step execution data
   - Include proper error handling
   - Add comprehensive docstring

2. **Model Updates** (`backend/algorithms_app/models.py`)
   - Update algorithm choices if needed
   - Add any new fields required

3. **API Updates** (`backend/algorithms_app/views.py`)
   - Add algorithm to available list
   - Handle algorithm-specific parameters

4. **Frontend Updates** (`frontend/src/`)
   - Add algorithm to selection dropdown
   - Add algorithm-specific configuration
   - Update algorithm information cards

5. **Tests**
   - Add unit tests for algorithm logic
   - Test API endpoints
   - Test frontend integration

### Performance Guidelines

- Optimize algorithm implementations for large grids
- Use efficient data structures
- Minimize API calls
- Optimize React re-renders
- Test with large datasets

## Recognition

Contributors are recognized in several ways:

### Contributors List
- All contributors are listed in our README
- GitHub automatically tracks contributions
- Special recognition for significant contributions

### Types of Recognition
- **Code Contributors** - Implement features, fix bugs
- **Documentation Contributors** - Improve docs, write guides
- **Bug Reporters** - Find and report issues
- **Feature Suggesters** - Propose valuable features
- **Community Helpers** - Help others in discussions

### Hall of Fame
Outstanding contributors may be:
- Featured in project announcements
- Invited to become maintainers
- Recognized in conference talks or blog posts

## Getting Help

### Resources
- **Documentation** - Check README.md first
- **GitHub Issues** - Search existing issues
- **GitHub Discussions** - Ask questions and discuss ideas
- **Code Examples** - Look at existing implementations

### Contact
- **Maintainer**: [@Atik203](https://github.com/Atik203)
- **Issues**: [GitHub Issues](https://github.com/Atik203/AI-Algorithm-Simulator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Atik203/AI-Algorithm-Simulator/discussions)

### Response Times
- **Issues**: We aim to respond within 48 hours
- **Pull Requests**: Reviews within 3-5 days
- **Urgent Bugs**: Within 24 hours

## Additional Notes

### Development Tips

1. **Start Small** - Begin with small contributions to understand the codebase
2. **Ask Questions** - Don't hesitate to ask for clarification
3. **Read Code** - Study existing implementations before adding new ones
4. **Test Thoroughly** - Test your changes in different browsers and scenarios
5. **Be Patient** - Code review takes time but improves quality

### Common Pitfalls

- Not following the branch naming convention
- Missing tests for new features
- Not updating documentation
- Large PRs that are hard to review
- Not linking issues to PRs

### Best Practices

- Keep PRs focused and small
- Write clear commit messages
- Add comments for complex logic
- Update tests when changing functionality
- Be responsive to review feedback

---

Thank you for contributing to AI Algorithm Simulator! Your efforts help make this project better for everyone. 🚀

**Happy Coding!** 💻✨