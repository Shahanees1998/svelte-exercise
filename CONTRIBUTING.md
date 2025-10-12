# Contributing to SvelteKit E-Commerce Dashboard

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork the repository**
   ```bash
   git clone <your-fork-url>
   cd svelte-dashboard
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```

## Code Standards

### Code Style

We use automated tools to maintain consistent code quality:

- **ESLint**: For code linting
- **Prettier**: For code formatting
- **TypeScript**: For type safety
- **svelte-check**: For Svelte component validation

### Before Committing

1. **Format your code**
   ```bash
   yarn format
   ```

2. **Run linters**
   ```bash
   yarn lint
   ```

3. **Run type checking**
   ```bash
   yarn check
   ```

## Coding Guidelines

### TypeScript

- Always use TypeScript for new files
- Define proper interfaces for data structures
- Avoid using `any` type
- Enable strict mode (already configured)

### Svelte

- Use Svelte 5 runes syntax (`$state`, `$props`, `$derived`)
- Keep components focused and single-purpose
- Extract reusable logic into utilities
- Use proper TypeScript types for component props

### CSS

- Use CSS custom properties (variables) defined in `app.css`
- Follow BEM-like naming conventions for clarity
- Maintain responsive design principles
- No external CSS frameworks (plain CSS only)

### File Organization

```
src/
├── lib/
│   ├── components/    # Reusable components
│   ├── stores/        # Global state management
│   ├── server/        # Server-side logic
│   └── utils/         # Utility functions
└── routes/            # SvelteKit routes
```

## Commit Messages

Use clear, descriptive commit messages:

- `feat: Add user filtering functionality`
- `fix: Resolve authentication state persistence issue`
- `docs: Update README with deployment instructions`
- `style: Format code with Prettier`
- `refactor: Simplify order calculation logic`
- `test: Add tests for user validation`
- `chore: Update dependencies`

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing patterns and conventions
   - Add comments for complex logic

3. **Test your changes**
   - Ensure the app runs without errors
   - Test in different browsers if UI changes
   - Verify responsive design on mobile

4. **Submit pull request**
   - Provide clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## Testing

While this project doesn't currently have automated tests, when adding tests:

- Use Vitest for unit tests
- Use Playwright for E2E tests
- Maintain good test coverage
- Test edge cases and error conditions

## Questions or Issues?

- Open an issue for bugs or feature requests
- Use discussions for questions
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

