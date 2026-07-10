import { Product, RecentOrder, HeroSlide, CategoryItem, UserProfile } from './types';
import banded_tee_stone from './assets/images/banded_tee_stone_1781972591256.jpg';
import banded_tee_olive from './assets/images/banded_tee_olive_1781972602341.jpg';
import banded_tee_charcoal from './assets/images/banded_tee_charcoal_1781972615057.jpg';
import banded_tee_offwhite from './assets/images/banded_tee_offwhite_1781972628208.jpg';
import categoryPremium from './assets/images/category_premium_1781970056347.jpg';
import categoryMinimalist from './assets/images/category_minimalist_1781970070878.jpg';


export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'category-oversized',
    category: 'Oversized',
    title: 'Signature Oversized',
    subtitle: 'Crafted for Everyday Style',
    buttonText: 'EXPLORE COLLECTION',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwk9UDH6VT1tli01IXEmrhA7bwrFZAJk9Dx-Jjq1SOD5Nj0fJmM_59bU8wGXOsYh3rc8CWOxcJhmSaER5STWV-mMm5K5_PqLdnJnwt6XuCHDQbAQy4FFLRwfKcvzJaQuAuNpr5ebet-lXHpj3nKvwZisCYN6mTmFoTtJrbsrQU9k956H8pkTxczjzjSNBiN0CA2Zq3NLLGFq0FTojtDXc4VWbgofFMOz7R9VxUaCFJVMIG73KrmP9tClwjCRREfT5tTyncXVJyKSwd'
  },
  {
    id: 'category-polo',
    category: 'Polo',
    title: 'Typography Oversized',
    subtitle: 'Words That Define Style.',
    buttonText: 'SHOP POLOS',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHJ36mkZ4xwdU7dkd7ITN78YASjm-6LBwrnGPHpTsiFA8PiL_eid3SZiIzeU-53eIEFUnYrezv5bN3YeaHKpAN8h5U7q0u-JHAY5HpaQmcnmTTa_9XT_6m6FzX2im9f-MG22QuX7C59IuijR5UM2AjOlGdZ2g749hND58lRjjCL4ij3lPfoVF7F5gdmbTmKZbMW8m2aaPOd8xM92Xg_cSOCp4vfidyd8rKnHziNWqOejF2PJnXPX0STzlKhm9PE4fCu5BSwGlGtyng'
  },
  {
    id: 'category-graphic',
    category: 'Graphic',
    title: 'Dual Print Oversized',
    subtitle: 'Designed Beyond Basics',
    buttonText: 'VIEW GRAPHICS',
    bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3QtIBR-BdJRUCbrgQ2wD55Me5EUuOnov3Q9iP-dWGN5rq6mHNEpWD85LlyVncquv-8mv8-ly63jWlM3332ZLfp7-4DeE09mDhPdcuHppKlcL-5mq98JWSn_Ucuj61bRtA-SEG-trnin4uyKHOxWEuAHMA6R_c5nNjLTdvKiiQhX_EQdnjxTnQTdo7ovjYd9D7fgzedxvWGWpR4dHElz9njfc5Jyi8CFHP38NmDyoMMgHeRvIJNGPWzVaH7KPh__4Ckymh2G_m95Mt'
  },
  {
    id: 'category-premium',
    category: 'Premium',
    title: 'Backstory Oversized',
    subtitle: 'Let Your Back Speak',
    buttonText: 'SHOP PREMIUM',
    bgUrl: categoryPremium
  },
  {
    id: 'category-minimalist',
    category: 'Minimalist',
    title: 'Fontline Oversized',
    subtitle: 'The Statement Comes First',
    buttonText: 'CHOOSE MINIMAL',
    bgUrl: categoryMinimalist
  }
];


