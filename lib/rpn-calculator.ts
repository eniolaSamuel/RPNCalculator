/**
 * RPN Calculator Logic
 *
 * Evaluates Reverse Polish Notation expressions using a stack-based algorithm.
 */

const SUPPORTED_OPERATORS = new Set(["+", "-", "*", "/", "^", "sqrt", "sin", "cos", "tan"])

/**
 * Checks if a token is a valid number
 */
function isNumber(token: string): boolean {
    return !isNaN(Number.parseFloat(token)) && isFinite(Number.parseFloat(token))
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
}

/**
 * Processes a binary operator (requires 2 operands)
 */
function processBinaryOperator(stack: number[], operator: string): void {
    if (stack.length < 2) {
        throw new Error(`Insufficient operands for operator '${operator}'`)
    }

    const b = stack.pop()!
    const a = stack.pop()!

    switch (operator) {
        case "+":
            stack.push(a + b)
            break
        case "-":
            stack.push(a - b)
            break
        case "*":
            stack.push(a * b)
            break
        case "/":
            if (b === 0) {
                throw new Error("Division by zero")
            }
            stack.push(a / b)
            break
        case "^":
            stack.push(Math.pow(a, b))
            break
        default:
            throw new Error(`Unknown binary operator: ${operator}`)
    }
}

/**
 * Processes a unary operator (requires 1 operand)
 */
function processUnaryOperator(stack: number[], operator: string): void {
    if (stack.length < 1) {
        throw new Error(`Insufficient operands for operator '${operator}'`)
    }

    const a = stack.pop()!

    switch (operator) {
        case "sqrt":
            if (a < 0) {
                throw new Error("Square root of negative number")
            }
            stack.push(Math.sqrt(a))
            break
        case "sin":
            stack.push(Math.sin(toRadians(a)))
            break
        case "cos":
            stack.push(Math.cos(toRadians(a)))
            break
        case "tan":
            stack.push(Math.tan(toRadians(a)))
            break
        default:
            throw new Error(`Unknown unary operator: ${operator}`)
    }
}

/**
 * Evaluates an RPN expression
 * @param expression Space-separated RPN expression
 * @returns The calculated result
 * @throws Error if the expression is invalid
 */
export function evaluateRPN(expression: string): number {
    if (!expression || expression.trim().length === 0) {
        throw new Error("Expression cannot be empty")
    }

    const tokens = expression.trim().split(/\s+/)
    const stack: number[] = []

    for (const token of tokens) {
        if (isNumber(token)) {
            // Push numbers onto the stack
            stack.push(Number.parseFloat(token))
        } else if (SUPPORTED_OPERATORS.has(token)) {
            // Process operators
            if (["sqrt", "sin", "cos", "tan"].includes(token)) {
                processUnaryOperator(stack, token)
            } else {
                processBinaryOperator(stack, token)
            }
        } else {
            throw new Error(`Unknown token: '${token}'`)
        }
    }

    // After processing all tokens, there should be exactly one value left
    if (stack.length !== 1) {
        if (stack.length > 1) {
            throw new Error("Invalid expression: too many operands")
        } else {
            throw new Error("Invalid expression: insufficient operands")
        }
    }

    return stack[0]
}

export function validateRPN(expression: string): boolean {
    try {
        evaluateRPN(expression)
        return true
    } catch (error) {
        return false
    }
}

export function getEvaluationSteps(expression: string): { token: string; stack: number[]; action: string }[] {
    const tokens = expression.trim().split(/\s+/)
    const stack: number[] = []
    const steps: { token: string; stack: number[]; action: string }[] = []

    for (const token of tokens) {
        if (isNumber(token)) {
            // Push numbers onto the stack
            stack.push(Number.parseFloat(token))
            steps.push({ token, stack: [...stack], action: `Push ${token}` })
        } else if (SUPPORTED_OPERATORS.has(token)) {
            // Process operators
            if (["sqrt", "sin", "cos", "tan"].includes(token)) {
                const a = stack.pop()!
                let result: number
                switch (token) {
                    case "sqrt":
                        result = Math.sqrt(a)
                        break
                    case "sin":
                        result = Math.sin(toRadians(a))
                        break
                    case "cos":
                        result = Math.cos(toRadians(a))
                        break
                    case "tan":
                        result = Math.tan(toRadians(a))
                        break
                    default:
                        result = Number.NaN
                }
                stack.push(result)
                steps.push({ token, stack: [...stack], action: `Apply ${token} to ${a}` })
            } else {
                const b = stack.pop()!
                const a = stack.pop()!
                let result: number
                switch (token) {
                    case "+":
                        result = a + b
                        break
                    case "-":
                        result = a - b
                        break
                    case "*":
                        result = a * b
                        break
                    case "/":
                        result = a / b
                        break
                    case "^":
                        result = Math.pow(a, b)
                        break
                    default:
                        result = Number.NaN
                }
                stack.push(result)
                steps.push({ token, stack: [...stack], action: `Apply ${a} ${token} ${b}` })
            }
        }
    }

    return steps
}
