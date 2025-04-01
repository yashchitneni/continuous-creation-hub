
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useResources } from '@/hooks/useResources';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, HelpCircle, ListOrdered, Settings, Video } from 'lucide-react';

// Map of resource slugs to icons
const resourceIcons: Record<string, React.ReactNode> = {
  'how-it-works': <BookOpen className="h-6 w-6" />,
  'submission-guidelines': <FileText className="h-6 w-6" />,
  'voting-system': <ListOrdered className="h-6 w-6" />,
  'terms': <FileText className="h-6 w-6" />,
  'privacy': <FileText className="h-6 w-6" />,
  'cookies': <Settings className="h-6 w-6" />,
};

// Return an icon based on the resource slug or a default icon
const getResourceIcon = (slug: string) => {
  return resourceIcons[slug] || <HelpCircle className="h-6 w-6" />;
};

const Resources = () => {
  const { data: resources = [], isLoading, error } = useResources();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/30 to-background px-4 py-20 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Resources & Guides</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            Learn how to connect, build, and grow with our community through these helpful resources.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 py-12 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Resources</h2>
              <p className="text-muted-foreground">
                We encountered an issue while loading the resources. Please try again later.
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">No Resources Available</h2>
              <p className="text-muted-foreground">
                Check back soon as we add more helpful guides and resources.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="flex flex-col h-full transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      {getResourceIcon(resource.slug)}
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {resource.content.substring(0, 120).replace(/\\n/g, ' ')}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Content space */}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button asChild className="w-full">
                      <Link to={`/resources/${resource.slug}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Resources;
