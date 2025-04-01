
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { useResource } from '@/hooks/useResources';
import { markdownToHtml } from '@/utils/markdownToHtml';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading, error } = useResource(slug);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/30 to-background pt-10 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/resources">Resources</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{resource?.title || slug}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="ghost" 
            onClick={goBack} 
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading resource...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-destructive mb-2">Resource Not Found</h1>
            <p className="text-muted-foreground">
              The resource you're looking for couldn't be found.
            </p>
            <Button onClick={() => navigate('/resources')} className="mt-4">
              Return to Resources
            </Button>
          </div>
        ) : resource ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">{resource.title}</h1>
            </div>
            
            <Separator className="mb-6" />
            
            {/* Content section with proper styling for markdown */}
            <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(resource.content) }} />
            </div>
            
            <div className="mt-10 pt-6 border-t">
              <Button asChild variant="outline">
                <Link to="/resources">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Resources
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-destructive mb-2">Resource Not Found</h1>
            <p className="text-muted-foreground">
              The resource you're looking for couldn't be found.
            </p>
            <Button onClick={() => navigate('/resources')} className="mt-4">
              Return to Resources
            </Button>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default ResourceDetail;
