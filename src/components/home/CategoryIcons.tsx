import React from 'react';

/**
 * 1. Sandwich: Bánh sandwich trứng nhiều tầng
 */
export function SandwichColorIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top bread bun */}
      <path
        d="M8 20C8 14 13.5 10.5 24 10.5C34.5 10.5 40 14 40 20H8Z"
        fill="#F59E0B"
        stroke="#B45309"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Bread highlight curve */}
      <path
        d="M12 17C14.5 13.5 18.5 12.5 24 12.5C29.5 12.5 33.5 13.5 36 17"
        stroke="#FEF08A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Sesame seeds */}
      <ellipse cx="16" cy="15" rx="0.9" ry="1.4" transform="rotate(-25 16 15)" fill="#FFFBEB" />
      <ellipse cx="24" cy="14" rx="0.9" ry="1.4" fill="#FFFBEB" />
      <ellipse cx="32" cy="15" rx="0.9" ry="1.4" transform="rotate(25 32 15)" fill="#FFFBEB" />
      <ellipse cx="20" cy="17.5" rx="0.9" ry="1.4" transform="rotate(15 20 17.5)" fill="#FFFBEB" />
      <ellipse cx="28" cy="17.5" rx="0.9" ry="1.4" transform="rotate(-15 28 17.5)" fill="#FFFBEB" />

      {/* Red tomato / ham slice */}
      <rect x="7" y="20" width="34" height="3" rx="1.5" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />

      {/* Fresh Green wavy lettuce leaf */}
      <path
        d="M6 23C8 23 9 25 11 25C13 25 14 23 16 23C18 23 19 25 21 25C23 25 24 23 26 23C28 23 29 25 31 25C33 25 34 23 36 23C38 23 39 25 41 25C42 25 43 23.5 43 23"
        stroke="#16A34A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Fluffy yellow egg layer */}
      <rect x="7.5" y="25" width="33" height="4.5" rx="2" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />

      {/* Melted Cheddar cheese with hanging drip corner */}
      <path
        d="M6 29H42L35 34.5L28 30.5L20 34.5L13 29H6Z"
        fill="#F97316"
        stroke="#EA580C"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Bottom bread slice */}
      <path
        d="M8.5 32H39.5C39.5 32 39.5 36.5 37.5 38.5C35.5 40 30.5 40.5 24 40.5C17.5 40.5 12.5 40 10.5 38.5C8.5 36.5 8.5 32 8.5 32Z"
        fill="#F59E0B"
        stroke="#B45309"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 2. Món chiên: Hộp khoai tây chiên đỏ
 */
export function FriesColorIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* French Fries sticking out */}
      <rect x="13" y="10" width="4" height="18" rx="1" transform="rotate(-12 13 10)" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
      <rect x="19" y="7" width="4" height="20" rx="1" transform="rotate(-4 19 7)" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
      <rect x="23" y="6" width="4.5" height="21" rx="1" transform="rotate(2 23 6)" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
      <rect x="28" y="8" width="4" height="19" rx="1" transform="rotate(8 28 8)" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
      <rect x="33" y="11" width="4" height="16" rx="1" transform="rotate(16 33 11)" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
      
      {/* Front overlapping fries */}
      <rect x="16" y="12" width="4" height="15" rx="1" transform="rotate(-6 16 12)" fill="#FEF08A" stroke="#EAB308" strokeWidth="1" />
      <rect x="25.5" y="11" width="4" height="16" rx="1" transform="rotate(5 25.5 11)" fill="#FEF08A" stroke="#EAB308" strokeWidth="1" />

      {/* Red Fry Box Back shadow */}
      <path d="M10 24L14 41.5H34L38 24C34 26 29.5 25 24 25C18.5 25 14 26 10 24Z" fill="#B91C1C" />

      {/* Red Fry Box Front */}
      <path
        d="M10 23.5L14 41.5C14.5 42.5 15.5 43 17 43H31C32.5 43 33.5 42.5 34 41.5L38 23.5C34 26 29 27 24 27C19 27 14 26 10 23.5Z"
        fill="#E0352B"
        stroke="#B91C1C"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Gold smile emblem on red box */}
      <circle cx="24" cy="35" r="4.8" fill="#FBBF24" />
      <path d="M22 35C22 36.3 22.9 37.2 24 37.2C25.1 37.2 26 36.3 26 35" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
      <circle cx="22.5" cy="33.5" r="0.6" fill="#B45309" />
      <circle cx="25.5" cy="33.5" r="0.6" fill="#B45309" />
    </svg>
  );
}

