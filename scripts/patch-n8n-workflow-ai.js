const fs = require('fs');
const wf = JSON.parse(fs.readFileSync('./workflows/n8n-content-automation.json', 'utf8'));
const flow = wf[0] || wf;
const node = flow.nodes.find(n => n.id === 'b005-fb-format-output');

const oldStr = node.parameters.jsCode;
const replacement = `const aiBrandedMapping = {
  'SANDWICH THỊT BÒ NƯỚNG TERIYAKI': 'ai-branded-beef-teriyaki.jpg',
  'SANDWICH THỊT HỘP, PHÔ MAI & NORI': 'ai-branded-beef-teriyaki.jpg',
  'SANDWICH THỊT XÔNG KHÓI BƠ TỎI PHÔ MAI': 'ai-branded-bacon-cheese.jpg',
  'SANDWICH DĂM BÔNG PHÔ MAI MỸ': 'ai-branded-ham-cheese.jpg',
  'SANDWICH TRỨNG PHÔ MAI': 'ai-branded-fluffy-egg.jpg',
  'SANDWICH CÁ NGỪ PHÔ MAI': 'ai-branded-tuna-melt.jpg',
  'SANDWICH GÀ NƯỚNG PESTO': 'ai-branded-chicken-pesto.jpg',
  'SANDWICH THỊT XÔNG KHÓI NGÔ PHÔ MAI': 'ai-branded-corn-bacon.jpg',
  'SANDWICH NƯỚNG KIỂU PHÁP': 'ai-branded-french-toast.jpg'
};
const aiPhotoUrl = 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/' + (aiBrandedMapping[dishInfo.dishName] || 'ai-branded-bacon-cheese.jpg');`;

node.parameters.jsCode = oldStr.replace(/const aiPhotoUrl = [^;]+;/, replacement);

fs.writeFileSync('./workflows/n8n-content-automation.json', JSON.stringify(wf, null, 2), 'utf8');
console.log('Successfully updated b005-fb-format-output in workflows/n8n-content-automation.json');
