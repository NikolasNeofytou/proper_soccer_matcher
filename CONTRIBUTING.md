# Contributing to Proper Soccer Matcher

Thank you for your interest in contributing to Proper Soccer Matcher! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/proper_soccer_matcher.git
   cd proper_soccer_matcher
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/NikolasNeofytou/proper_soccer_matcher.git
   ```
4. **Create a branch** for your contribution:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions or features you've considered**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `beginner` - Suitable for beginners

### Pull Requests

1. Follow the [coding standards](#coding-standards)
2. Update documentation as needed
3. Add tests for new features
4. Ensure all tests pass
5. Update the CHANGELOG.md

## Development Process

### Setting Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up database
npm run db:setup

# Run migrations
npm run migrate

# Start development server
npm run dev

# Run tests
npm test
```

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feature/player-matching-algorithm`
- `fix/booking-double-reservation`
- `docs/api-authentication-guide`

## Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and components
- Use **UPPER_CASE** for constants
- Maximum line length: **100 characters**
- Use **meaningful variable names**

Example:
```typescript
// Good
const calculateMatchDuration = (startTime: Date, endTime: Date): number => {
  return (endTime.getTime() - startTime.getTime()) / 60000;
};

// Bad
const calc = (s: Date, e: Date): number => {
  return (e.getTime() - s.getTime()) / 60000;
};
```

### React/React Native

- Use **functional components** with hooks
- Use **TypeScript interfaces** for props
- Keep components **small and focused**
- Use **custom hooks** for shared logic
- Follow **React best practices**

Example:
```typescript
interface PlayerCardProps {
  player: Player;
  onSelect: (playerId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onSelect }) => {
  const handleClick = () => {
    onSelect(player.id);
  };

  return (
    <div onClick={handleClick}>
      <h3>{player.firstName} {player.lastName}</h3>
      <p>Skill Level: {player.skillLevel}</p>
    </div>
  );
};
```

### Backend

- Use **NestJS decorators** appropriately
- Implement **proper error handling**
- Use **DTOs** for validation
- Follow **RESTful conventions**
- Document API endpoints

Example:
```typescript
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.create(createBookingDto, user);
  }
}
```

### Database

- Use **migrations** for schema changes
- Write **efficient queries**
- Add **appropriate indexes**
- Use **transactions** for related operations
- Document complex queries

### CSS/Styling

- Use **CSS Modules** or **styled-components**
- Follow **BEM naming** for CSS classes
- Use **responsive design** principles
- Support **dark mode** where applicable
- Ensure **accessibility** (WCAG 2.1 AA)

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat(player-matching): add skill level filtering

Implement skill level range filtering for player matching
to help users find players of similar abilities.

Closes #123
```

```bash
fix(booking): prevent double booking on same time slot

Add database constraint and validation to prevent
users from booking the same pitch at overlapping times.

Fixes #456
```

## Pull Request Process

1. **Update your branch** with the latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** and ensure they pass:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

3. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test coverage information

5. **Address review feedback** promptly

6. **Squash commits** if requested

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No console warnings/errors

## Related Issues
Closes #(issue number)
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test Guidelines

- Write tests for all new features
- Maintain >80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

Example:
```typescript
describe('BookingService', () => {
  describe('createBooking', () => {
    it('should create a booking when pitch is available', async () => {
      // Arrange
      const bookingDto = createMockBookingDto();
      const user = createMockUser();
      
      // Act
      const result = await bookingService.create(bookingDto, user);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe('confirmed');
    });
    
    it('should throw error when pitch is not available', async () => {
      // Test implementation
    });
  });
});
```

## Documentation

### Code Documentation

- Add **JSDoc comments** for public APIs
- Document **complex logic**
- Keep documentation **up to date**

Example:
```typescript
/**
 * Calculates the total cost of a booking including any applicable discounts
 * 
 * @param booking - The booking details
 * @param voucher - Optional voucher code
 * @returns The calculated total amount
 * @throws {InvalidVoucherError} If voucher is invalid or expired
 */
async calculateBookingCost(
  booking: CreateBookingDto,
  voucher?: string,
): Promise<number> {
  // Implementation
}
```

### API Documentation

- Update **API_DOCUMENTATION.md** for endpoint changes
- Include **request/response examples**
- Document **error responses**
- Use **OpenAPI/Swagger** annotations

### README Updates

- Update **README.md** for new features
- Add **setup instructions** for new dependencies
- Update **architecture diagrams** if needed

## Getting Help

If you need help:

- 📧 Email: dev@propersoccermatcher.com
- 💬 Discord: [Join our community](https://discord.gg/propersoccer)
- 📖 Documentation: [Read the docs](PROJECT_PLAN.md)
- 🐛 Issues: [GitHub Issues](https://github.com/NikolasNeofytou/proper_soccer_matcher/issues)

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Eligible for contributor badges
- Invited to contributor events

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Proper Soccer Matcher! ⚽
