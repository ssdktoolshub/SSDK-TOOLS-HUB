export async function execute(inputs = {}) {
  const eye = parseInt(inputs.eye || 4);
  const verbal = parseInt(inputs.verbal || 5);
  const motor = parseInt(inputs.motor || 6);
  const total = eye + verbal + motor;

  let severity = "Mild Head Injury / Normal (GCS 13 - 15)";
  if (total <= 8) severity = "Severe Brain Injury / Coma (GCS ≤ 8) - Airway protection required";
  else if (total <= 12) severity = "Moderate Brain Injury (GCS 9 - 12)";

  return {
    toolOutput: `Glasgow Coma Scale (GCS) Total: ${total} / 15\n- Eye Response (E): ${eye} / 4\n- Verbal Response (V): ${verbal} / 5\n- Motor Response (M): ${motor} / 6\nSeverity Classification: ${severity}`
  };
}
export function validate(inputs) { return true; }
