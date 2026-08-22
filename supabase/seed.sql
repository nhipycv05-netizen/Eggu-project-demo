-- Seed data for EGGU Korean Egg Sandwich

-- 1. Insert Categories
insert into public.categories (id, name_vi, name_en, slug, image_url, sort_order, is_active) values
('1a111111-1111-1111-1111-111111111111', 'Bánh Mì Kẹp', 'Sandwich', 'sandwich', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/sandwich.jpg', 1, true),
('2b222222-2222-2222-2222-222222222222', 'Bánh Mì Nướng', 'Toast', 'toast', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/toast.jpg', 2, true),
('3c333333-3333-3333-3333-333333333333', 'Bánh Vòng', 'Bagel', 'bagel', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/bagel.jpg', 3, true),
('4d444444-4444-4444-4444-444444444444', 'Bữa Sáng Trễ', 'Brunch', 'brunch', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/brunch.jpg', 4, true),
('5e555555-5555-5555-5555-555555555555', 'Món Phụ', 'Side', 'side', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/side.jpg', 5, true),
('6f666666-6666-6666-6666-666666666666', 'Nước Giải Khát', 'Drinks', 'drinks', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/drinks.jpg', 6, true),
('7a777777-7777-7777-7777-777777777777', 'Cà Phê', 'Coffee', 'coffee', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/coffee.jpg', 7, true),
('8b888888-8888-8888-8888-888888888888', 'Combo Tiết Kiệm', 'Combo', 'combo', 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/categories/combo.jpg', 8, true);

-- 2. Insert Products
insert into public.products (id, category_id, name_vi, name_en, slug, description_vi, description_en, price, image_url, ingredients_vi, ingredients_en, nutrition, allergy_info_vi, allergy_info_en, is_new, is_best_seller, is_active, sort_order) values
-- Sandwiches
('9a999999-9999-9999-9999-999999999999', '1a111111-1111-1111-1111-111111111111', 
 'Mr. Egg', 'Mr. Egg', 'mr-egg', 
 'Bánh mì nướng bơ tỏi thơm lừng kẹp trứng khuấy mềm béo và sốt sriracha ngọt dịu đặc trưng.', 
 'Garlic butter toast filled with fluffy soft-scrambled eggs and our signature sweet sriracha mayo sauce.', 
 39000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/mr-egg.jpg',
 'Trứng khuấy mềm, Bánh mì brioche, Sốt Eggu ngọt dịu, Bơ', 'Fluffy Scrambled Eggs, Brioche Bread, Signature Eggu Mayo, Garlic Butter',
 '{"calories": 480, "protein": "15g", "fat": "22g", "carbs": "45g"}',
 'Có chứa trứng, sữa, gluten từ lúa mì.', 'Contains eggs, dairy, wheat gluten.',
 false, true, true, 1),

('afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1a111111-1111-1111-1111-111111111111', 
 'Bánh Mì Thịt Nguội & Phô Mai', 'American Ham & Cheese', 'american-ham-cheese', 
 'Sự kết hợp cổ điển của trứng khuấy bông mềm, thịt nguội cao cấp và phô mai Cheddar tan chảy.', 
 'A classic combination of fluffy soft-scrambled eggs, premium ham slices, and melted Cheddar cheese.', 
 49000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/american-ham-cheese.jpg',
 'Trứng khuấy mềm, Thịt nguội, Phô mai Cheddar, Bánh mì brioche, Sốt đặc trưng', 'Fluffy Scrambled Eggs, Ham, Cheddar Cheese, Brioche Bread, Signature Sauce',
 '{"calories": 520, "protein": "19g", "fat": "26g", "carbs": "46g"}',
 'Có chứa trứng, sữa, lúa mì, đậu nành.', 'Contains eggs, dairy, wheat, soy.',
 false, true, true, 2),

('bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1a111111-1111-1111-1111-111111111111', 
 'Bánh Mì Thịt Xông Khói & Phô Mai Kép', 'Bacon Double Cheese', 'bacon-double-cheese', 
 'Dành cho tín đồ thịt xông khói với thịt xông khói giòn rụm nhân đôi, trứng khuấy mềm và phô mai Cheddar kép.', 
 'Double crispy bacon, fluffy soft-scrambled eggs, and double melted Cheddar cheese on toasted brioche.', 
 55000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/bacon-double-cheese.jpg',
 'Thịt xông khói (nhân đôi), Phô mai Cheddar (nhân đôi), Trứng khuấy mềm, Bánh mì brioche', 'Double Bacon, Double Cheddar Cheese, Fluffy Scrambled Eggs, Brioche Bread',
 '{"calories": 610, "protein": "22g", "fat": "34g", "carbs": "44g"}',
 'Có chứa trứng, sữa, lúa mì.', 'Contains eggs, dairy, wheat.',
 false, true, true, 3),

('cfcccccc-cccc-cccc-cccc-cccccccccccc', '1a111111-1111-1111-1111-111111111111', 
 'Bơ Sáp Tươi Holic', 'Avocado Holic', 'avocado-holic', 
 'Trứng khuấy thơm ngon kết hợp cùng bơ sáp tươi cắt lát bùi ngậy và sốt trứng đặc chế.', 
 'Rich soft-scrambled eggs combined with fresh sliced creamy avocado and signature egg sauce.', 
 59000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/avocado-holic.jpg',
 'Bơ tươi thái lát, Trứng khuấy mềm, Sốt mù tạt mật ong, Bánh mì brioche', 'Fresh Avocado Slices, Fluffy Scrambled Eggs, Honey Mustard Sauce, Brioche Bread',
 '{"calories": 540, "protein": "14g", "fat": "28g", "carbs": "48g"}',
 'Có chứa trứng, sữa, gluten, hạt.', 'Contains eggs, dairy, gluten, seeds.',
 true, false, true, 4),

-- Toast
('dfdddddd-dddd-dddd-dddd-dddddddddddd', '2b222222-2222-2222-2222-222222222222', 
 'Bánh Mì Tỏi Thịt Xông Khói & Phô Mai', 'Garlic Bacon Cheese Toast', 'garlic-bacon-cheese-toast', 
 'Bánh mì nướng tỏi thơm nồng kẹp phô mai, thịt xông khói giòn và nước sốt mật ong ngọt ngào.', 
 'Toasted garlic bread loaded with crispy bacon, melted cheese, and a sweet drizzle of honey.', 
 52000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/garlic-bacon-cheese.jpg',
 'Bánh mì tỏi, Thịt xông khói, Phô mai, Sốt mật ong', 'Garlic Bread, Bacon, Cheese, Honey Sauce',
 '{"calories": 490, "protein": "16g", "fat": "24g", "carbs": "51g"}',
 'Có chứa gluten, tỏi, sữa.', 'Contains gluten, garlic, dairy.',
 true, true, true, 5),

-- Sides
('efeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '5e555555-5555-5555-5555-555555555555', 
 'Khoai Tây Chiên Pháp', 'French Fries', 'french-fries', 
 'Khoai tây chiên giòn vàng đều, phủ nhẹ muối biển nhuyễn.', 
 'Golden crispy French fries lightly dusted with fine sea salt.', 
 29000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/french-fries.jpg',
 'Khoai tây tươi, Dầu thực vật, Muối biển', 'Potatoes, Vegetable Oil, Sea Salt',
 '{"calories": 310, "protein": "3g", "fat": "15g", "carbs": "40g"}',
 'Không chứa tác nhân dị ứng phổ biến.', 'Free from common allergens.',
 false, false, true, 6),

-- Coffee
('aff77777-7777-7777-7777-777777777777', '7a777777-7777-7777-7777-777777777777', 
 'Cà Phê Americano Đá', 'Iced Americano', 'iced-americano', 
 'Cà phê espresso nguyên chất pha với nước lạnh và đá, đậm đà tỉnh táo.', 
 'Rich espresso shot mixed with cold water and ice for a crisp, refreshing kick.', 
 29000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/iced-americano.jpg',
 'Hạt cà phê Arabica & Robusta, Nước lọc, Đá', 'Arabica & Robusta Coffee Beans, Water, Ice',
 '{"calories": 15, "protein": "0.5g", "fat": "0g", "carbs": "3g"}',
 'Chứa caffeine.', 'Contains caffeine.',
 false, true, true, 7),

('bff77777-7777-7777-7777-777777777777', '7a777777-7777-7777-7777-777777777777', 
 'Cà Phê Bạc Xỉu Đá', 'Iced White Coffee', 'iced-white-coffee', 
 'Cà phê pha phin truyền thống hòa quyện cùng lượng sữa đặc ngọt ngào béo ngậy.', 
 'Traditional Vietnamese coffee blended with a generous sweet splash of condensed milk and fresh milk.', 
 35000.00, 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/iced-white-coffee.jpg',
 'Cà phê espresso, Sữa đặc, Sữa tươi, Đá', 'Espresso, Condensed Milk, Fresh Milk, Ice',
 '{"calories": 220, "protein": "5g", "fat": "6g", "carbs": "32g"}',
 'Có chứa sữa, caffeine.', 'Contains dairy, caffeine.',
 false, true, true, 8);

-- 3. Insert Product Options
insert into public.product_options (id, product_id, name_vi, name_en, price, is_active, sort_order) values
-- Options for Mr. Egg
(gen_random_uuid(), '9a999999-9999-9999-9999-999999999999', 'Thêm Phô Mai Cheddar', 'Extra Cheddar Cheese', 10000.00, true, 1),
(gen_random_uuid(), '9a999999-9999-9999-9999-999999999999', 'Thêm Thịt Xông Khói', 'Extra Crispy Bacon', 15000.00, true, 2),
(gen_random_uuid(), '9a999999-9999-9999-9999-999999999999', 'Thêm Bơ Sáp Tươi', 'Extra Sliced Avocado', 15000.00, true, 3),

-- Options for American Ham & Cheese
(gen_random_uuid(), 'afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Thêm Phô Mai Cheddar', 'Extra Cheddar Cheese', 10000.00, true, 1),
(gen_random_uuid(), 'afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Thêm Thịt Xông Khói', 'Extra Crispy Bacon', 15000.00, true, 2),
(gen_random_uuid(), 'afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Thêm Trứng Khuấy', 'Extra Scrambled Egg', 12000.00, true, 3),

-- Options for Bacon Double Cheese
(gen_random_uuid(), 'bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Thêm Phô Mai Cheddar', 'Extra Cheddar Cheese', 10000.00, true, 1),
(gen_random_uuid(), 'bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Thêm Thịt Xông Khói', 'Extra Crispy Bacon', 15000.00, true, 2),

-- Options for Avocado Holic
(gen_random_uuid(), 'cfcccccc-cccc-cccc-cccc-cccccccccccc', 'Thêm Phô Mai Cheddar', 'Extra Cheddar Cheese', 10000.00, true, 1),
(gen_random_uuid(), 'cfcccccc-cccc-cccc-cccc-cccccccccccc', 'Thêm Bơ Sáp Tươi', 'Extra Sliced Avocado', 15000.00, true, 2);

-- 4. Insert Stores
insert into public.stores (id, name_vi, name_en, address_vi, address_en, phone, latitude, longitude, opening_hours_vi, opening_hours_en, is_active) values
(gen_random_uuid(), 'EGGU Nguyễn Huệ (Quận 1)', 'EGGU Nguyen Hue (District 1)', 
 '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', '123 Nguyen Hue, Ben Nghe Ward, District 1, Ho Chi Minh City', 
 '028 1234 5678', 10.7745, 106.7022, '07:00 - 22:00', '07:00 - 22:00', true),
(gen_random_uuid(), 'EGGU Nguyễn Đình Chiểu (Quận 3)', 'EGGU Nguyen Dinh Chieu (District 3)', 
 '456 Nguyễn Đình Chiểu, Phường 3, Quận 3, TP. Hồ Chí Minh', '456 Nguyen Dinh Chieu, Ward 3, District 3, Ho Chi Minh City', 
 '028 8765 4321', 10.7712, 106.6853, '07:00 - 22:00', '07:00 - 22:00', true);

-- 5. Insert FAQs
insert into public.faqs (id, question_vi, question_en, answer_vi, answer_en, category, sort_order, is_active) values
(gen_random_uuid(), 'Làm thế nào để tôi đặt hàng trực tuyến?', 'How do I place an order online?', 
 'Bạn có thể truy cập trang "Thực Đơn", chọn bánh mì và đồ uống ưa thích, tùy chỉnh thêm các topping (như trứng, thịt xông khói, phô mai) nếu muốn, sau đó click nút "Thanh toán". Nhập thông tin liên hệ và địa chỉ giao hàng để đặt hàng. Đơn hàng sẽ được thanh toán bằng hình thức COD (giao hàng nhận tiền) vô cùng tiện lợi mà không bắt buộc đăng ký tài khoản.',
 'Simply browse our "Menu" page, choose your desired sandwich or beverage, customize options (e.g. extra bacon, cheese, or eggs), and click checkout. Fill in your delivery details to complete the order. Payment is processed using COD (Cash on Delivery) without requiring any login/registration.', 
 'Ordering', 1, true),
(gen_random_uuid(), 'EGGU có hỗ trợ thanh toán trực tuyến như chuyển khoản hoặc thẻ tín dụng không?', 'Does EGGU support online payments like transfer or credit card?', 
 'Hiện tại để tối giản hóa quy trình phục vụ nhanh chóng và tin cậy nhất, EGGU chỉ áp dụng duy nhất một hình thức thanh toán là COD (Thanh toán bằng tiền mặt/COD khi nhận hàng). Chúng tôi chưa hỗ trợ các hình thức thanh toán online tại thời điểm này.',
 'To keep our operations simple and highly reliable, EGGU currently supports Cash on Delivery (COD) as the sole payment method. Online payments or bank transfers are not supported at this stage.', 
 'Payment', 2, true),
(gen_random_uuid(), 'EGGU giao hàng trong khoảng cách bao xa và mất bao lâu?', 'How far does EGGU deliver and how long does it take?', 
 'EGGU sẽ giao hàng tận nơi trong phạm vi bán kính tối đa 5km tính từ chi nhánh cửa hàng gần bạn nhất. Thời gian chuẩn bị bánh nóng hổi và vận chuyển thường dao động từ 15 đến 35 phút tùy thuộc cự ly địa chỉ nhận hàng.',
 'EGGU delivers within a maximum radius of 5km from our nearest physical branch. The sandwich preparation and delivery process normally takes between 15 and 35 minutes depending on your location.', 
 'Delivery', 3, true);

-- 6. Insert News
insert into public.news (id, title_vi, title_en, slug, summary_vi, summary_en, content_vi, content_en, thumbnail_url, published_at, status) values
(gen_random_uuid(), 'Khai Trương Cửa Hàng EGGU Đầu Tiên Tại Phố Đi Bộ Nguyễn Huệ!', 'Grand Opening of First EGGU Store on Nguyen Hue Walking Street!', 
 'grand-opening-nguyen-hue', 
 'Chào đón thành viên đầu tiên tại trung tâm Sài Gòn sôi động cùng chuỗi sự kiện đặc biệt rinh quà miễn phí.',
 'Join the grand opening events of our first branch in Ho Chi Minh City with free signature sandwiches and exclusive discounts.', 
 '<p>Chúng tôi vô cùng tự hào thông báo chi nhánh đầu tiên của chuỗi bánh mì kẹp trứng bơ sữa cao cấp EGGU sẽ chính thức đi vào hoạt động tại địa chỉ 123 Nguyễn Huệ, Quận 1 bắt đầu từ ngày 25/08/2026. Hãy đến chung vui để nhận ngập tràn ưu đãi Mua 1 Tặng 1 dành cho Mr. Egg và cùng trải nghiệm không gian F&B chuẩn phong cách Hàn Quốc trẻ trung, thanh lịch!</p>',
 '<p>We are thrilled to announce the official grand opening of our very first premium Korean Egg Sandwich store at 123 Nguyen Hue, District 1 starting August 25, 2026. Come celebrate with us to receive a Buy 1 Get 1 Free promotion on our classic Mr. Egg and immerse yourself in a modern, cozy Korean F&B aesthetic!</p>', 
 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/news/grand-opening.jpg', 
 now(), 'PUBLISHED');

-- 7. Insert Promotions
insert into public.promotions (id, title_vi, title_en, description_vi, description_en, image_url, start_at, end_at, is_active) values
(gen_random_uuid(), 'Tuần Lễ Khai Trương: Mua 1 Tặng 1 Mr. Egg', 'Grand Opening Week: Buy 1 Get 1 Free Mr. Egg', 
 'Tặng ngay 1 bánh Mr. Egg nguyên bản khi mua bất cứ sản phẩm bánh mì kẹp Sandwich nào trong khung giờ vàng 14:00 - 16:00.', 
 'Get 1 free classic Mr. Egg sandwich when purchasing any Sandwich item during our golden hours from 14:00 to 16:00.', 
 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/bogo-mr-egg.jpg', 
 now(), now() + interval '30 days', true);
