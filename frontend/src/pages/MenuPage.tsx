import { useState } from 'react';
import { useDetailedMenu } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, Utensils, ChefHat, Package, Users, Soup, AlertCircle, Download, MessageCircle, ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MenuItem, Section } from '@/backend';
import { cn } from '@/lib/utils';
import { generateMenuPDF } from '@/lib/pdfGenerator';
import { UPICheckoutDialog } from '@/components/UPICheckoutDialog';

// Helper function to transform menu item names and descriptions
function transformMenuText(text: string): string {
  return text
    .replace(/Paneer \(Soya Chaap\)/g, 'Paneer or Soya Chaap')
    .replace(/Daal Makhni \(Daal Kadhi\)/g, 'Daal Makhani or Kadhi Pakoda')
    .replace(/Daal Makhni \(Daal Kadhi\)/gi, 'Daal Makhani or Kadhi Pakoda')
    .replace(/Daal Makhni/g, 'Daal Makhani')
    .replace(/Kadhi\b/g, 'Kadhi');
}

// Transform a menu item to use corrected naming
function transformMenuItem(item: MenuItem): MenuItem {
  return {
    ...item,
    name: transformMenuText(item.name),
    description: transformMenuText(item.description),
  };
}

// Get icon for section
function getSectionIcon(title: string) {
  if (title.toLowerCase().includes('tiffin')) return Package;
  if (title.toLowerCase().includes('buffet')) return Users;
  if (title.toLowerCase().includes('catering')) return Soup;
  return Utensils;
}

type MenuTab = {
  id: string;
  label: string;
  type: 'category' | 'section';
};

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

const WHATSAPP_NUMBER = '918802452190';
const UPI_ID = '8802452190@okbizaxis';

