# Contributing to DepositGuard

Thank you for your interest in contributing to DepositGuard!

## Development Guidelines

1. **Clone & Install**:
   ```bash
   git clone https://github.com/pandeyaayush019ap-dev/depositguard.git
   cd depositguard
   npm install
   ```

2. **Branch Naming**:
   - `feat/feature-name`
   - `fix/issue-description`
   - `docs/documentation-update`

3. **Running Checks**:
   Before submitting a Pull Request, ensure that all automated tests pass:
   ```bash
   npm test
   npm run build
   ```

4. **Financial Invariants**:
   Any modifications to `src/lib/settlementCalculator.ts` must maintain:
   - Decimal safety (no IEEE 754 precision bugs)
   - Disputed deductions must NEVER reduce the refundable balance
   - Non-negative balances

## Code of Conduct
We are committed to providing a friendly, safe, and welcoming environment for all contributors.
