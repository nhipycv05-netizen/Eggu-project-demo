const fs = require('fs');

const wf = JSON.parse(fs.readFileSync('./workflows/n8n-content-automation.json', 'utf8'));
const flow = wf[0] || wf;

// 1. Update b003-fb-ai-writer prompt
const node3 = flow.nodes.find(n => n.id === 'b003-fb-ai-writer');
if (node3) {
  node3.parameters.messages.values[0].content = `=Bạn là Chuyên viên Nội dung & Giám đốc Sáng tạo của thương hiệu EGGU - Bánh mì sandwich trứng Hàn Quốc.
Áp dụng kỹ năng 'social', 'copywriting', 'ad-creative' và 'image':

THÔNG TIN MÓN ĂN & GIÁ CHUẨN WEBSITE:
- Món ăn: {{ $json.dishName }}
- GIÁ NIÊM YẾT CHUẨN WEBSITE: {{ $json.dishPrice }}
- Góc tiếp cận hôm nay: {{ $json.targetAngle }}

YÊU CẦU QUAN TRỌNG VỀ CAPTION:
- Viết CAPTION BÁN HÀNG BÌNH THƯỜNG (quảng bá món ăn tự nhiên, hấp dẫn, kéo khách ghé tiệm hoặc đặt đơn).
- TUYỆT ĐỐI KHÔNG VIẾT LỜI CẢM ƠN (không cảm ơn khách hàng, không cảm ơn bạn nào, không nhắc tên tài khoản mạng xã hội hay nguồn ảnh trong caption).
- Giữ văn phong ẩm thực cuốn hút, đánh thức giác quan:
  1. Hook: Đánh trúng cơn đói, thời tiết se lạnh phố cổ, hoặc nhu cầu bữa sáng vội vã/xế chiều thư giãn.
  2. Thân bài (4-6 câu): Miêu tả vị giác chân thực chiếc bánh brioche nướng bơ tỏi vàng rụm, lớp trứng cuộn fluffy mềm mượt tan chảy, phô mai ngập tràn, thơm nức mũi.
  3. Giá bán: Nếu có nhắc giá trong bài, BẮT BUỘC dùng đúng số tiền niêm yết {{ $json.dishPrice }}.
  4. Kêu gọi hành động (CTA): Rủ bạn bè, đồng nghiệp gom đơn hoặc ghé tiệm.

QUY TẮC THIẾT KẾ BỐI CẢNH ẢNH AI THEO CAPTION (Product Consistency & Background Relighting):
1. GIỮ NGUYÊN CHỦ THỂ (100% Product Consistency): Chủ thể trung tâm luôn là chiếc bánh mì brioche sandwich trứng cuộn phô mai và chiếc hộp giấy EGGU màu trắng dải vàng đặc trưng của tiệm.
2. TỰ ĐỘNG BIẾN ĐỔI BỐI CẢNH THEO CAPTION:
   Dựa trên câu chuyện, thời gian, cảm xúc hoặc địa điểm trong caption (ví dụ: buổi sáng vội vã đi làm, ngồi chill quán cà phê, trời mưa se lạnh Hà Nội, bàn làm việc công sở, phố đi bộ cuối tuần...), hãy viết 1 prompt tiếng Anh chuyên nghiệp mô tả bối cảnh xung quanh (background) sao cho ánh sáng, bóng đổ và độ xóa phông (bokeh f/2.0) khớp tự nhiên với chiếc bánh.
   Ghi vào trường: "ai_image_prompt".
   Ví dụ: "Commercial food photography background, cozy rainy morning in Hanoi Old Quarter, blurred street view through rain-streaked cafe glass window, warm amber interior lighting, soft bokeh, ultra photorealistic, 8k".

TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON CHUẨN (KHÔNG BỌC TRONG CODE BLOCK MARKDOWN):
{
  "title": "Tiêu đề ngắn bài viết dưới 70 ký tự",
  "content": "Nội dung bài viết Facebook bán hàng bình thường (chưa cần đuôi footer)",
  "context_theme": "Tên ngữ cảnh (ví dụ: office_morning_rush, rainy_hanoi_cafe, cozy_cafe_chill, sunday_brunch, walking_street)",
  "ai_image_prompt": "Prompt tiếng Anh mô tả bối cảnh nền và ánh sáng đồng bộ với caption",
  "dish": "{{ $json.dishName }}"
}`;
}

