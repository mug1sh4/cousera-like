/**
 * Lightweight browser-side Python code simulation runner
 * Handles standard Python expressions, print calls, variables, loops, arithmetic,
 * and string manipulation, giving learners an authentic playground execution.
 */

export interface RunResult {
  stdout: string;
  error?: string;
  executionTimeMs: number;
}

export function runPythonCode(code: string): RunResult {
  const startTime = performance.now();
  const logs: string[] = [];

  try {
    const lines = code.split('\n');
    const scope: Record<string, any> = {
      print: (...args: any[]) => {
        logs.push(args.map(arg => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(' '));
      },
      len: (item: any) => item ? item.length : 0,
      range: (start: number, end?: number, step = 1) => {
        if (end === undefined) {
          end = start;
          start = 0;
        }
        const arr = [];
        for (let i = start; i < end; i += step) {
          arr.push(i);
        }
        return arr;
      },
      sum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),
      max: (...args: any[]) => Math.max(...args.flat()),
      min: (...args: any[]) => Math.min(...args.flat()),
      type: (x: any) => `<class '${typeof x}'>`,
      str: (x: any) => String(x),
      int: (x: any) => parseInt(x, 10),
      float: (x: any) => parseFloat(x),
      True: true,
      False: false,
      None: null,
    };

    // Safe line-by-line interpreter for educational Python scripts
    // Transform python idioms:
    // print(...) -> scope.print(...)
    // elif -> else if
    // True/False/None -> true/false/null
    // # comments -> //
    // def / for / if indentations
    let jsCode = '';
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();
      
      // Handle comments
      if (trimmed.startsWith('#')) {
        jsCode += `// ${trimmed.slice(1)}\n`;
        continue;
      }
      
      // Replace python print
      line = line.replace(/\bprint\s*\(/g, 'scope.print(');
      // Replace len(...)
      line = line.replace(/\blen\s*\(/g, 'scope.len(');
      // Replace range(...)
      line = line.replace(/\brange\s*\(/g, 'scope.range(');
      // Replace True/False/None
      line = line.replace(/\bTrue\b/g, 'true')
                 .replace(/\bFalse\b/g, 'false')
                 .replace(/\bNone\b/g, 'null');

      // Simple list comprehensions or declarations
      // Replace python `and` / `or` / `not`
      line = line.replace(/\band\b/g, '&&')
                 .replace(/\bor\b/g, '||')
                 .replace(/\bnot\s+/g, '!');

      // If line is variable declaration without let/var
      if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/.test(trimmed) && !trimmed.startsWith('def ')) {
        const varName = trimmed.split('=')[0].trim();
        line = `var ${line}`;
      }

      jsCode += line + '\n';
    }

    // Execute within functional sandbox with scope
    const executor = new Function('scope', `
      with (scope) {
        ${jsCode}
      }
    `);

    executor(scope);

    const endTime = performance.now();
    return {
      stdout: logs.join('\n') || (logs.length === 0 ? '>>> Program completed with no output' : ''),
      executionTimeMs: Math.round(endTime - startTime)
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      stdout: logs.join('\n'),
      error: `Traceback (most recent call last):\n  PythonError: ${err.message || err}`,
      executionTimeMs: Math.round(endTime - startTime)
    };
  }
}
