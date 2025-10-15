# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The AI Algorithm Simulator team and community take security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them using one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to our [Security Advisories page](https://github.com/Atik203/AI-Algorithm-Simulator/security/advisories)
   - Click "Report a vulnerability"
   - Fill out the vulnerability report form

2. **Private Contact**
   - Contact the maintainer [@Atik203](https://github.com/Atik203) through their GitHub profile
   - Include the word "SECURITY" in the subject line

### Information to Include

Please include the following information in your report:

- **Type of issue** (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s)** related to the manifestation of the issue
- **The location of the affected source code** (tag/branch/commit or direct URL)
- **Any special configuration required** to reproduce the issue
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

### Response Timeline

- **Initial Response**: Within 48 hours of receiving a report
- **Severity Assessment**: Within 5 business days
- **Security Advisory**: Published within 30 days (if applicable)
- **Patch Release**: As soon as possible after confirmation

## Security Measures

### Current Security Features

- **JWT Authentication** - Secure token-based authentication
- **CORS Configuration** - Proper cross-origin resource sharing setup
- **Input Validation** - Server-side validation of all inputs
- **SQL Injection Protection** - Django ORM prevents SQL injection
- **XSS Protection** - React's built-in XSS protection
- **HTTPS Ready** - Production deployment supports HTTPS
- **Environment Variables** - Sensitive data stored in environment variables
- **Dependency Scanning** - Regular dependency vulnerability checks

### Security Best Practices

#### For Users

- **Use Strong Passwords** - Create strong, unique passwords for your account
- **Keep Software Updated** - Use the latest version of the application
- **Secure Environment** - Deploy in a secure environment with HTTPS
- **Environment Variables** - Never commit sensitive data to version control

#### For Developers

- **Code Review** - All code changes require review
- **Dependency Updates** - Regular security updates for dependencies
- **Input Sanitization** - Always validate and sanitize user inputs
- **Authentication Checks** - Verify permissions for all protected endpoints
- **Secure Defaults** - Use secure configurations by default

## Known Security Considerations

### Development Environment

- **Debug Mode** - Debug mode is enabled by default for development
- **SQLite Database** - Default SQLite database for development only
- **CORS Settings** - Development CORS settings allow localhost

### Production Recommendations

- **Environment Configuration**
  ```bash
  DJANGO_DEBUG=False
  DJANGO_SECRET_KEY=<strong-random-secret>
  DATABASE_URL=<production-database-url>
  ```

- **Database Security**
  - Use PostgreSQL or MySQL for production
  - Enable database connection encryption
  - Use strong database passwords
  - Limit database user permissions

- **Web Server Security**
  - Enable HTTPS with valid SSL certificates
  - Configure security headers (HSTS, CSP, etc.)
  - Use a reverse proxy (nginx, Apache)
  - Enable rate limiting

- **Application Security**
  - Set strong Django SECRET_KEY
  - Configure ALLOWED_HOSTS properly
  - Use environment variables for sensitive data
  - Enable Django security middleware

## Vulnerability Disclosure Policy

### Our Commitments

- We will respond to your report promptly
- We will keep you informed of the progress
- We will credit you for the discovery (if desired)
- We will not take legal action against researchers who follow responsible disclosure

### What We Expect

- **Good Faith Research** - Make a good faith effort to avoid privacy violations
- **Responsible Disclosure** - Give us reasonable time to fix issues before public disclosure
- **No Harm** - Don't perform actions that could harm our users or degrade our services
- **Legal Compliance** - Follow applicable laws and regulations

### Safe Harbor

We consider security research conducted under this policy to be:

- Authorized in accordance with applicable laws
- Compliant with our terms and conditions
- Exempt from DMCA takedown claims

### Out of Scope

The following are generally considered out of scope:

- **Social Engineering** - Phishing, vishing, smishing attacks against employees
- **Physical Security** - Physical attacks against offices or data centers
- **Denial of Service** - DoS or DDoS attacks
- **Third-party Services** - Vulnerabilities in third-party services we use
- **Non-security Issues** - Bugs that don't have security implications

## Security Updates

### Update Process

1. **Vulnerability Assessment** - Evaluate the severity and impact
2. **Patch Development** - Develop and test the security fix
3. **Security Advisory** - Publish security advisory if needed
4. **Release** - Release patched version
5. **Notification** - Notify users of critical updates

### Staying Informed

- **GitHub Releases** - Subscribe to GitHub release notifications
- **Security Advisories** - Monitor our GitHub Security Advisories
- **README Updates** - Check README for security-related updates

## Security Contact

### Primary Contact

- **Maintainer**: [@Atik203](https://github.com/Atik203)
- **GitHub Security**: [Security Advisories](https://github.com/Atik203/AI-Algorithm-Simulator/security/advisories)

### PGP Key

Currently, we do not have a PGP key for encrypted communications. If you need to send highly sensitive information, please use GitHub's private vulnerability reporting feature.

## Bug Bounty Program

At this time, we do not offer a bug bounty program. However, we greatly appreciate security research and will acknowledge security researchers who follow responsible disclosure practices.

## Acknowledgments

We would like to thank the following individuals for their contributions to the security of AI Algorithm Simulator:

- Security researchers who have responsibly disclosed vulnerabilities
- Community members who have provided security feedback
- Contributors who have improved our security practices

*This list will be updated as we receive and address security reports.*

## Additional Resources

### Security Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security Documentation](https://docs.djangoproject.com/en/stable/topics/security/)
- [React Security Best Practices](https://react.dev/learn/thinking-in-react#security)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)

### Security Tools

- **Static Analysis**: CodeQL, SonarQube
- **Dependency Scanning**: Dependabot, npm audit, pip audit
- **Container Security**: Docker security scanning
- **Web Application Security**: OWASP ZAP, Burp Suite

---

**Last Updated**: October 16, 2025

Thank you for helping keep AI Algorithm Simulator and our users safe! 🔒