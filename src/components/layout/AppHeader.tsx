
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    fetchUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        variant: "default",
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className={cn("w-full bg-gov-blue text-white py-3 px-4 flex items-center justify-between shadow-md", className)}>
      <div className="flex items-center">
        <Link to="/">
          <img 
            src="/ashoka.svg" 
            alt="Emblem of India" 
            className="h-12 mr-4"
            onError={(e) => {
              // Fallback if the SVG isn't available
              e.currentTarget.src = "https://www.india.gov.in/sites/upload_files/npi/files/emblem-dark.png";
            }}
          />
        </Link>
        <div>
          <Link to="/">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Bharat Property Nexus</h1>
          </Link>
          <p className="text-xs md:text-sm text-gray-200">Ministry of Housing & Urban Affairs</p>
        </div>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:underline text-sm font-medium">Home</Link>
        <Link to="/about" className="hover:underline text-sm font-medium">About</Link>
        <Link to="/help" className="hover:underline text-sm font-medium">Help</Link>
        
        {!user ? (
          <Link to="/auth">
            <Button size="sm" variant="outline" className="bg-white text-gov-blue hover:bg-gray-100 border-none">
              <User className="mr-1 h-4 w-4" />
              Login
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm">{user.email}</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleLogout}
              className="bg-white text-gov-blue hover:bg-gray-100 border-none"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile Menu Button */}
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-gov-blue z-50 py-4 px-6 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-white py-2 hover:bg-blue-800 px-3 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-white py-2 hover:bg-blue-800 px-3 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/help" 
              className="text-white py-2 hover:bg-blue-800 px-3 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            
            {!user ? (
              <Link 
                to="/auth" 
                className="text-white py-2 hover:bg-blue-800 px-3 rounded-md flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            ) : (
              <div className="space-y-3 pt-2 border-t border-blue-700">
                <p className="text-sm text-gray-300">{user.email}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-white text-gov-blue hover:bg-gray-100 w-full justify-center"
                >
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
