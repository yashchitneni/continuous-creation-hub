
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, CodeSquare, Users, Award, LightbulbIcon, GitFork, CheckCircle } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <CodeSquare size={24} className="text-jungle" />,
      title: "Mini-Hackathons",
      description: "Regular mini-hackathons focused on specific tools or themes, providing hands-on learning experiences."
    },
    {
      icon: <LightbulbIcon size={24} className="text-coral" />,
      title: "Continuous Building",
      description: "Encourage ongoing learning and creation beyond hackathons through persistent building and iteration."
    },
    {
      icon: <Users size={24} className="text-cambridge" />,
      title: "Community Voting",
      description: "Democratic voting system where the community determines the most innovative and useful projects."
    },
    {
      icon: <GitFork size={24} className="text-khaki" />,
      title: "Build Upon Others",
      description: "Remix and build upon others' projects, creating a collaborative ecosystem of continuous improvement."
    },
  ];

  const values = [
    {
      title: "Openness",
      description: "We promote transparent processes, open-source collaboration, and honest feedback."
    },
    {
      title: "Inclusivity",
      description: "We welcome builders of all backgrounds, skill levels, and perspectives."
    },
    {
      title: "Continuous Improvement",
      description: "We believe in persistent learning, iterative building, and sharing knowledge."
    },
    {
      title: "Community Support",
      description: "We foster a supportive environment where members help each other grow."
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-6 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-jungle/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-coral/10 blur-[80px] animate-pulse-slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">Hackistan</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              A community platform that celebrates continuous creation, collaboration, and learning through mini-hackathons and project showcases.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="w-full py-16 px-4 sm:px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4 text-foreground/90">
                <p>
                  Hackistan stands for the philosophy of continuous building—it's more than just hackathons; it's a space for constant learning, collaboration, and iterative growth.
                </p>
                <p>
                  We believe that the best way to learn is by doing, and the best way to grow is by sharing your work with others and receiving feedback. Our platform enables creators to consistently build, collaborate, and innovate.
                </p>
                <p>
                  Our long-term vision is to empower members to consistently create, collaborate, and innovate; transforming profiles into personal build logs; and enabling members to build on each other's work, creating a rich ecosystem of interconnected projects.
                </p>
              </div>
            </div>
            
            <div className="glassmorphism rounded-xl p-8">
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-background/80 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Community Values</h2>
            <p className="text-muted-foreground">
              The principles that guide our community and shape our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="p-6 glassmorphism rounded-xl">
                <CheckCircle size={24} className="text-jungle mb-4" />
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Origin Story Section */}
      <section className="w-full py-16 px-4 sm:px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Team collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Our Origin Story</h2>
              <div className="space-y-4 text-foreground/90">
                <p>
                  Hackistan started from a mini-hackathon that showcased the power of tools, creativity, and community voting. What began as a weekend event evolved into a broader, ongoing platform.
                </p>
                <p>
                  We noticed that while hackathons were great for spurring innovation, the energy and creativity often dissipated after the event. We wanted to create a space where that momentum could be maintained and where building became a continuous practice rather than a one-time event.
                </p>
                <p>
                  Today, we've grown into a vibrant community of builders who learn from each other, collaborate on projects, and continuously push the boundaries of what's possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Getting Involved Section */}
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Get Involved</h2>
            <p className="text-muted-foreground">
              Join our community and start your building journey with these simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glassmorphism rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-jungle/20 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-jungle">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Sign up and complete your profile with your skills, interests, and portfolio links.
              </p>
              <Button asChild className="mt-auto">
                <Link to="/register">
                  Register Now <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="glassmorphism rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-coral">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Join a Hackathon</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Participate in upcoming mini-hackathons to learn new tools and showcase your skills.
              </p>
              <Button asChild variant="outline" className="mt-auto">
                <Link to="/hackathons">
                  Browse Hackathons <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="glassmorphism rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-cambridge/20 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-cambridge">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Build & Collaborate</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Create projects, submit them to the showcase, vote on others' work, and find collaborators.
              </p>
              <Button asChild variant="outline" className="mt-auto">
                <Link to="/showcase">
                  Explore Projects <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="w-full py-16 px-4 sm:px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="glassmorphism rounded-xl p-8 md:p-12">
            <blockquote className="text-xl md:text-2xl font-medium text-center mb-8">
              "Hackistan has transformed how I approach learning and building. The continuous feedback loop and supportive community have accelerated my growth as a developer exponentially."
            </blockquote>
            
            <div className="flex flex-col items-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Alex Johnson" 
                className="w-16 h-16 rounded-full object-cover mb-3"
              />
              <p className="font-medium">Alex Johnson</p>
              <p className="text-sm text-muted-foreground">Full-stack Developer & Community Member</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Ready to Start Building?
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our community today and embark on a journey of continuous creation, collaboration, and growth.
          </p>
          
          <Button asChild size="lg" className="bg-jungle hover:bg-jungle/90">
            <Link to="/register">
              Create Your Account <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
