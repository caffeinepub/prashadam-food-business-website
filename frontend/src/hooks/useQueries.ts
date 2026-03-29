import { useActor } from './useActor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MenuCategory, Testimonial, DetailedMenu } from '../backend';

// Fallback menu data to show if backend is unavailable
const FALLBACK_DETAILED_MENU: DetailedMenu = {
  categories: [
    {
      id: "thali-menu",
      name: "Thali Menu",
      description: "Traditional vegetarian thali options featuring authentic Jain and Vaishnav cuisine. All items are pure vegetarian with no onion and no garlic.",
      items: [
        {
          name: "Pure Jain Thali",
          description: "250ml Daal, 250ml Dry or Semi-Gravy Vegetable, 300g Rice, Four Chapatis (Tawa), Salad",
          price: 170.0,
          category: "Thali",
          isJain: true,
          isVaishnav: true,
        },
        {
          name: "Vaishnav Thali",
          description: "250ml Daal, 250ml Dry or Semi-Gravy Vegetable, 300g Rice, Four Chapatis (Tawa), Salad",
          price: 170.0,
          category: "Thali",
          isJain: false,
          isVaishnav: true,
        },
        {
          name: "Special Thali",
          description: "250ml Daal, 250ml Dry or Semi-Gravy Vegetable, 300g Jeera Rice, Four Chapatis (Tawa), 1 Sweet, 1 Curd, Salad",
          price: 210.0,
          category: "Thali",
          isJain: true,
          isVaishnav: true,
        },
        {
          name: "Deluxe Thali",
          description: "250ml Paneer or Soya Chaap, 250ml Daal Makhani or Kadhi Pakoda, 300g Matar Pulao, Four Chapatis (Tawa), 1 Sweet, 1 Curd, Salad",
          price: 270.0,
          category: "Thali",
          isJain: false,
          isVaishnav: true,
        },
      ],
    },
    {
      id: "extras",
      name: "Extras",
      description: "Additional items to complement your thali experience. All items customized to suit Jain and Vaishnav dietary preferences.",
      items: [
        {
          name: "Paneer or Soya Chaap",
          description: "Fresh paneer or soya chaap dishes with pure vegetarian ingredients.",
          price: 100.0,
          category: "Extras",
          isJain: true,
          isVaishnav: true,
        },
        {
          name: "Daal Makhani or Kadhi",
          description: "Rich and flavorful daal makhani or kadhi prepared with pure vegetarian methods.",
          price: 70.0,
          category: "Extras",
          isJain: false,
          isVaishnav: true,
        },
        {
          name: "Matar Pulao",
          description: "Fragrant rice cooked with green peas and spices.",
          price: 60.0,
          category: "Extras",
          isJain: true,
          isVaishnav: true,
        },
        {
          name: "Rice",
          description: "Steamed rice, perfect accompaniment to your meal.",
          price: 60.0,
          category: "Extras",
          isJain: true,
          isVaishnav: true,
        },
        {
          name: "Curd",
          description: "Refreshing and creamy curd.",
          price: 50.0,
          category: "Extras",
          isJain: true,
          isVaishnav: true,
        },
      ],
    },
  ],
  sections: [
    {
      title: "Tiffin Services",
      description: "Convenient vegetarian meals for everyday needs. Includes a variety of wholesome options, all pure vegetarian and in compliance with Jain and Vaishnav dietary standards.",
      icon: "🥗",
      subsections: [
        {
          title: "Meal Components",
          content: "A variety of pure vegetarian meal options, each includes:",
          items: [
            { title: "Daal (250 ml)", description: "Rajma, Chole, Kadhi" },
            {
              title: "Seasonal Vegetables (250 ml)",
              description: "Paneer, Soybean, Soya Chaap, Kofte Mushroom",
            },
            { title: "Chapati", description: "Four pieces" },
            { title: "Rice", description: "170 grams per serving" },
            { title: "Salad", description: "Fresh seasonal vegetables" },
          ],
        },
        {
          title: "Pricing Structure",
          content: "Affordable pricing options for all Tiffin Services:",
          items: [
            {
              title: "Random Customer",
              description: "Single day service: Rs. 150/-",
            },
            {
              title: "Regular Customer",
              description: "Standard rate for ongoing service: Rs. 110/-",
            },
          ],
        },
      ],
    },
    {
      title: "Corporate Buffet Services",
      description: "Premium buffet options for corporate events. All offerings are pure vegetarian with special care in compliance with Jain and Vaishnav standards.",
      icon: "🍽️",
      subsections: [
        {
          title: "Buffet Options and Pricing",
          content: "Flexible buffet options with diverse menu items. Pricing varies based on services selected and event type:",
          items: [
            {
              title: "Regular Buffet",
              description: "Standard buffet service: Rs. 350/- per person",
            },
            {
              title: "Occasional Buffet",
              description: "Special occasions and custom services: Rs. 450/- per person",
            },
          ],
        },
        {
          title: "Buffet Menu - 8 Items",
          content: "A curated mix of vegetarian cuisine, offering choice and variety:",
          items: [
            {
              title: "Daal (Choose One)",
              description: "Makhani, Kadhi, Daal Tadka",
            },
            {
              title: "Vegetable Dishes",
              description: "Variety of seasonal options",
            },
            {
              title: "Paneer (Any One)",
              description: "Matar Paneer, Matar Paneer Masala, Shahi Paneer, Kadhai Paneer",
            },
            {
              title: "Rice (Any One)",
              description: "Jeera Rice, Matar Pulao, Vegetable Pulao",
            },
            {
              title: "Bread Per Person (Any One)",
              description: "4 Chapati, 3 Tandoori Roti, 2 Butter Naan",
            },
            {
              title: "Raita - 170 ml per person (Any One)",
              description: "Masala Raita, Cucumber Raita, Mix Raita",
            },
            {
              title: "Sweet (Any One)",
              description: "Kheer, Suji Halwa, Gulab Jamun",
            },
            {
              title: "Salad (Any One)",
              description: "Seasonal Vegetable, Sirka Salad",
            },
          ],
        },
      ],
    },
    {
      title: "Catering Services",
      description: "Comprehensive on-site catering solutions with a focus on pure vegetarian cuisine.",
      icon: "🍲",
      subsections: [
        {
          title: "Pricing Structure",
          content: "Flexible services starting from Rs. 450/- for 100+ guests. Pricing may vary depending on host requirements and event type.",
          items: [
            {
              title: "Base Price Service For 100+ Guests",
              description: "Rs. 450/- including basic vegetarian meals and event management.",
            },
            {
              title: "Rates are dependent on host demands",
              description: "Custom packages can be discussed for specific needs.",
            },
            {
              title: "Only pure vegetarian food provided",
              description: "Adherence to Jain & Vaishnav standards ensured in all services.",
            },
          ],
        },
      ],
    },
  ],
};

export function useMenuData() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuCategory[]>({
    queryKey: ['menu'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenu();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDetailedMenu() {
  const { actor, isFetching } = useActor();

  return useQuery<DetailedMenu>({
    queryKey: ['detailedMenu'],
    queryFn: async () => {
      if (!actor) {
        // Return fallback data if actor is not available
        return FALLBACK_DETAILED_MENU;
      }
      try {
        const result = await actor.getDetailedMenu();
        // If backend returns empty data, use fallback
        if (!result || (!result.categories?.length && !result.sections?.length)) {
          return FALLBACK_DETAILED_MENU;
        }
        return result;
      } catch (error) {
        console.error('Error fetching detailed menu:', error);
        // Return fallback data on error
        return FALLBACK_DETAILED_MENU;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2, // Retry twice before giving up
    retryDelay: 1000, // Wait 1 second between retries
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    placeholderData: FALLBACK_DETAILED_MENU, // Show fallback immediately while loading
  });
}

export function useTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitContactForm(data.name, data.email, data.phone, data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactSubmissions'] });
    },
  });

  return {
    submitForm: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}

export function useImportTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      review: string;
      rating: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.importTestimonial(data.name, data.review, data.rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  return {
    importTestimonial: mutation.mutateAsync,
    isImporting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
