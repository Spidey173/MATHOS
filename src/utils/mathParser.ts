// Safe and robust algebraic expression parser implementing the Shunting-Yard algorithm.
// Supports: +, -, *, /, ^, %, parentheses, constants (pi, e), and scientific functions (sin, cos, tan, log, ln, sqrt, abs).

type TokenType = 'NUMBER' | 'OPERATOR' | 'FUNCTION' | 'LPAREN' | 'RPAREN' | 'CONSTANT';

interface Token {
  type: TokenType;
  value: string;
}

const OPERATORS: Record<string, { precedence: number; associativity: 'LEFT' | 'RIGHT' }> = {
  '+': { precedence: 2, associativity: 'LEFT' },
  '-': { precedence: 2, associativity: 'LEFT' },
  '*': { precedence: 3, associativity: 'LEFT' },
  '/': { precedence: 3, associativity: 'LEFT' },
  '%': { precedence: 3, associativity: 'LEFT' },
  '^': { precedence: 4, associativity: 'RIGHT' },
};

const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'exp']);
const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
  PI: Math.PI,
  E: Math.E,
};

// Tokenizer
export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  // Normalize string
  const cleanExpr = expr
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');

  while (i < cleanExpr.length) {
    const char = cleanExpr[i];

    if (char === '(') {
      // Check for implicit multiplication, e.g. 2(3) -> 2*(3)
      if (tokens.length > 0) {
        const prev = tokens[tokens.length - 1];
        if (prev.type === 'NUMBER' || prev.type === 'CONSTANT' || prev.type === 'RPAREN') {
          tokens.push({ type: 'OPERATOR', value: '*' });
        }
      }
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (char in OPERATORS) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // Number matching
    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < cleanExpr.length && /[0-9.]/.test(cleanExpr[i])) {
        numStr += cleanExpr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Alphabetic matching (functions or constants)
    if (/[a-zA-Z]/.test(char)) {
      let name = '';
      while (i < cleanExpr.length && /[a-zA-Z]/.test(cleanExpr[i])) {
        name += cleanExpr[i];
        i++;
      }

      if (FUNCTIONS.has(name)) {
        // Implicit multiplication check for func, e.g. 2sin(x) -> 2*sin(x)
        if (tokens.length > 0) {
          const prev = tokens[tokens.length - 1];
          if (prev.type === 'NUMBER' || prev.type === 'CONSTANT' || prev.type === 'RPAREN') {
            tokens.push({ type: 'OPERATOR', value: '*' });
          }
        }
        tokens.push({ type: 'FUNCTION', value: name });
      } else if (name in CONSTANTS) {
        // Implicit multiplication check for constant, e.g. 2pi -> 2*pi
        if (tokens.length > 0) {
          const prev = tokens[tokens.length - 1];
          if (prev.type === 'NUMBER' || prev.type === 'CONSTANT' || prev.type === 'RPAREN') {
            tokens.push({ type: 'OPERATOR', value: '*' });
          }
        }
        tokens.push({ type: 'CONSTANT', value: name });
      } else {
        throw new Error(`Unknown identifier: ${name}`);
      }
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}

// Convert Infix tokens to Postfix (RPN) using Shunting-Yard
export function shuntingYard(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER' || token.type === 'CONSTANT') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'OPERATOR') {
      // Unary operator handling
      // If current is '-' or '+' and it's at the start or after an operator/lparen,
      // we treat it as unary. For simplicity we prepend a 0 in the output queue.
      const isUnary =
        (token.value === '-' || token.value === '+') &&
        (i === 0 ||
          tokens[i - 1].type === 'OPERATOR' ||
          tokens[i - 1].type === 'LPAREN');

      if (isUnary) {
        if (token.value === '-') {
          outputQueue.push({ type: 'NUMBER', value: '0' });
          // Push unary negation
          operatorStack.push({ type: 'OPERATOR', value: '-' });
        }
        continue;
      }

      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'OPERATOR') {
          const o1 = token.value;
          const o2 = top.value;
          const o1Props = OPERATORS[o1];
          const o2Props = OPERATORS[o2];
          
          if (
            (o1Props.associativity === 'LEFT' && o1Props.precedence <= o2Props.precedence) ||
            (o1Props.associativity === 'RIGHT' && o1Props.precedence < o2Props.precedence)
          ) {
            outputQueue.push(operatorStack.pop()!);
          } else {
            break;
          }
        } else if (top.type === 'FUNCTION') {
          outputQueue.push(operatorStack.pop()!);
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      let foundLparen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'LPAREN') {
          operatorStack.pop();
          foundLparen = true;
          break;
        } else {
          outputQueue.push(operatorStack.pop()!);
        }
      }
      if (!foundLparen) {
        throw new Error('Mismatched parentheses (missing left parenthesis)');
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

// Evaluate Postfix expression
export function evaluatePostfix(postfix: Token[]): number {
  const stack: number[] = [];

  for (const token of postfix) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'CONSTANT') {
      stack.push(CONSTANTS[token.value] || 0);
    } else if (token.type === 'FUNCTION') {
      if (stack.length < 1) throw new Error(`Missing argument for function: ${token.value}`);
      const arg = stack.pop()!;
      let result = 0;
      switch (token.value) {
        case 'sin':
          result = Math.sin(arg);
          break;
        case 'cos':
          result = Math.cos(arg);
          break;
        case 'tan':
          result = Math.tan(arg);
          break;
        case 'log':
          result = Math.log10(arg);
          break;
        case 'ln':
          result = Math.log(arg);
          break;
        case 'sqrt':
          if (arg < 0) throw new Error('Square root of negative number');
          result = Math.sqrt(arg);
          break;
        case 'abs':
          result = Math.abs(arg);
          break;
        case 'exp':
          result = Math.exp(arg);
          break;
        default:
          throw new Error(`Unknown function: ${token.value}`);
      }
      stack.push(result);
    } else if (token.type === 'OPERATOR') {
      if (stack.length < 2) throw new Error(`Missing operand for operator: ${token.value}`);
      const b = stack.pop()!;
      const a = stack.pop()!;
      let result = 0;
      switch (token.value) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          result = a / b;
          break;
        case '%':
          result = a % b;
          break;
        case '^':
          result = Math.pow(a, b);
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }
      stack.push(result);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression evaluation');
  }

  return stack[0];
}

// Main execution function
export function parseAndEvaluate(expression: string): number {
  if (!expression.trim()) return 0;
  
  try {
    const tokens = tokenize(expression);
    const postfix = shuntingYard(tokens);
    const result = evaluatePostfix(postfix);
    
    if (isNaN(result) || !isFinite(result)) {
      throw new Error('Undefined result');
    }
    
    // Round to avoid IEEE 754 precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
    return Math.round(result * 1e10) / 1e10;
  } catch (error: any) {
    throw new Error(error.message || 'Syntax Error');
  }
}
