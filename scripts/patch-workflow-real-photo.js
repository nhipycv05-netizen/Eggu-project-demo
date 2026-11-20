const fs = require('fs');
const wf = JSON.parse(fs.readFileSync('./workflows/n8n-content-automation.json', 'utf8'));
const flow = wf[0] || wf;
const node = flow.nodes.find(n => n.id === 'b002-fb-context');

const realUrl = 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/real-customer-tray-streetwalk.jpg';
if (!node.parameters.jsCode.includes('real-customer-tray-streetwalk.jpg')) {
  node.parameters.jsCode = node.parameters.jsCode.replace(
    'const realSocialPhotos = [',
    `const realSocialPhotos = [
  {
    dishName: "SANDWICH THỊT HỘP, PHÔ MAI & NORI",
    source: "Threads",
    sourceHandle: "@eggu_hanoi_checkin",
    url: "${realUrl}"
  },`
  );
  fs.writeFileSync('./workflows/n8n-content-automation.json', JSON.stringify(wf, null, 2), 'utf8');
  console.log('Added real customer photo to b002-fb-context');
} else {
  console.log('Already present in b002-fb-context');
}
