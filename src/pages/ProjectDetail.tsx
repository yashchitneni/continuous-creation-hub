
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useProject, useGetUserVote, useProjectScores, useVoteForProject } from '@/hooks/useProjects';
import { useHackathon, useIsHackathonParticipant } from '@/hooks/useHackathons';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag } from '@/components/ui/tag';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Award, Calendar, Github, ExternalLink, Star, Users } from 'lucide-react';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  
  const [storyScore, setStoryScore] = useState(5);
  const [styleScore, setStyleScore] = useState(5);
  const [functionScore, setFunctionScore] = useState(5);
  
  console.log("Project ID from params:", projectId);
  
  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: hackathon, isLoading: loadingHackathon } = useHackathon(project?.hackathon_id);
  const { data: isParticipant = false } = useIsHackathonParticipant(
    project?.hackathon_id, 
    user?.id
  );
  
  const { data: userVote } = useGetUserVote(projectId, user?.id);
  const { data: projectScores } = useProjectScores(projectId);
  const voteForProject = useVoteForProject();
  
  console.log("Project data:", project);
  console.log("Related hackathon:", hackathon);
  
  const handleSubmitVote = async () => {
    if (!user || !projectId) return;
    
    await voteForProject.mutateAsync({
      projectId,
      userId: user.id,
      storyScore,
      styleScore,
      functionScore
    });
  };
  
  const isJudgingPhase = hackathon?.status === 'judging';
  const canVote = isJudgingPhase && isParticipant && !userVote && user;
  
  if (loadingProject || loadingHackathon) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          Loading project details...
        </div>
      </PageLayout>
    );
  }
  
  if (!project) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/hackathons">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hackathons
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-2">
            <Button variant="ghost" asChild>
              <Link to={`/hackathons/${project.hackathon_id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hackathon
              </Link>
            </Button>
          </div>
          
          {/* Project Header */}
          <div className="mb-10 glassmorphism rounded-xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {project.tags && project.tags.map((tag, index) => (
                    <Tag key={index} variant={index === 0 ? 'primary' : 'outline'}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  {hackathon && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Submitted for{' '}
                        <Link to={`/hackathons/${hackathon.id}`} className="text-jungle hover:underline">
                          {hackathon.title}
                        </Link>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {projectScores && projectScores.vote_count > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-jungle">
                      {projectScores.total_score.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {projectScores.vote_count} {projectScores.vote_count === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg">{project.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              {project.github_link && (
                <Button variant="outline" asChild>
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub Repository
                  </a>
                </Button>
              )}
              
              {project.website_url && (
                <Button variant="outline" asChild>
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* Project Image */}
          {project.image_url && (
            <div className="mb-10 overflow-hidden rounded-xl">
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}
          
          {/* Project Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <Tabs defaultValue="details" className="mb-10">
                <TabsList className="mb-6">
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                  <TabsTrigger value="scores" disabled={!projectScores || projectScores.vote_count === 0}>
                    Ratings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-semibold mb-4">About the Project</h2>
                    <p className="whitespace-pre-line">{project.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="scores">
                  {projectScores && projectScores.vote_count > 0 ? (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold mb-4">Project Ratings</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Story</span>
                            <span className="text-jungle font-bold">{projectScores.story_score.toFixed(1)}/10</span>
                          </div>
                          <Progress value={projectScores.story_score * 10} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            How well the project tells its story and addresses a need
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Style</span>
                            <span className="text-jungle font-bold">{projectScores.style_score.toFixed(1)}/10</span>
                          </div>
                          <Progress value={projectScores.style_score * 10} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Code quality, architecture, and UI/UX design
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Functionality</span>
                            <span className="text-jungle font-bold">{projectScores.function_score.toFixed(1)}/10</span>
                          </div>
                          <Progress value={projectScores.function_score * 10} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            How well the project works and delivers its promised features
                          </p>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Overall Score</span>
                            <span className="text-jungle font-bold">{projectScores.total_score.toFixed(1)}/10</span>
                          </div>
                          <Progress value={projectScores.total_score * 10} className="h-3 bg-muted/50" />
                          <p className="text-xs text-muted-foreground mt-2 text-right">
                            Based on {projectScores.vote_count} {projectScores.vote_count === 1 ? 'vote' : 'votes'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No ratings available yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              {canVote && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rate This Project</CardTitle>
                    <CardDescription>
                      As a hackathon participant, you can rate this project on three criteria.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          Story ({storyScore}/10)
                        </label>
                      </div>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[storyScore]}
                        onValueChange={(values) => setStoryScore(values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        How well the project tells its story and addresses a need
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          Style ({styleScore}/10)
                        </label>
                      </div>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[styleScore]}
                        onValueChange={(values) => setStyleScore(values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Code quality, architecture, and UI/UX design
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          Functionality ({functionScore}/10)
                        </label>
                      </div>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[functionScore]}
                        onValueChange={(values) => setFunctionScore(values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        How well the project works and delivers its promised features
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSubmitVote} 
                      className="w-full"
                      disabled={voteForProject.isPending}
                    >
                      {voteForProject.isPending ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {userVote && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Rating</CardTitle>
                    <CardDescription>
                      You've already rated this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Story</span>
                        <span className="text-jungle font-bold">{userVote.story_score}/10</span>
                      </div>
                      <Progress value={userVote.story_score * 10} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Style</span>
                        <span className="text-jungle font-bold">{userVote.style_score}/10</span>
                      </div>
                      <Progress value={userVote.style_score * 10} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Functionality</span>
                        <span className="text-jungle font-bold">{userVote.function_score}/10</span>
                      </div>
                      <Progress value={userVote.function_score * 10} className="h-2" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall</span>
                        <span className="text-jungle font-bold">
                          {((userVote.story_score + userVote.style_score + userVote.function_score) / 3).toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {!canVote && !userVote && isJudgingPhase && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-4">
                      {!user ? (
                        <p className="text-muted-foreground">
                          <Link to="/auth" className="text-jungle hover:underline">Sign in</Link> to rate this project
                        </p>
                      ) : !isParticipant ? (
                        <p className="text-muted-foreground">
                          Only hackathon participants can rate projects
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          You need to be signed in to rate this project
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {hackathon && (
                <Card>
                  <CardHeader>
                    <CardTitle>Hackathon Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Link 
                        to={`/hackathons/${hackathon.id}`}
                        className="text-jungle hover:underline font-medium"
                      >
                        {hackathon.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Status: <span className="capitalize">{hackathon.status}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProjectDetail;
