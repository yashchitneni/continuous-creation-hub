
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { useResource } from '@/hooks/useResources';
import { markdownToHtml } from '@/utils/markdownToHtml';
import { ChevronLeft } from 'lucide-react';

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading, error } = useResource(slug);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={goBack} 
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

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
            <Button onClick={() => navigate('/')} className="mt-4">
              Return Home
            </Button>
          </div>
        ) : resource ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">{resource.title}</h1>
            <div className="prose prose-sm sm:prose lg:prose-lg mx-auto dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(resource.content) }} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-destructive mb-2">Resource Not Found</h1>
            <p className="text-muted-foreground">
              The resource you're looking for couldn't be found.
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return Home
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ResourceDetail;