// 2. Update b004-fb-ai-editor prompt
const node4 = flow.nodes.find(n => n.id === 'b004-fb-ai-editor');
if (node4) {
  node4.parameters.messages.values[0].content = `=Bạn là Tổng biên tập viên & Giám đốc Nghệ thuật của EGGU.
Áp dụng kỹ năng 'copy-editing' và 'image' để kiểm duyệt bài viết:

BÀI NHÁP:
{{ $json.content && $json.content.parts ? $json.content.parts.map(p => p.text).join('') : ($json.content || '') }}

TIÊU CHUẨN KIỂM DUYỆT:
1. Caption: Đảm bảo là caption bán hàng/quảng bá món ăn bình thường, tự nhiên (TUYỆT ĐỐI KHÔNG CẢM ƠN hay nhắc đến nick của ai). Xóa 'mùi AI', thân bài hấp dẫn 100 - 150 từ.
2. GIÁ BÁN: Giá niêm yết chuẩn trên website là: {{ $('Code - Lấy Ảnh Thật Từ Social (FB, IG, Threads)').item.json.dishPrice }}. Nếu bài viết ghi sai giá, BẮT BUỘC SỬA LẠI THÀNH {{ $('Code - Lấy Ảnh Thật Từ Social (FB, IG, Threads)').item.json.dishPrice }}.
3. ĐỒNG BỘ BỐI CẢNH ẢNH AI: Đảm bảo "ai_image_prompt" mô tả đúng bối cảnh, ánh sáng và chiều sâu trường ảnh (bokeh) theo đúng câu chuyện caption, bảo toàn nguyên vẹn chiếc bánh sandwich và hộp giấy EGGU chuẩn tiệm.

TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON CHUẨN (KHÔNG BỌC TRONG CODE BLOCK MARKDOWN):
{
  "title": "Tiêu đề ngắn bài viết",
  "content": "Nội dung bài viết Facebook đã biên tập hoàn chỉnh",
  "context_theme": "Tên ngữ cảnh bối cảnh",
  "ai_image_prompt": "Prompt tiếng Anh mô tả bối cảnh nền và ánh sáng",
  "dish": "{{ $('Code - Lấy Ảnh Thật Từ Social (FB, IG, Threads)').item.json.dishName }}"
}`;
}

