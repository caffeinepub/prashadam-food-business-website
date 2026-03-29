import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsAdmin, useImportTestimonial } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Lock, Upload, Link as LinkIcon, FileText, Download, Share2, Sparkles, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PromoMaterial {
  id: string;
  title: string;
  description: string;
  imagePath: string;
}

const promoMaterials: PromoMaterial[] = [
  {
    id: 'promo-1',
    title: 'Built with AI by DFINITY',
    description: 'Our website was built with AI by DFINITY\'s Internet Computer — fast, elegant, and easy!',
    imagePath: '/assets/generated/promo-ai-dfinity-updated.dim_1080x1080.png',
  },
  {
    id: 'promo-2',
    title: 'Love AI',
    description: 'Built with AI — powered by Caffeine.ai on the Internet Computer 🚀',
    imagePath: '/assets/generated/promo-love-ai-updated.dim_1080x1080.png',
  },
  {
    id: 'promo-3',
    title: 'Smart AI',
    description: 'Transform your business online — with AI by DFINITY\'s Internet Computer 🌐',
    imagePath: '/assets/generated/promo-smart-ai-updated.dim_1080x1080.png',
  },
];

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { importTestimonial, isImporting, isSuccess, isError, error } = useImportTestimonial();

  const [manualFormData, setManualFormData] = useState({
    name: '',
    review: '',
    rating: '5',
  });

  const [googleLinkFormData, setGoogleLinkFormData] = useState({
    name: '',
    review: '',
    rating: '5',
  });

  const [showGoogleForm, setShowGoogleForm] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualFormData.name.trim() || !manualFormData.review.trim()) {
      return;
    }

    try {
      await importTestimonial({
        name: manualFormData.name.trim(),
        review: manualFormData.review.trim(),
        rating: BigInt(manualFormData.rating),
      });
      
      // Reset form on success
      setManualFormData({
        name: '',
        review: '',
        rating: '5',
      });
    } catch (err) {
      console.error('Failed to import testimonial:', err);
    }
  };

  const handleManualInputChange = (field: string, value: string) => {
    setManualFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoogleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!googleLinkFormData.name.trim() || !googleLinkFormData.review.trim()) {
      return;
    }

    try {
      await importTestimonial({
        name: googleLinkFormData.name.trim(),
        review: googleLinkFormData.review.trim(),
        rating: BigInt(googleLinkFormData.rating),
      });
      
      // Reset form on success
      setGoogleLinkFormData({
        name: '',
        review: '',
        rating: '5',
      });
      setShowGoogleForm(false);
    } catch (err) {
      console.error('Failed to import testimonial:', err);
    }
  };

  const handleGoogleFormInputChange = (field: string, value: string) => {
    setGoogleLinkFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownloadPromo = async (promo: PromoMaterial) => {
    try {
      const response = await fetch(promo.imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prashadam-${promo.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  // Loading state while checking authentication
  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-6 h-6" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
                Please log in to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full"
              >
                {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not an admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You do not have permission to access this page. Admin access is required.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Admin interface
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>

        {/* Testimonial Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Testimonial
            </CardTitle>
            <CardDescription>
              Add customer reviews from Google My Business or enter them manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Manual Import
                </TabsTrigger>
                <TabsTrigger value="google" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  From Google Review
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-6">
                <form onSubmit={handleManualSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="manual-name">
                      Reviewer Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="manual-name"
                      type="text"
                      placeholder="Enter customer name"
                      value={manualFormData.name}
                      onChange={(e) => handleManualInputChange('name', e.target.value)}
                      required
                      disabled={isImporting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-review">
                      Review Text <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="manual-review"
                      placeholder="Paste the review text here..."
                      value={manualFormData.review}
                      onChange={(e) => handleManualInputChange('review', e.target.value)}
                      required
                      disabled={isImporting}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-rating">Rating (1-5 stars)</Label>
                    <Input
                      id="manual-rating"
                      type="number"
                      min="1"
                      max="5"
                      value={manualFormData.rating}
                      onChange={(e) => handleManualInputChange('rating', e.target.value)}
                      disabled={isImporting}
                    />
                  </div>

                  {isSuccess && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Testimonial imported successfully! It will now appear in the Testimonials section.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error instanceof Error ? error.message : 'Failed to import testimonial. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isImporting || !manualFormData.name.trim() || !manualFormData.review.trim()}
                  >
                    {isImporting ? 'Importing...' : 'Import Testimonial'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="google" className="mt-6">
                <div className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>How to import from Google Reviews:</strong>
                      <ol className="mt-2 ml-4 space-y-1 list-decimal text-sm">
                        <li>Open your Google Business Profile and navigate to the Reviews section</li>
                        <li>Find the review you want to import</li>
                        <li>Copy the reviewer's name, review text, and note the star rating</li>
                        <li>Click "Continue" below and paste the details into the form</li>
                      </ol>
                    </AlertDescription>
                  </Alert>

                  {!showGoogleForm ? (
                    <Button
                      type="button"
                      onClick={() => setShowGoogleForm(true)}
                      className="w-full"
                    >
                      Continue to Import Form
                    </Button>
                  ) : (
                    <form onSubmit={handleGoogleFormSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="google-name">
                          Reviewer Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="google-name"
                          type="text"
                          placeholder="Copy and paste the reviewer's name from Google"
                          value={googleLinkFormData.name}
                          onChange={(e) => handleGoogleFormInputChange('name', e.target.value)}
                          required
                          disabled={isImporting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="google-review">
                          Review Text <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="google-review"
                          placeholder="Copy and paste the full review text from Google..."
                          value={googleLinkFormData.review}
                          onChange={(e) => handleGoogleFormInputChange('review', e.target.value)}
                          required
                          disabled={isImporting}
                          rows={6}
                          className="resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="google-rating">Rating (1-5 stars)</Label>
                        <Input
                          id="google-rating"
                          type="number"
                          min="1"
                          max="5"
                          value={googleLinkFormData.rating}
                          onChange={(e) => handleGoogleFormInputChange('rating', e.target.value)}
                          disabled={isImporting}
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter the star rating shown on the Google review (1-5)
                        </p>
                      </div>

                      {isSuccess && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Testimonial imported successfully! It will now appear in the Testimonials section.
                          </AlertDescription>
                        </Alert>
                      )}

                      {isError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {error instanceof Error ? error.message : 'Failed to import testimonial. Please try again.'}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isImporting || !googleLinkFormData.name.trim() || !googleLinkFormData.review.trim()}
                        >
                          {isImporting ? 'Importing...' : 'Import Testimonial'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowGoogleForm(false);
                            setGoogleLinkFormData({
                              name: '',
                              review: '',
                              rating: '5',
                            });
                          }}
                          disabled={isImporting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Promote Caffeine.ai Section */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
              Promote Caffeine.ai
            </CardTitle>
            <CardDescription className="text-base">
              Share these branded promotional materials on your social media to showcase how your website was built with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Share2 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Sharing Tips:</strong> These images are optimized for Instagram, Facebook, and LinkedIn (1080x1080px). 
                Download and post them to your social media pages to help spread the word about Caffeine.ai!
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoMaterials.map((promo) => (
                <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={promo.imagePath}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{promo.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {promo.description}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownloadPromo(promo)}
                      className="w-full"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                How to Share
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Download your preferred promotional image</li>
                <li>Post it on Instagram, Facebook, LinkedIn, or other social platforms</li>
                <li>Add a caption about your experience with Caffeine.ai</li>
                <li>Tag @caffeine.ai or use #CaffeineAI to help others discover the platform</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