export default function MenuPage() {
  const { data: detailedMenu, isLoading, error } = useDetailedMenu();
  const [activeTab, setActiveTab] = useState<string>('thali-menu');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // Transform menu data
  const transformedMenuCategories = detailedMenu?.categories.map(category => ({
    ...category,
    items: category.items.map(transformMenuItem),
  }));

  const sections = detailedMenu?.sections || [];

  // Create tabs array
  const tabs: MenuTab[] = [
    ...(transformedMenuCategories || []).map(cat => ({
      id: cat.id,
      label: cat.name,
      type: 'category' as const,
    })),
    ...sections.map(section => ({
      id: section.title.toLowerCase().replace(/\s+/g, '-'),
      label: section.title,
      type: 'section' as const,
    })),
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    if (!detailedMenu || !transformedMenuCategories) return;
    
    setIsGeneratingPDF(true);
    
    try {
      await generateMenuPDF(transformedMenuCategories, sections);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // WhatsApp ordering functions
  const orderSingleItemViaWhatsApp = (itemName: string, price: number) => {
    const message = `Hello! I would like to order:\n\n${itemName} - ₹${price.toFixed(0)}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const addToCart = (itemName: string, price: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === itemName);
      if (existingItem) {
        return prevCart.map(item =>
          item.name === itemName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { name: itemName, price, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemName: string, delta: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item =>
          item.name === itemName
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  const handlePaymentSuccess = () => {
    // Clear cart after successful payment
    clearCart();
    setShowCheckout(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get active content
  const activeCategory = transformedMenuCategories?.find(cat => cat.id === activeTab);
  const activeSection = sections.find(section => 
    section.title.toLowerCase().replace(/\s+/g, '-') === activeTab
  );

  const showLoadingState = isLoading && !detailedMenu;

  // Check if current category should hide WhatsApp button (Thali Menu and Extras)
  const shouldHideWhatsAppButton = activeTab === 'thali-menu' || activeTab === 'extras';

  return (
    <div className="min-h-screen bg-gradient-to-br from-kraft-light via-kraft to-kraft-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/generated/menu-spread.dim_600x400.jpg')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Utensils className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Our Menu
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Authentic Jain and Vaishnav cuisine crafted with pure ingredients. 
              No onion, no garlic - only sattvic flavors that nourish body and soul.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Leaf className="w-4 h-4 mr-2" />
                100% Vegetarian
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <ChefHat className="w-4 h-4 mr-2" />
                Jain & Vaishnav
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <CreditCard className="w-4 h-4 mr-2" />
                UPI Payment Available
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && detailedMenu && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Alert className="max-w-6xl mx-auto border-primary/30 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Showing cached menu. Some information may not be up to date.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Shopping Cart - Fixed Position */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4">
          <Card className="shadow-2xl border-2 border-primary/20 bg-kraft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Your Order ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-48 overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-2 p-2 rounded bg-kraft-light/50 border border-kraft-dark/20"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-kraft-text truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-kraft-text/70">
                        ₹{item.price.toFixed(0)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartQuantity(item.name, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartQuantity(item.name, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-1 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeFromCart(item.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="bg-kraft-dark/30" />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">₹{cartTotal.toFixed(0)}</span>
              </div>
              <Button
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-semibold"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* UPI Checkout Dialog */}
      <UPICheckoutDialog
        open={showCheckout}
        onClose={handleCheckoutClose}
        cart={cart}
        total={cartTotal}
        upiId={UPI_ID}
        whatsappNumber={WHATSAPP_NUMBER}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Menu Section with Horizontal Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {showLoadingState ? (
            <div className="max-w-6xl mx-auto">
              <Skeleton className="h-[600px] w-full rounded-lg" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Horizontal Tabs Navigation */}
              <div className="bg-kraft-light/50 rounded-t-lg border-b-2 border-kraft-dark/30 overflow-x-auto">
                <div className="flex min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={cn(
                        "relative px-6 py-4 text-sm md:text-base font-bold transition-all duration-300 whitespace-nowrap border-r border-kraft-dark/20 last:border-r-0",
                        activeTab === tab.id
                          ? "bg-kraft text-primary border-b-4 border-b-primary"
                          : "bg-kraft-light/30 text-kraft-text/70 hover:bg-kraft-light/60 hover:text-kraft-text"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="bg-kraft rounded-b-lg shadow-lg p-6 md:p-10 min-h-[500px]">
                <div className="transition-all duration-300">
                  {activeCategory && (
                    <div className="space-y-6">
                      {/* Category Header */}
                      <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-kraft-text mb-3">
                          {activeCategory.name}
                        </h2>
                        <p className="text-kraft-text/70 text-base md:text-lg">
                          {activeCategory.description}
                        </p>
                        <Separator className="mt-4 bg-kraft-dark/30" />
                      </div>

                      {/* Menu Items */}
                      {activeCategory.items.length === 0 ? (
                        <p className="text-center text-kraft-text/60 italic text-lg py-12">
                          Items coming soon...
                        </p>
                      ) : (
                        <div className="grid gap-4 md:gap-6">
                          {activeCategory.items.map((item, idx) => (
                            <div 
                              key={idx}
                              className="group p-4 md:p-5 rounded-lg bg-kraft-light/50 hover:bg-kraft-light/80 transition-all duration-300 border border-kraft-dark/20"
                            >
                              <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className="text-lg md:text-xl font-semibold text-kraft-text group-hover:text-primary transition-colors flex-1">
                                  {item.name}
                                </h3>
                                {item.price > 0 && (
                                  <span className="text-xl md:text-2xl font-bold text-primary flex-shrink-0">
                                    ₹{item.price.toFixed(0)}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm md:text-base text-kraft-text/70 leading-relaxed mb-3">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-3 flex-wrap text-xs">
                                  {item.isJain && (
                                    <div className="flex items-center gap-1.5 text-secondary">
                                      <Leaf className="w-3.5 h-3.5" />
                                      <span className="font-medium">Jain</span>
                                    </div>
                                  )}
                                  {item.isVaishnav && (
                                    <div className="flex items-center gap-1.5 text-accent">
                                      <Leaf className="w-3.5 h-3.5" />
                                      <span className="font-medium">Vaishnav</span>
                                    </div>
                                  )}
                                </div>
                                {/* Show ordering buttons if item has price */}
                                {item.price > 0 && (
                                  <div className="flex items-center gap-2">
                                    {/* Add to Cart button - shown for all categories */}
                                    <Button
                                      onClick={() => addToCart(item.name, item.price)}
                                      size="sm"
                                      variant="outline"
                                      className="border-primary/30 hover:bg-primary/10 hover:border-primary text-xs md:text-sm"
                                    >
                                      <Plus className="w-3.5 h-3.5 mr-1" />
                                      Add to Cart
                                    </Button>
                                    {/* WhatsApp button - hidden for Thali Menu and Extras */}
                                    {!shouldHideWhatsAppButton && (
                                      <Button
                                        onClick={() => orderSingleItemViaWhatsApp(item.name, item.price)}
                                        size="sm"
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs md:text-sm"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5 mr-1" />
                                        Order via WhatsApp
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection && (
                    <div className="space-y-6">
                      {/* Section Header */}
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">{activeSection.icon}</span>
                          <h2 className="text-3xl md:text-4xl font-bold text-kraft-text">
                            {activeSection.title}
                          </h2>
                        </div>
                        <p className="text-kraft-text/70 text-base md:text-lg">
                          {activeSection.description}
                        </p>
                        <Separator className="mt-4 bg-kraft-dark/30" />
                      </div>

                      {/* Subsections */}
                      <div className="space-y-6">
                        {activeSection.subsections.map((subsection, subIdx) => {
                          const IconComponent = getSectionIcon(activeSection.title);
                          return (
                            <div 
                              key={subIdx}
                              className="p-5 md:p-6 rounded-lg bg-kraft-light/50 border border-kraft-dark/20"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <IconComponent className="w-5 h-5 text-primary" />
                                <h3 className="text-xl md:text-2xl font-semibold text-kraft-text">
                                  {subsection.title}
                                </h3>
                              </div>
                              {subsection.content && (
                                <p className="text-kraft-text/70 mb-4 text-sm md:text-base">
                                  {subsection.content}
                                </p>
                              )}
                              {subsection.items.length > 0 && (
                                <div className="space-y-3">
                                  {subsection.items.map((item, itemIdx) => (
                                    <div 
                                      key={itemIdx}
                                      className="border-l-2 border-primary/40 pl-4 py-2 hover:border-primary transition-colors"
                                    >
                                      <h4 className="font-semibold text-kraft-text mb-1 text-sm md:text-base">
                                        {item.title}
                                      </h4>
                                      <p className="text-xs md:text-sm text-kraft-text/70 leading-relaxed">
                                        {item.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* WhatsApp Contact for Services */}
                      <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="text-center md:text-left">
                            <h4 className="text-lg font-semibold text-kraft-text mb-1">
                              Interested in {activeSection.title}?
                            </h4>
                            <p className="text-sm text-kraft-text/70">
                              Contact us on WhatsApp for custom quotes and bookings
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              const message = `Hello! I'm interested in your ${activeSection.title}. Please provide more details.`;
                              const encodedMessage = encodeURIComponent(message);
                              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
                            }}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold whitespace-nowrap"
                            size="lg"
                          >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Contact via WhatsApp
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Download PDF Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF || !detailedMenu}
                  size="lg"
                  className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-semibold px-8 py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download Full Menu (PDF)'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">100% Pure Vegetarian</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                All our dishes are prepared following strict Jain and Vaishnav dietary guidelines. 
                No onion, no garlic, no root vegetables - only pure, sattvic ingredients that nourish body and soul.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Leaf className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">No Onion & Garlic</h4>
                <p className="text-sm text-muted-foreground">
                  Strictly adhering to Jain principles
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mb-4">
                  <ChefHat className="w-7 h-7 text-secondary" />
                </div>
                <h4 className="font-semibold mb-2">Fresh Daily</h4>
                <p className="text-sm text-muted-foreground">
                  Prepared fresh with quality ingredients
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                  <Utensils className="w-7 h-7 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Traditional Recipes</h4>
                <p className="text-sm text-muted-foreground">
                  Authentic flavors from time-honored methods
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
