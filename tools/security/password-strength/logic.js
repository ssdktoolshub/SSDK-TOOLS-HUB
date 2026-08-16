// Core Logic for Password Strength
export async function execute(inputs) {
    const pwd = inputs.inputData || "";
    let score = 0;
    if (pwd.length > 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    const strengths = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong", "Excellent"];
    return { outputData: strengths[score] || "Very Weak" };
}
export function validate(inputs) { return true; }
