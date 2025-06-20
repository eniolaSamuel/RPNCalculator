# RPN Calculator

A modern Reverse Polish Notation (RPN) Calculator built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ **Beautiful Web Interface** - Modern, responsive design
- ✅ **Real-time Calculation** - Type and calculate instantly
- ✅ **History Feature** - See your previous calculations
- ✅ **Quick Insert Buttons** - Easy operator insertion
- ✅ **Help Section** - Built-in examples and explanations
- ✅ **Error Handling** - Clear error messages
- ✅ **Mobile Friendly** - Works on all devices

## Supported Operations

| Operator | Description | Example |
|----------|-------------|---------|
| + | Addition | `3 4 +` → 7 |
| - | Subtraction | `7 3 -` → 4 |
| * | Multiplication | `3 4 *` → 12 |
| / | Division | `8 2 /` → 4 |
| ^ | Power | `2 3 ^` → 8 |
| sqrt | Square Root | `9 sqrt` → 3 |
| sin | Sine (degrees) | `90 sin` → 1 |
| cos | Cosine (degrees) | `0 cos` → 1 |
| tan | Tangent (degrees) | `45 tan` → 1 |

## Getting Started

### Prerequisites
- Node.js 18 or higher

### Installation

1. **Clone or download the project**
2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`
3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
4. **Open your browser and navigate to:**
   \`\`\`
   http://localhost:3000
   \`\`\`

## Usage Examples

- `3 4 +` → 7
- `10 3 -` → 7
- `6 7 *` → 42
- `16 sqrt` → 4
- `3 4 + 5 *` → 35
- `90 sin` → 1

## What is RPN?

Reverse Polish Notation (RPN) is a mathematical notation where operators follow their operands. This eliminates the need for parentheses and operator precedence rules.

**Examples:**
- Infix: `3 + 4` → RPN: `3 4 +`
- Infix: `(3 + 4) * 5` → RPN: `3 4 + 5 *`
- Infix: `3 + 4 * 5` → RPN: `3 4 5 * +`



## License

This project is open source and available under the MIT License.
