import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { Calendar } from '@/components/Calendar';
import { AIGenerator } from '@/components/AIGenerator';
import { Analytics } from '@/components/Analytics';
import { PostsManagement } from '@/components/PostsManagement';
import { CreatePostModal } from '@/components/CreatePostModal';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onCreatePost={() => setIsCreatePostOpen(true)}
            onOpenAIGenerator={() => setActiveTab('ai-generator')}
          />
        );
      case 'calendar':
        return <Calendar onCreatePost={() => setIsCreatePostOpen(true)} />;
      case 'create':
        setIsCreatePostOpen(true);
        setActiveTab('dashboard');
        return null;
      case 'ai-generator':
        return <AIGenerator />;
      case 'analytics':
        return <Analytics />;
      case 'posts':
        return <PostsManagement />;
      default:
        return (
          <Dashboard 
            onCreatePost={() => setIsCreatePostOpen(true)}
            onOpenAIGenerator={() => setActiveTab('ai-generator')}
          />
        );
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
      
      <CreatePostModal 
        isOpen={isCreatePostOpen} 
        onClose={() => setIsCreatePostOpen(false)} 
      />
    </>
  );
};

export default Index;
