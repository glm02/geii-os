import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import StudentApp from './StudentApp';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return <StudentApp />;
};

export default Index;
