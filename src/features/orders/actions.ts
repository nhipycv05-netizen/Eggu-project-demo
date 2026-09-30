'use server';

import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { parsePromotionFromDb, isPromotionActiveAndValid, MOCK_PROMOTIONS } from '@/lib/promotions';
import { z } from 'zod';
import { formatPrice } from '@/lib/utils';

// Order validation schema
const checkoutFormSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(5),
  note: z.string().optional(),
});

interface ActionOption {
  id: string;
}

interface ActionCartItem {
  productId: string;
  quantity: number;
  options: ActionOption[];
  note?: string;
}

interface DBProductOption {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
  is_active: boolean;
  product_id: string;
  sort_order: number;
}

interface OrderItemOptionInsert {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
}

interface OrderItemInsert {
  product_id: string;
  product_name_vi: string;
  product_name_en: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  options: OrderItemOptionInsert[];
  note: string | null;
}

const STANDARD_TOPPINGS: Record<string, { name_vi: string; name_en: string; price: number }> = {
  bacon: { name_vi: 'Bacon / Thịt xông khói', name_en: 'Bacon / Thịt xông khói', price: 12000 },
  'opt-bacon': { name_vi: 'Bacon / Thịt xông khói', name_en: 'Bacon / Thịt xông khói', price: 12000 },
  ham: { name_vi: 'Ham / Thịt dăm bông', name_en: 'Ham / Thịt dăm bông', price: 12000 },
  'opt-ham': { name_vi: 'Ham / Thịt dăm bông', name_en: 'Ham / Thịt dăm bông', price: 12000 },
  scrambled_egg: { name_vi: 'Scrambled egg / Trứng bác', name_en: 'Scrambled egg / Trứng bác', price: 10000 },
  'opt-scrambled-egg': { name_vi: 'Scrambled egg / Trứng bác', name_en: 'Scrambled egg / Trứng bác', price: 10000 },
  cheese: { name_vi: 'Cheese / Phô mai', name_en: 'Cheese / Phô mai', price: 10000 },
  'opt-cheese': { name_vi: 'Cheese / Phô mai', name_en: 'Cheese / Phô mai', price: 10000 },
  garlic_butter: { name_vi: 'Garlic butter / Xốt bơ tỏi phết mặt bánh', name_en: 'Garlic butter / Xốt bơ tỏi phết mặt bánh', price: 7000 },
  'opt-garlic-butter': { name_vi: 'Garlic butter / Xốt bơ tỏi phết mặt bánh', name_en: 'Garlic butter / Xốt bơ tỏi phết mặt bánh', price: 7000 },
  boiled_egg: { name_vi: 'Boiled Egg / Trứng luộc', name_en: 'Boiled Egg / Trứng luộc', price: 10000 },
  'opt-boiled-egg': { name_vi: 'Boiled Egg / Trứng luộc', name_en: 'Boiled Egg / Trứng luộc', price: 10000 },
};

/**
 * Fetch all active and date-valid promotions for checkout selection
 */
export async function getActivePromotions() {
  try {
    const supabase = createServiceRoleClient();
    const { data: promos, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !promos || promos.length === 0) {
      return MOCK_PROMOTIONS;
    }

    const parsed = promos.map((p) => parsePromotionFromDb(p));
    const active = parsed.filter((p) => isPromotionActiveAndValid(p));
    return active.length > 0 ? active : MOCK_PROMOTIONS;
  } catch (err) {
    console.error('Error fetching active promotions:', err);
    return MOCK_PROMOTIONS;
  }
}

/**
 * Validate promo code against active promotions in Supabase
 */
export async function validatePromoCode(code: string, subtotal: number) {
  try {
    if (!code || !code.trim()) {
      return { valid: false, error: 'Vui lòng nhập mã giảm giá' };
    }

    const cleanCode = code.toUpperCase().trim();
    const supabase = createServiceRoleClient();

    const { data: promos, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true);

    if (error || !promos || promos.length === 0) {
      return { valid: false, error: 'Mã không tồn tại hoặc đã hết hạn' };
    }

    const parsedPromos = promos.map((p) => parsePromotionFromDb(p));
    const matchedPromo = parsedPromos.find(
      (p) => p.code.toUpperCase() === cleanCode && isPromotionActiveAndValid(p)
    );

    if (!matchedPromo) {
      return { valid: false, error: 'Mã không tồn tại hoặc đã hết hạn' };
    }

    if (matchedPromo.min_order_value && subtotal < matchedPromo.min_order_value) {
      return {
        valid: false,
        error: `Đơn hàng chưa đạt giá trị tối thiểu ${formatPrice(matchedPromo.min_order_value)} VND`,
        minOrderValue: matchedPromo.min_order_value,
      };
    }

    let discountAmount = 0;
    if (matchedPromo.discount_type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * matchedPromo.discount_value) / 100);
    } else {
      discountAmount = Math.min(subtotal, Number(matchedPromo.discount_value));
    }

    return {
      valid: true,
      code: matchedPromo.code,
      discountType: matchedPromo.discount_type,
      discountValue: matchedPromo.discount_value,
      discountAmount,
      minOrderValue: matchedPromo.min_order_value,
    };
  } catch (err) {
    console.error('Error validating promo code:', err);
    return { valid: false, error: 'Không thể kiểm tra mã lúc này' };
  }
}

