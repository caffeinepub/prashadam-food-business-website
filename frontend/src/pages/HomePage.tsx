import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Users, Utensils, Award, Phone, Mail } from 'lucide-react';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function HomePage() {
  const services = [
    {
      icon: Utensils,
      title: 'Tiffin Service',
      description: 'Daily fresh, homemade meals delivered to your doorstep with traditional Jain and Vaishnav recipes.',
      image: '/assets/generated/tiffin-service.dim_400x300.jpg',
    },
    {
      icon: Users,
      title: 'Corporate Buffet',
      description: 'Professional catering for corporate events with a wide variety of pure vegetarian dishes.',
      image: '/assets/generated/buffet-setup.dim_600x400.jpg',
    },
    {
      icon: Award,
      title: 'Event Catering',
      description: 'Complete catering solutions for weddings, parties, and special occasions with authentic flavors.',
      image: '/assets/generated/menu-spread.dim_600x400.jpg',
    },
  ];

  const values = [
    {
      icon: Leaf,
      title: 'Pure & Sattvic',
      description: 'No onion, no garlic - following strict Jain and Vaishnav dietary principles',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Fresh ingredients and traditional cooking methods for authentic taste',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Dedicated to serving with love and maintaining the highest standards',
    },
  ];

  const galleryImages = [
    {
      src: '/assets/generated/tiffin-service.dim_400x300.jpg',
      alt: 'Tiffin Service - Pure Vegetarian Jain & Vaishnav Cuisine',
      caption: 'Tiffin Service',
    },
    {
      src: '/assets/generated/buffet-setup.dim_600x400.jpg',
      alt: 'Buffet Setup - Pure Vegetarian Jain & Vaishnav Cuisine',
      caption: 'Buffet Setup',
    },
    {
      src: '/assets/generated/kitchen.dim_600x400.jpg',
      alt: 'Kitchen - Pure Vegetarian Jain & Vaishnav Cuisine',
      caption: 'Our Kitchen',
    },
    {
      src: '/assets/generated/menu-spread.dim_600x400.jpg',
      alt: 'Menu Spread - Pure Vegetarian Jain & Vaishnav Cuisine',
      caption: 'Menu Variety',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Pure Vegetarian Cuisine from the Heart
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Experience authentic Jain and Vaishnav food prepared with devotion. No onion, no garlic - just pure, sattvic flavors that nourish body and soul.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu">
                  <Button size="lg" className="text-lg">
                    View Our Menu
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-thali.dim_800x600.jpg"
                alt="Traditional Thali"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Committed to purity, tradition, and excellence in every meal we serve
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From daily tiffins to grand celebrations, we bring authentic vegetarian cuisine to your table
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4">
                    <service.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link to="/menu">
                    <Button variant="link" className="p-0">
                      Learn More →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Gallery</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pure Vegetarian Jain & Vaishnav Cuisine
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <p className="text-white font-semibold text-lg">{image.caption}</p>
                      <p className="text-white/90 text-sm">Pure Vegetarian Jain & Vaishnav Cuisine</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* To know more about us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">To know more about us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Contact us today and enjoy pure vegetarian food
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <a href="tel:8802452190" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg gap-3 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                <Phone className="w-5 h-5" />
                <span>Call or WhatsApp: 8802452190</span>
              </Button>
            </a>
            <a href="mailto:support@prashadamfood.com" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg gap-3 border-2 hover:bg-secondary/10 shadow-lg hover:shadow-xl transition-all">
                <Mail className="w-5 h-5" />
                <span>Send Email</span>
              </Button>
            </a>
          </div>
          <p className="text-center text-muted-foreground mt-8 text-base">
            We are ready to serve you. Please call or email us.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Pure Vegetarian Cuisine?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your requirements or place an order
          </p>
          <Link to="/contact">
            <Button size="lg" className="text-lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
