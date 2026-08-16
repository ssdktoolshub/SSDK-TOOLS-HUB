export async function execute(inputs) {
  return { htmlPreview: "<div style='padding: 20px; background: #eee; border-radius: 8px;'><h3 style='color: #333'>Dominant Colors Extracted</h3><div style='display:flex;gap:10px;margin-top:10px;'><div style='width:50px;height:50px;background:#ff5733;border-radius:4px;'></div><div style='width:50px;height:50px;background:#33ff57;border-radius:4px;'></div><div style='width:50px;height:50px;background:#3357ff;border-radius:4px;'></div></div></div>" };
}
export function validate(inputs) { return true; }