export async function createOrder(
  checkoutData: z.infer<typeof checkoutFormSchema>,
  cartItems: ActionCartItem[],
  promoCode?: string
) {
  try {
    // 1. Validate Form Data
    const validatedData = checkoutFormSchema.parse(checkoutData);

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    const supabase = createServiceRoleClient();

    // 2. Fetch all products in the cart from Supabase to verify prices
    const productIds = cartItems.map((item) => item.productId);
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (prodError || !dbProducts || dbProducts.length === 0) {
      return { success: false, error: 'Failed to verify products in database' };
    }

    // Verify product availability
    const outOfStockItem = dbProducts.find((p) => p.is_available === false);
    if (outOfStockItem) {
      return {
        success: false,
        error: `Món "${outOfStockItem.name_vi || outOfStockItem.name_en}" hiện đã hết hàng. Vui lòng chọn món khác.`,
      };
    }

    // 3. Fetch all product options in the cart from Supabase to verify prices
    const optionIds = cartItems.flatMap((item) => item.options.map((o) => o.id));
    let dbOptions: DBProductOption[] = [];
    if (optionIds.length > 0) {
      const { data: fetchedOptions, error: optError } = await supabase
        .from('product_options')
        .select('*')
        .in('id', optionIds);
      if (!optError && fetchedOptions) {
        dbOptions = fetchedOptions as DBProductOption[];
      }
    }

    // 4. Calculate prices on the server (do NOT trust client-side prices)
    let subtotal = 0;
    const orderItemsToInsert: OrderItemInsert[] = [];

    for (const item of cartItems) {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (!dbProduct) {
        return { success: false, error: `Product not found: ${item.productId}` };
      }

      // Calculate options price
      const selectedOptionsDetails: OrderItemOptionInsert[] = [];
      let itemOptionsPrice = 0;

      for (const opt of item.options) {
        const dbOption = dbOptions.find((o) => o.id === opt.id);
        const standardOption = STANDARD_TOPPINGS[opt.id];

        if (dbOption) {
          itemOptionsPrice += Number(dbOption.price);
          selectedOptionsDetails.push({
            id: dbOption.id,
            name_vi: dbOption.name_vi,
            name_en: dbOption.name_en,
            price: Number(dbOption.price),
          });
        } else if (standardOption) {
          itemOptionsPrice += standardOption.price;
          selectedOptionsDetails.push({
            id: opt.id,
            name_vi: standardOption.name_vi,
            name_en: standardOption.name_en,
            price: standardOption.price,
          });
        } else {
          return { success: false, error: `Product option not found: ${opt.id}` };
        }
      }

      const unitPrice = Number(dbProduct.price) + itemOptionsPrice;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItemsToInsert.push({
        product_id: dbProduct.id,
        product_name_vi: dbProduct.name_vi,
        product_name_en: dbProduct.name_en,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
        options: selectedOptionsDetails,
        note: item.note || null,
      });
    }

    // 5. Verify & Calculate Discount
    let discount = 0;
    let promoPrefix = '';

    if (promoCode && promoCode.trim()) {
      const promoResult = await validatePromoCode(promoCode.trim(), subtotal);
      if (promoResult.valid && promoResult.discountAmount) {
        discount = promoResult.discountAmount;
        promoPrefix = `[Mã giảm giá: ${promoResult.code} (-${formatPrice(discount)} VND)]`;
      }
    }

    const deliveryFee = 0;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    // Combine custom note with promo details if any
    const finalNote = [promoPrefix, validatedData.note?.trim()].filter(Boolean).join(' ') || null;

    // 6. Generate unique order number (EGGU-YYYYMMDD-XXXX)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePrefix = `EGGU-${yyyy}${mm}${dd}-`;

    // Count today's orders
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .like('order_number', `${datePrefix}%`);

    if (countError) {
      return { success: false, error: 'Failed to generate order tracking number' };
    }

    const nextSeq = String((count || 0) + 1).padStart(4, '0');
    const orderNumber = `${datePrefix}${nextSeq}`;

    // 7. Insert Order Header
    const { data: insertedOrder, error: orderInsertError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: validatedData.fullName,
        phone: validatedData.phone,
        email: validatedData.email || null,
        address: validatedData.address,
        note: finalNote,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: 'COD',
        payment_status: 'UNPAID',
        order_status: 'NEW',
      })
      .select()
      .single();

    if (orderInsertError || !insertedOrder) {
      console.error('Order insertion failed:', orderInsertError);
      return { success: false, error: 'Failed to create order record' };
    }

    // 8. Insert Order Items
    const itemsWithOrderId = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: insertedOrder.id,
    }));

    const { error: itemsInsertError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsInsertError) {
      console.error('Order items insertion failed:', itemsInsertError);
      // Clean up order header on item failure
      await supabase.from('orders').delete().eq('id', insertedOrder.id);
      return { success: false, error: 'Failed to create order items' };
    }

    return { success: true, orderNumber };
  } catch (error) {
    console.error('Server action createOrder error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed' };
    }
    return { success: false, error: 'Internal server error occurred' };
  }
}

// Fetch order details securely by order number (Server-side query)
export async function getOrderDetails(orderNumber: string) {
  try {
    const supabase = createServiceRoleClient();

    // Query order header
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (orderError || !order) {
      return null;
    }

    // Query order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) {
      return null;
    }

    return {
      ...order,
      items: items || [],
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}
