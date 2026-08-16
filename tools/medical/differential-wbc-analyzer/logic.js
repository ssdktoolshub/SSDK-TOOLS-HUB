export async function execute(inputs = {}) {
  const neut = parseFloat(inputs.neutrophils || inputs.neut || 60);
  const lymph = parseFloat(inputs.lymphocytes || inputs.lymph || 30);
  const mono = parseFloat(inputs.monocytes || inputs.mono || 6);
  const eos = parseFloat(inputs.eosinophils || inputs.eos || 3);
  const baso = parseFloat(inputs.basophils || inputs.baso || 1);

  const total = neut + lymph + mono + eos + baso;
  const result = `Differential WBC Count:\n- Neutrophils: ${neut}% (Normal: 40-75%)\n- Lymphocytes: ${lymph}% (Normal: 20-45%)\n- Monocytes: ${mono}% (Normal: 2-10%)\n- Eosinophils: ${eos}% (Normal: 1-6%)\n- Basophils: ${baso}% (Normal: 0-2%)\nTotal: ${total}%\nStatus: ${total === 100 ? 'Percentages balanced (100%)' : 'Note: Sum of percentages is ' + total + '%'}`;
  
  return { toolOutput: result };
}
export function validate(inputs) { return true; }
