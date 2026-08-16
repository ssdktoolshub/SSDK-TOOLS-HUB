export async function execute(inputs) {
  const code = inputs.inputData;
  if (!code || !code.trim()) {
    return { outputData: "No code provided." };
  }

  try {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    if (!window.pyodideInstance) {
      window.pyodideInstance = await window.loadPyodide();
    }

    let output = '';
    window.pyodideInstance.setStdout({ batched: (msg) => { output += msg + '\\n'; } });
    window.pyodideInstance.setStderr({ batched: (msg) => { output += msg + '\\n'; } });

    const result = await window.pyodideInstance.runPythonAsync(code);
    
    if (result !== undefined) {
      output += result + '\\n';
    }

    return { outputData: output.trim() || "Execution complete with no output." };
  } catch (error) {
    return { outputData: "Error:\\n" + error.message };
  }
}

export function validate(inputs) {
  return !!(inputs && inputs.inputData && inputs.inputData.trim());
}
