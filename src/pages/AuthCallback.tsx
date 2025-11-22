import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          console.error('Supabase non configuré');
          toast({
            title: "Erreur de configuration",
            description: "L'authentification n'est pas configurée.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          toast({
            title: "Erreur d'authentification",
            description: "Impossible de récupérer votre session. Veuillez réessayer.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        if (data.session) {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue ! Vous êtes maintenant connecté.",
          });
          navigate('/');
        } else {
          console.warn('Aucune session trouvée');
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors du traitement du callback:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'authentification.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium">Authentification en cours...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Veuillez patienter pendant que nous vous connectons.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback; 