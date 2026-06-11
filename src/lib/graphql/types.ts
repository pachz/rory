export interface EntityIntro {
  id: string;
  slug: string;
  name: string;
  username: string;
  branch: string;
  slogan: string;
  logo: string | null;
  description: string;
  currency: string;
  coverPhoto: string | null;
  coverVideo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  defaultLanguage: string;
  phoneNumber: string | null;
  address: string | null;
  location: { type: string; coordinates: [number, number] } | null;
  workingHours: WorkingHour[];
  socialLinks: SocialLink[];
  amenities: { name: string }[];
  type: { label: string; slug: string } | null;
}

export interface WorkingHour {
  id: string;
  startTime: string;
  endTime: string;
  weekday: string;
}

export interface SocialLink {
  id: string;
  name: string;
  address: string;
  logo: string | null;
}

export interface ProductOptionChoice {
  id: string;
  choice: {
    id: string;
    isSoldOut: boolean;
    shopItemPrice: { price: number } | null;
    item: { id: string; name: string };
  };
}

export interface ProductOption {
  id: string;
  label: string;
  minimumSelectableChoices: number;
  maximumSelectableChoices: number;
  isActive: boolean;
  productOptionChoices: ProductOptionChoice[];
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  description: string;
  itemMedias: { mediaType: string; url: string }[];
  shopItem: {
    id: string;
    isSoldOut: boolean;
    shopItemPrice: {
      originalPrice: number;
      price: number;
      discountType: string;
      discountValue: number;
    } | null;
    productOptions: ProductOption[];
  } | null;
  itemCategories: {
    category: { id: string; status: string };
    isBold: boolean;
    isHidden: boolean;
  }[];
}

export interface MenuCategory {
  id: string;
  label: string;
  thumbnail: string | null;
  status: string;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  label: string;
  slug: string;
  description: string;
  isActive: boolean;
  categories: MenuCategory[];
}

export interface Amenity {
  id: string;
  icon: string | null;
  name: string;
  parent: { id: string; name: string; icon: string | null } | null;
  group: { id: string; name: string } | null;
}

export interface RestaurantData {
  intro: EntityIntro;
  menus: Menu[];
  amenities: Amenity[];
}