/**
 * 3. Cà phê & Đồ uống: Ly/cốc cà phê nóng
 */
export function CoffeeColorIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Rising Steam */}
      <path d="M18 13C16.5 11 16.5 9 18 7" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      <path d="M24 12C22.5 10 22.5 8 24 6" stroke="#E0352B" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M30 13C28.5 11 28.5 9 30 7" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

      {/* Saucer */}
      <ellipse cx="24" cy="40.5" rx="17" ry="2.8" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
      <ellipse cx="24" cy="40" rx="12" ry="1.8" fill="#F8FAFC" />

      {/* Mug Handle */}
      <path d="M33 21C37 21 39 23.5 39 27C39 30.5 37 33 33 33" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
      <path d="M33 21C37 21 39 23.5 39 27C39 30.5 37 33 33 33" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

      {/* Mug Body */}
      <path
        d="M12 18H36V30C36 35.5 30.6 39 24 39C17.4 39 12 35.5 12 30V18Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Coffee Surface Rim */}
      <ellipse cx="24" cy="18" rx="12" ry="3.5" fill="#451A03" stroke="#CBD5E1" strokeWidth="1.5" />

      {/* Creamy Latte Art Heart */}
      <path
        d="M24 20C22.5 18.5 20.5 18 20.5 19.2C20.5 20.2 24 21.5 24 21.5C24 21.5 27.5 20.2 27.5 19.2C27.5 18 25.5 18.5 24 20Z"
        fill="#FDE68A"
      />

      {/* Cute Red Eggu Emblem on Mug */}
      <rect x="21.5" y="26" width="5" height="5" rx="1.5" fill="#E0352B" />
      <circle cx="24" cy="28.5" r="1" fill="#FEF08A" />
    </svg>
  );
}

/**
 * 4. Sinh tố & Nước ép: Ly cupcake / tráng miệng ngọt
 */
export function DessertColorIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cherry Stem */}
      <path d="M24 9C24 6 27 5 30 5" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M29 6C30 5 31.5 5.5 31.5 6.5C31.5 7.5 30 7.5 29 6Z" fill="#22C55E" />

      {/* Cherry on Top */}
      <circle cx="24" cy="11.5" r="4.5" fill="#E11D48" stroke="#BE123C" strokeWidth="1" />
      <circle cx="22.5" cy="10" r="1" fill="#FDA4AF" />

      {/* Swirled Frosting / Whipped Cream */}
      {/* Top swirl */}
      <path
        d="M19 19C19 14.5 29 14.5 29 19C31 19 32.5 20.5 32.5 22.5C32.5 24 31 25.5 29 25.5H19C17 25.5 15.5 24 15.5 22.5C15.5 20.5 17 19 19 19Z"
        fill="#FFF1F2"
        stroke="#F43F5E"
        strokeWidth="1"
      />
      {/* Bottom fluffy frosting layer */}
      <path
        d="M13 25C13 22 17 21 24 21C31 21 35 22 35 25C37 25 38.5 26.5 38.5 28.5C38.5 30.5 37 32 35 32H13C11 32 9.5 30.5 9.5 28.5C9.5 26.5 11 25 13 25Z"
        fill="#FB7185"
        stroke="#E11D48"
        strokeWidth="1"
      />

      {/* Sprinkles on frosting */}
      <circle cx="17" cy="27" r="1" fill="#FDE047" />
      <circle cx="23" cy="24" r="1" fill="#38BDF8" />
      <circle cx="28" cy="27" r="1" fill="#FFFFFF" />
      <circle cx="33" cy="28" r="1" fill="#FDE047" />
      <circle cx="22" cy="18" r="0.8" fill="#F43F5E" />
      <circle cx="26" cy="17" r="0.8" fill="#38BDF8" />

      {/* Cupcake Base / Liner */}
      <path
        d="M13.5 32L16.5 42.5C16.8 43.5 17.8 44 19 44H29C30.2 44 31.2 43.5 31.5 42.5L34.5 32H13.5Z"
        fill="#FDE68A"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Liner folds / stripes */}
      <path d="M18 32.5L20 43.5" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
      <path d="M22 32.5L23 43.5" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
      <path d="M26 32.5L25 43.5" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
      <path d="M30 32.5L28 43.5" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
