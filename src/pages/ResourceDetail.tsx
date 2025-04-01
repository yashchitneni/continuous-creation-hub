
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useResource } from '@/hooks/useResources';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { markdownToHtml } from '@/utils/markdownToHtml';

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: resource, isLoading, error } = useResource(slug);
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          Loading resource...
        </div>
      </PageLayout>
    );
  }
  
  if (error || !resource) {
    return <Navigate to="/not-found" replace />;
  }
  
  return (
    <PageLayout>
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="pl-0 hover:pl-0">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">{resource.title}</h1>
          <Separator className="mb-8" />
          
          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(resource.content) }}
          />
          
          <div className="mt-16 flex justify-center">
            <Button asChild>
              <Link to="/hackathons">Explore Hackathons</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResourceDetail;
