export const docsContent: Record<string, { title: string, content: string }> = {
  "what-is-codelens": {
    title: "What is CodeLens?",
    content: "CodeLens is an advanced, AI-driven code health analyzer and auto-remediation platform. Instead of merely linting your code or identifying vulnerabilities, CodeLens leverages massive Language Models (LLMs) to deeply understand your repository's architecture, identify technical debt, and most importantly, generate ready-to-merge patches that fix the problems instantly."
  },
  "quickstart-guide": {
    title: "Quickstart Guide",
    content: "To get started with CodeLens:\n\n1. Copy the URL of any public GitHub repository.\n2. Paste it into the search bar on the home page.\n3. Click 'Run Scan'.\n4. Wait a few moments while our agents clone, analyze, and score your codebase.\n5. Review the resulting Dashboard, click on problematic files, and apply AI-generated patches."
  },
  "connecting-github": {
    title: "Connecting GitHub",
    content: "CodeLens allows seamless integration with GitHub. While public repositories can be analyzed simply by pasting their URL, connecting your GitHub account via OAuth allows CodeLens to scan private repositories and automatically open Pull Requests containing AI-generated fixes directly in your workflow."
  },
  "deep-health-scoring": {
    title: "Deep Health Scoring",
    content: "Our proprietary Health Score algorithm analyzes multiple dimensions of your codebase. We evaluate Cyclomatic Complexity, code duplication, undocumented functions, and known code smells. The raw metrics are combined with qualitative AI analysis to generate a final 0-100 score, giving engineering leaders an immediate pulse on the repository's maintainability."
  },
  "ai-auto-fix-agents": {
    title: "AI Auto-Fix Agents",
    content: "CodeLens goes beyond traditional static analysis. When a critical issue is identified, our AI Auto-Fix Agents spring into action. They contextually read the problematic file, understand the surrounding logic, and write a complete patch. You can review the diff side-by-side in the dashboard and apply it instantly."
  },
  "cyclomatic-complexity": {
    title: "Cyclomatic Complexity",
    content: "Cyclomatic complexity is a software metric used to indicate the complexity of a program. It is a quantitative measure of the number of linearly independent paths through a program's source code. CodeLens flags functions with unusually high complexity and uses AI to suggest refactoring strategies to break them down into smaller, testable units."
  },
  "data-privacy": {
    title: "Data Privacy",
    content: "Your code is your intellectual property. CodeLens is built with a zero-retention architecture for source code. Once an analysis is complete and the dashboard session ends, the cloned repository is immediately purged from our temporary servers. We do not use your proprietary code to train our foundational LLMs."
  },
  "soc2-compliance": {
    title: "SOC2 Compliance",
    content: "CodeLens is actively pursuing SOC2 Type II compliance. We maintain strict access controls, continuous vulnerability scanning, and robust audit logging to ensure that our infrastructure meets the highest standards of enterprise security and reliability."
  },
  "enterprise-sso": {
    title: "Enterprise SSO",
    content: "For large teams, CodeLens supports SAML-based Single Sign-On (SSO). Integrate seamlessly with Okta, Microsoft Entra ID, or Google Workspace to manage access centrally and enforce organization-wide security policies."
  }
};
