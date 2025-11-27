# Contributing to Timonacore

Thank you for your interest in contributing to Timonacore! 🎉

## 🚀 Quick Start for Contributors

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/katastarterkit.git
   cd katastarterkit
   ```
3. **Install dependencies:**
   ```bash
   bun install && cd backend && bun install && cd ../frontend && bun install && cd ..
   ```
4. **Start development environment:**
   ```bash
   docker-compose up -d
   bun run dev
   ```

## 🛠️ Development Guidelines

### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **tests** for new features

### Testing
```bash
# Run all tests
bun run test

# Run specific tests
cd backend && bun test
cd frontend && bun run test

# E2E tests
cd frontend && bun run test:e2e
```

### Before Submitting
- [ ] Tests pass (`bun run test`)
- [ ] Linting passes (`bun run lint`)
- [ ] Build succeeds (`bun run build`)
- [ ] Documentation updated if needed

## 📝 Pull Request Process

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to your fork
6. Create a Pull Request

## 🎯 Areas for Contribution

- **Features**: New functionality or improvements
- **Documentation**: Guides, examples, API docs
- **Testing**: Unit tests, integration tests, E2E tests
- **Performance**: Optimizations and benchmarks
- **Bug fixes**: Issue resolution and patches

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Provide constructive feedback

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy contributing! 🚀**