export const INITIAL_PRODUCTS: Product[] = [
  // Banded collar collection
  {
    id: "banded-1",
    name: "Banded Tee — Stone Beige",
    category: "Premium",
    price: 899.00,
    textColorCategory: "BANDED COLLAR",
    color: "Stone Beige",
    colorHex: "#D2B48C",
    image: banded_tee_stone,
    isNew: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "banded-2",
    name: "Banded Tee — Olive Drab",
    category: "Premium",
    price: 899.00,
    textColorCategory: "BANDED COLLAR",
    color: "Olive Drab",
    colorHex: "#556B2F",
    image: banded_tee_olive,
    isNew: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "banded-3",
    name: "Banded Tee — Charcoal Melange",
    category: "Premium",
    price: 899.00,
    textColorCategory: "BANDED COLLAR",
    color: "Charcoal Melange",
    colorHex: "#36454F",
    image: banded_tee_charcoal,
    isNew: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "banded-4",
    name: "Banded Tee — Off-White Ribbed",
    category: "Premium",
    price: 899.00,
    textColorCategory: "BANDED COLLAR",
    color: "Off-White Ribbed",
    colorHex: "#FAF9F6",
    image: banded_tee_offwhite,
    isNew: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  // New Arrivals
  {
    id: "prod-1",
    name: "The Heavyweight Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "ESSENTIALS",
    color: "Charcoal Grey",
    colorHex: "#3A3B3C",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABRvvKW6e8gM4RUJCRgAWxnSHM69UTaHWaaBz3WrtkxHALZmCNsZVBoro2ugI7lMgZrALZZ9u6p0VXAtVfu99il9xEFdIQAmNUU9UbVKZnciYZT5ywVo8UKC6J3t3HuZqyFQAi15uYcLQYHw7Uc7IHnCS6ikLoiKlFXtUT19KxQnGX3ZS6vC5aAOsd3sFxYGFndWiVhhnSzItrX33iDKCy7EFXeSrS9zKUpFNbEhjFvtR5Ci5ZWfSvUwQDUm_h17JVcGL_BFgbOPgG",
    isNew: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "prod-2",
    name: "The Silk-Cotton Polo",
    category: "Premium",
    price: 799.00,
    textColorCategory: "PREMIUM COMFORT",
    color: "Ivory White",
    colorHex: "#F5F5DC",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUVplbi_cIoS8lOdjLtSlZhSkm6iIoj9M3ObLB0ZNplXo1lTO4Oayi3HMyIadnmwuPu1mww4eIXQNP1Tb1VcYSZ6k0MkJQyHNu8TuCKVYwleou12zGpKLJXCAWqQfuxvXtCaWVYHGnE3ll210pdkdNvVJ1bokSAT5ID2Umi4lOyvBmVcEgid-P6DkuQlNsvQgniKt134Sm0gAeukWUfnEqsf3CDF-Fcm-O-Hj3LcuGTgcJVXkn4xsMkthNzV14AhDpFxPY03XRuAg",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "prod-3",
    name: "The Relaxed Drape Tee",
    category: "Minimalist",
    price: 799.00,
    textColorCategory: "MINIMALIST LINE",
    color: "Sage Green",
    colorHex: "#8Fbc8F",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIvghpHHcP4AU5AhVCL_eNe4097KuO_gOmMAmiJg-v1o01iX5v2dzOMaDFISqFo_6jTOA6xB3VNce6-khsM46e7pIoESOujtq_8G_ZOQ98V9HAm6bO24m9X1acWIVhwdfSt-R0f0iLLJObz6Nygb8Y9BxzJrY9MvhywWObprJCAk8801we6VMm7xXBiKbVTJSlaKFk4NzLk_g36cX9alzWCBXXjPi36EmUElSwzFfJ4URD9yTAhqXiboC7uQj2jb5wjy6VqsGiyone",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "prod-4",
    name: "The Architect Tee",
    category: "Graphic",
    price: 799.00,
    textColorCategory: "GRAPHIC SERIES",
    color: "White Geometric",
    colorHex: "#E5E4E2",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6RY37DXALVGbKZhMjg02647udgdrDVWO61dPem89DYtugKi6ZwPLIFZbnLfshKafijxOpthi7d4SHFvjtUazaSo6GV_f6abLdWc3-plr4soVwdXHXFVnE7oxkf0Ldces9o8SdGb2J_3hvOx4F9JgTtlfdfckvkBJM7sq3N3MHVZDZWX661RZox9jte2RGMvoRF2apPOK-ByrbB9pTUJryh0UHzp9Xf4VVbfaWp18Q4v0XXSN1M69zNAdUN8025VylqYQSdpvBwjCg",
    isLimited: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L"]
  },

  // Shop View - Oversized T-Shirts
  {
    id: "oversized-1",
    name: "Archive Box Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "ARCHIVE SERIES",
    color: "Obsidian Black",
    colorHex: "#000000",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRsAzPghUs5MrcvnxKEdlB6Cb4UilfgKw7vTZ0vbucmncaEXHTfV8j1l3-HZQGtsE-u6PWPzdsQIEgmMZvEcOvnRUfAYWvrvs46GP1M8IYjlIaCosjA6gPFCVFHqtsXWUZOS7BpdpTlGuNIc-ytarB3FHTx5f4TYBnVJrVYKa46LDZUsDbmLTniYgILaRxkLSfiqGqcfxXslDNkON9-kOCpG1HGcNH9sSKh0XeStaING5QjmLBwekat_UrFfFGoV-x0SY7zMne0KZW",
    isLimited: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "oversized-2",
    name: "Essential Structure Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "ESSENTIALS",
    color: "Bone White",
    colorHex: "#E5E4E2",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYbK_UuKBWtAJL2QwAfAkaH3R7bDra5dEtzXexcwtsyWbmcWQQ9mOi1cHBdlgKFbhjEdO1anXte-mgwCshluRttRAlvn8iVpXZKAxM4iVRy7QwUgJsqrztTVSJlSdPKOkhTxYtLdH1qymlanQ7JCS7sfQqIT1EhhOdEN17BgtmybNnrbe4gdWHbgK43eInJyB23cNcrqLlsemhzMR4a7U9VSpXXCACRfaiy0qakJYwaFurVsA287L1KU_Hqr34GUzbcX4pz1DEDmhv",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "oversized-3",
    name: "Sculpted Tee",
    category: "Minimalist",
    price: 799.00,
    textColorCategory: "TAILORED",
    color: "Slate Grey",
    colorHex: "#708090",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDx0WgV8LotbmCjJyLPzGVPu50wMKbnlVe6MEcSx8L_ufwEweD1aV1PLfvyQ4-V2SLKmJz1g6j2UViwTkW2-nbCyLJgs_9QpvlKRmb9RMqV6p4tqkN1Pl8RAAaNgUz7ZzDsNi0vGaoLEdOeOGQ40ZthOHwHDshKRUDw2CEdMAhUFZgtlNmxVOncxhveclYQGzU1rucofz5ZpZY8Rn4QBUKtMS8h8O6OI51S0o8HtBodfR7HxvQu8Fjf7ebsEFZHCtJhKJpb4ncy_iJ7",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "oversized-4",
    name: "Heavyweight Drape Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "HEAVYWEIGHT",
    color: "Midnight Blue",
    colorHex: "#4A4E69",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkVJTczX3dRTTFh9IkQCGD4SsYSYiqunGPr3QRCCaFH1BevTJSoHTvE0buPrUHVTNT6-y4597sUlCPwvyTDNKw-B0P01Ghcz8g6LtKsE5yQ8lv8kCGnbIh7Pj2GeorkCWB84NBhwVh8ebl1TKm2mfo2iNB33YAWTVQdAHc3wSc6UmL2cZGKRULqzB0PishUoz42AKIZAoF_fhzWSOmSMwk4327bW8aohE3tSxkUtqmZiaPTCAjfPYanw6zIfoCDLHPREtqEgYPy1Fq",
    isNew: true,
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "oversized-5",
    name: "Terrain Oversized Tee",
    category: "Premium",
    price: 799.00,
    textColorCategory: "TERRAIN",
    color: "Olive Drab",
    colorHex: "#556B2F",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrjMdAT1xC4K5Qu6B-AMWY0LyJCETe19da75TFJi79iqRgLInpTSV2asASdGwMiZGAIB6kARjRBKpiBVFaTKkBTQ55WKrvec8WJFHHn2NtIN-o8Uy14jfXKmxsGmfe1U0jMNM94s3TvvWE2zylBOlxWfcKGEMatlW0t16mpr2fLJ8HEOZ6xepvBIXSo-WPYgiL-_ekmBxzshVXwrzXg1L3a-94ZFGB2Mlj5hvnz9sPIuf6sU_gLHWZQFuFemmelGCj1N0OHzuqqil2",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "oversized-6",
    name: "Monochrome Box Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "MONOCHROME",
    color: "Sandstone",
    colorHex: "#F5F5DC",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDY1rXK49octvNrSIkYH0GuUIFCxrVULEV1HEng4lWal1C6GhZH4R20eKmpkPAHbMJ6LzvgAZplZnm98ms4Ux0SsFLJ-VBP6eXD6ju19K5Z-LgMMsF7YMaar8zqw1EZsYxtkC_I5On3iaOzvTnaHL3yKI62kBBcHG6Lf0UKClGyy5Xf4qD0Jjng942zIrqRvIrsu8MYdR6roPRGmCwViL4nF0XymlJXCfaKi3Sw1doEzDvg57HoHUvU7KfyFL5VC7C5q9rsp1m_GmG6",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "oversized-7",
    name: "Graphite Structure Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "STRUCTURE",
    color: "Graphite Grey",
    colorHex: "#2C3E50",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO1WsFS56F9Zo_zykF314bWycwQd-OoW9ObXVwrm-XMR4PcmcSAKnuQHE3Ksv_ONapBaKDOuzeFcAaGHFLZf2Yd03g5feMgNl-S2e07vgh0L2hJNVKmAP20qJAEbvEChlYwU2Q0yZMGVcDQQ1YFnXOuU65LxAJGps-oSzXI1QckRlGNWKho1G9tw8I-FnrVJ3jESgHRyknEy1LPuJxIR2VXEvCzyrPkgnLQP1daTtMahSy_xfc517ZORLtVJ_txicTg9yqT6b-9MpZ",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "oversized-8",
    name: "Flow Oversized Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "FLOW Series",
    color: "Off-White",
    colorHex: "#FAF9F6",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxfvJxiitoWm_Ue9uTHw4JyekKHjKjJUi4C0CNV7snQ-e_2UQn1ulc228ph8s8KTuz_vYzO0GkoSVjGU0eAQ_rYNfZYyleH6Q91LJGL78aPBnGIq5ERrt0oaQwDcWMXBd2Z_7-a8n_as60Wzp5XV4sr_cVq6Pk4NvR6k3XotA5WMSzwZBVHN_4RZzeX89PQMVIj1-DQ_eAtLHauucvL-ikjlZvzZMBSCKS5jYtQ_WBIH7-9YixnJ3XGQpb7T0kxaKG4Su1UY1AvKNu",
    inStock: false,
    preOrder: true,
    sizes: ["M", "L"]
  },
  {
    id: "oversized-9",
    name: "Charcoal Archive Tee",
    category: "Oversized",
    price: 799.00,
    textColorCategory: "ARCHIVE SERIES",
    color: "Deep Charcoal",
    colorHex: "#4F4F4F",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVaZhSGQVIVfzEF2Dmj83_qNyBJI22M7uMGuAt_NSUNGp2YCBTe7jus2TCmRHCjVIcJbphlqEs_qADtlLg9LawKJ0ZLgrDZDtS_Z2zf-lGDMjQMM6ZPsXToXPDAF5cGUwT-6E6TzQfRoA98FMlQFzPeYeY2WDho_vngVZbNZz_gC1_iSoRgWucXuziZIMszgWNRsO-nlbtfWxWFX9T7fxBnnNUhX_Mn2bqFsbMDWjWhMcBypUnaeXerJyjzXJUeqtobh7ecbw8J6W0",
    inStock: true,
    preOrder: false,
    sizes: ["M", "L", "XL", "XXL"]
  }
];

export const INITIAL_ORDERS: RecentOrder[] = [
  {
    id: "STM-89012",
    customerInitial: "AM",
    customerName: "Alexander McQueen",
    productName: "Silk Evening Jacket",
    amount: 2450.00,
    status: "Shipped",
    date: "2026-06-18"
  },
  {
    id: "STM-89011",
    customerInitial: "JL",
    customerName: "Julian Laurent",
    productName: "Cashmere Scarf Set",
    amount: 480.00,
    status: "Processing",
    date: "2026-06-18"
  },
  {
    id: "STM-89010",
    customerInitial: "RB",
    customerName: "Richard Blake",
    productName: "Tailored Wool Coat",
    amount: 1890.00,
    status: "Delivered",
    date: "2026-06-17"
  },
  {
    id: "STM-89009",
    customerInitial: "OW",
    customerName: "Oscar Wilde",
    productName: "Derby Leather Shoes",
    amount: 620.00,
    status: "Shipped",
    date: "2026-06-16"
  },
  {
    id: "STM-89008",
    customerInitial: "SM",
    customerName: "Samuel Miller",
    productName: "Slim Fit Chinos",
    amount: 225.00,
    status: "Hold",
    date: "2026-06-15"
  }
];

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    name: "Alexander McQueen",
    email: "alexander@mcqueen.co",
    phone: "+91 98765 43210",
    address: "12 Savile Row, Mayfair",
    city: "Mumbai",
    zip: "400001",
    preferredSize: "L",
    pin: "1234"
  },
  {
    name: "Julian Laurent",
    email: "julian@laurent.com",
    phone: "+91 91234 56789",
    address: "Suite 4B, Nariman Point",
    city: "Mumbai",
    zip: "400021",
    preferredSize: "M",
    pin: "1234"
  },
  {
    name: "Richard Blake",
    email: "richard.blake@design.org",
    phone: "+91 98111 22233",
    address: "71 Parliament Street",
    city: "New Delhi",
    zip: "110001",
    preferredSize: "XL",
    pin: "1234"
  },
  {
    name: "Oscar Wilde",
    email: "oscar@wilde.io",
    phone: "+91 95555 88888",
    address: "8 Tite Street, Chelsea",
    city: "Bengaluru",
    zip: "560001",
    preferredSize: "M",
    pin: "1234"
  }
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    label: "ARCHIVE BOX COLLAR",
    title: "Minimalist Oversized Ribbed Cotton Essentials",
    buttonText: "SHOP ARRIVALS",
    bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwk9UDH6VT1tli01IXEmrhA7bwrFZAJk9Dx-Jjq1SOD5Nj0fJmM_59bU8wGXOsYh3rc8CWOxcJhmSaER5STWV-mMm5K5_PqLdnJnwt6XuCHDQbAQy4FFLRwfKcvzJaQuAuNpr5ebet-lXHpj3nKvwZisCYN6mTmFoTtJrbsrQU9k956H8pkTxczjzjSNBiN0CA2Zq3NLLGFq0FTojtDXc4VWbgofFMOz7R9VxUaCFJVMIG73KrmP9tClwjCRREfT5tTyncXVJyKSwd"
  },
  {
    id: "slide-2",
    label: "SIGNATURE PREMIUM DRESSING",
    title: "Luxury Silk-Cotton Double Knitted Heavyweight Polos",
    buttonText: "EXPLORE COLLECTION",
    bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHJ36mkZ4xwdU7dkd7ITN78YASjm-6LBwrnGPHpTsiFA8PiL_eid3SZiIzeU-53eIEFUnYrezv5bN3YeaHKpAN8h5U7q0u-JHAY5HpaQmcnmTTa_9XT_6m6FzX2im9f-MG22QuX7C59IuijR5UM2AjOlGdZ2g749hND58lRjjCL4ij3lPfoVF7F5gdmbTmKZbMW8m2aaPOd8xM92Xg_cSOCp4vfidyd8rKnHziNWqOejF2PJnXPX0STzlKhm9PE4fCu5BSwGlGtyng"
  },
  {
    id: "slide-3",
    label: "THE BACKSTORY CUT",
    title: "Relaxed Terrain Textured Knit Silhouettes",
    buttonText: "VIEW GARMENTS",
    bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3QtIBR-BdJRUCbrgQ2wD55Me5EUuOnov3Q9iP-dWGN5rq6mHNEpWD85LlyVncquv-8mv8-ly63jWlM3332ZLfp7-4DeE09mDhPdcuHppKlcL-5mq98JWSn_Ucuj61bRtA-SEG-trnin4uyKHOxWEuAHMA6R_c5nNjLTdvKiiQhX_EQdnjxTnQTdo7ovjYd9D7fgzedxvWGWpR4dHElz9njfc5Jyi8CFHP38NmDyoMMgHeRvIJNGPWzVaH7KPh__4Ckymh2G_m95Mt"
  }
];

