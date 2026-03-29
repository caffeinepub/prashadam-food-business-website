import { Card, CardContent } from '@/components/ui/card';
import { Heart, Leaf, Users, Award } from 'lucide-react';

export default function AboutPage() {
  const principles = [
    {
      icon: Leaf,
      title: 'Purity in Every Ingredient',
      description: 'We strictly follow Jain and Vaishnav dietary guidelines, ensuring no onion, no garlic, and only the freshest sattvic ingredients in our kitchen.',
    },
    {
      icon: Heart,
      title: 'Cooked with Devotion',
      description: 'Every meal is prepared with love and dedication, treating food as prashadam - a sacred offering that nourishes both body and soul.',
    },
    {
      icon: Users,
      title: 'Traditional Recipes',
      description: 'Our recipes are passed down through generations, preserving the authentic flavors and cooking techniques of traditional Indian vegetarian cuisine.',
    },
    {
      icon: Award,
      title: 'Quality & Hygiene',
      description: 'We maintain the highest standards of cleanliness and food safety, ensuring every meal meets our strict quality benchmarks.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Prashadam Food</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Serving pure vegetarian Jain and Vaishnav cuisine with devotion and tradition
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Prashadam Food was born from a deep commitment to preserving and sharing the sacred tradition of pure vegetarian cooking. Based in New Delhi, we have dedicated ourselves to serving authentic Jain and Vaishnav cuisine that honors ancient dietary principles while meeting modern needs.
                </p>
                <p>
                  Our journey began with a simple belief: food prepared with purity and devotion has the power to nourish not just the body, but the mind and spirit as well. Every dish we create follows strict sattvic guidelines - no onion, no garlic - using only ingredients that promote clarity, peace, and well-being.
                </p>
                <p>
                  Today, we serve families, professionals, and organizations across New Delhi through our tiffin service, corporate buffets, and event catering. Each meal is prepared fresh in our kitchen, following traditional recipes and cooking methods that have been perfected over generations.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/assets/generated/kitchen.dim_600x400.jpg"
                alt="Our Kitchen"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Principles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The values that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {principles.map((principle, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <principle.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{principle.title}</h3>
                  <p className="text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Commitment to You</h2>
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    At Prashadam Food, we understand that dietary purity is not just a preference - it's a way of life rooted in spiritual and cultural values. We are committed to honoring these values in every aspect of our service.
                  </p>
                  <p>
                    Our kitchen is a sacred space where we maintain strict protocols to ensure complete adherence to Jain and Vaishnav dietary guidelines. We source our ingredients carefully, prepare each dish with mindfulness, and deliver with the respect that prashadam deserves.
                  </p>
                  <p>
                    Whether you're ordering a daily tiffin, planning a corporate event, or celebrating a special occasion, you can trust that every meal from Prashadam Food is prepared with the same devotion and attention to purity that you would expect in your own home.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