// 3. Update b005-fb-format-output
const node5 = flow.nodes.find(n => n.id === 'b005-fb-format-output');
if (node5) {
  node5.parameters.jsCode = `let rawText = '';
if ($json.content && Array.isArray($json.content.parts)) {
  rawText = $json.content.parts.map(p => p.text || '').join('');
} else if (typeof $json.text === 'string') {
  rawText = $json.text;
} else if (typeof $json.content === 'string') {
  rawText = $json.content;
}

if (!rawText || $json.error) {
  try {
    const writerNode = $('AI Writer (Gemini - Viết Nháp FB & Đạo Diễn Poster)');
    if (writerNode && writerNode.item && writerNode.item.json) {
      const wJson = writerNode.item.json;
      if (wJson.content && Array.isArray(wJson.content.parts)) {
        rawText = wJson.content.parts.map(p => p.text || '').join('');
      } else if (typeof wJson.text === 'string') {
        rawText = wJson.text;
      } else if (typeof wJson.content === 'string') {
        rawText = wJson.content;
      }
    }
  } catch (e) {}
}

rawText = (rawText || '').trim();
let cleanText = rawText.replace(/^\\s*\`\`\`(?:json)?/i, '').replace(/\`\`\`\\s*$/i, '').trim();

const dishInfo = $('Code - Lấy Ảnh Thật Từ Social (FB, IG, Threads)').item.json;

const exactFooter = \`🥪Tiktok: https://www.tiktok.com/@eggu_sandwich?_r=1&_t=ZS-9AH0avwHF7l
👉Website: https://eggusandwich.id.vn/
📍 54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội
🛵 Giao hàng thần tốc trên: Website/ ShopeeFood / Grab / Be / Green / EGets
📞 0356 779 899
⏰ 07:00 – 21:00
#Eggu #SandwichHanQuoc #EggSandwich #FoodInHanoi #newwebsite #anvatHoGuom\`;

let parsed = null;
try {
  parsed = JSON.parse(cleanText);
} catch (e) {
  const titleM = cleanText.match(/"title"\\s*:\\s*"([^"]+)"/);
  const contentM = cleanText.match(/"content"\\s*:\\s*"([\\s\\S]*?)"\\s*,\\s*"(?:ai_image_prompt|dish|context_theme)/);
  const promptM = cleanText.match(/"ai_image_prompt"\\s*:\\s*"([^"]+)"/);
  const themeM = cleanText.match(/"context_theme"\\s*:\\s*"([^"]+)"/);

  parsed = {
    title: titleM ? titleM[1] : ('EGGU - ' + dishInfo.dishName),
    content: contentM ? contentM[1].replace(/\\\\n/g, '\\n').replace(/\\\\"/g, '"') : null,
    ai_image_prompt: promptM ? promptM[1] : null,
    context_theme: themeM ? themeM[1] : null
  };
}

let finalContent = parsed && parsed.content ? parsed.content.trim() : '';

if (!finalContent || finalContent.startsWith('{') || finalContent.length < 50) {
  finalContent = \`Bắt đầu ngày mới cùng chiếc bánh mì sandwich trứng Hàn Quốc \${dishInfo.dishName} nóng hổi, giòn rụm từ EGGU!\\n\\nLớp bánh brioche nướng bơ tỏi thơm lừng, ôm trọn phần trứng cuộn fluffy mềm mượt tan chảy cùng phô mai béo ngậy kéo sợi và sốt đặc trưng chuẩn vị Seoul. Từng miếng cắn đậm đà, no lâu mà lại cực kỳ sạch tay, hoàn hảo cho bữa sáng hoặc xế chiều.\\n\\n👉 Giá niêm yết: \${dishInfo.dishPrice}\`;
}

// Chuẩn hóa đuôi footer 100%
const bodyOnly = finalContent.split(/🥪Tiktok|👉Website|📍 54 Nguyễn Hữu Huân|#Eggu|#EGGU/)[0].trim();
finalContent = bodyOnly + '\\n\\n' + exactFooter;

// Prompt bối cảnh chụp ảnh food photography dựa trên câu chuyện của Caption
const defaultAiPrompt = \`Commercial advertising food photography background, aesthetic Seoul cafe ambient lighting, warm shallow depth of field bokeh, ultra photorealistic, 8k\`;
const aiImagePrompt = (parsed && parsed.ai_image_prompt) || defaultAiPrompt;

// 1 TẤM ẢNH AI THIẾT KẾ RIÊNG: Bảo toàn 100% sản phẩm & bao bì chuẩn EGGU, biến đổi bối cảnh theo Caption
const contextLayoutMapping = {
  'SANDWICH THỊT HỘP, PHÔ MAI & NORI': 'ai-concept-spam-nori-tray.jpg',
  'SANDWICH THỊT XÔNG KHÓI NGÔ PHÔ MAI': 'ai-concept-corn-bacon-macro.jpg',
  'SANDWICH NƯỚNG KIỂU PHÁP': 'ai-concept-french-toast-warm.jpg',
  'SANDWICH THỊT XÔNG KHÓI BƠ TỎI PHÔ MAI': 'ai-concept-bacon-garlic-bestseller.jpg',
  'SANDWICH CÁ NGỪ PHÔ MAI': 'ai-concept-tuna-melt-crunch.jpg',
  'Mr. Egg': 'ai-concept-mr-egg-street.jpg'
};

const selectedLayout = contextLayoutMapping[dishInfo.dishName] || 'ai-concept-mr-egg-street.jpg';
const aiPhotoUrl = 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/' + selectedLayout + '?v=' + Date.now();

// Danh sách 4-5 ảnh thật đã chọn lọc (100% ảnh thật chụp tại quán & dạo phố)
const realPhotosArray = dishInfo.realPhotos || [dishInfo.photoUrl];
const realPhotosJsonString = JSON.stringify(realPhotosArray);

const finalTitle = (parsed && parsed.title) || ('EGGU - ' + dishInfo.dishName);

// Tạo payload cho Google Sheets
const sheetsPayload = {
  "Mã bài viết": 'FB-' + Date.now(),
  "Tiêu đề": finalTitle,
  "Món ăn": dishInfo.dishName + ' (Giá web: ' + dishInfo.dishPrice + ')',
  "Nội dung Facebook (Đã biên tập)": finalContent,
  "📸 ẢNH THẬT 1": realPhotosArray[0] || '',
  "📸 ẢNH THẬT 2": realPhotosArray[1] || '',
  "📸 ẢNH THẬT 3": realPhotosArray[2] || '',
  "📸 ẢNH THẬT 4": realPhotosArray[3] || '',
  "📸 ẢNH THẬT 5": realPhotosArray[4] || '',
  "🎨 ẢNH AI THIẾT KẾ RIÊNG (Theo Caption)": aiPhotoUrl,
  "💡 Prompt Bối Cảnh AI (Background Lighting)": aiImagePrompt,
  "Gợi ý đăng bài": "Đăng album gồm 4-5 ảnh thật kèm ảnh concept AI để tạo tương tác cao nhất!",
  "Trạng thái": "Chờ nhân viên copy",
  "Thời gian tạo": new Date().toLocaleString('vi-VN')
};

return [
  {
    json: {
      title: finalTitle,
      dishName: dishInfo.dishName,
      dishCategory: dishInfo.photoTag,
      dishPrice: dishInfo.dishPrice,
      targetAngle: dishInfo.targetAngle,
      content: finalContent,
      realPhotoUrl: realPhotosJsonString,
      aiPhotoUrl: aiPhotoUrl,
      aiImagePrompt: aiImagePrompt,
      realPhotosList: realPhotosArray,
      sheetsPayload: sheetsPayload,
      sheetsPayloadJson: JSON.stringify(sheetsPayload),
      status: 'PENDING'
    }
  }
];`;
}

fs.writeFileSync('./workflows/n8n-content-automation.json', JSON.stringify(wf, null, 2), 'utf8');
console.log('Successfully updated workflows/n8n-content-automation.json with context analysis and product preservation pipeline!');
