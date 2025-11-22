import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Database, Wifi, Clock } from 'lucide-react';
import { debugCategories, testCategoryQuery } from '@/utils/debugCategories';
import { supabase } from '@/integrations/supabase/client';

interface DebugResult {
  success: boolean;
  error?: string;
  categories?: number;
  themes?: number;
  networks?: number;
  duration?: number;
}

const CategoryDebugger: React.FC = () => {
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Vérifier la connexion Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        const { data, error } = await supabase
          .from('categories')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error('❌ Erreur de connexion Supabase:', error);
          setConnectionStatus('disconnected');
        } else {
          console.log('✅ Connexion Supabase OK');
          setConnectionStatus('connected');
        }
      } catch (error) {
        console.error('❌ Exception de connexion:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  const runDebug = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Lancement du diagnostic des catégories...');
      const result = await debugCategories();
      setDebugResult(result);
      console.log('✅ Diagnostic terminé:', result);
    } catch (error) {
      console.error('❌ Erreur lors du diagnostic:', error);
      setDebugResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testQuery = async () => {
    setIsRunning(true);
    try {
      console.log('🧪 Test de requête catégories...');
      const result = await testCategoryQuery();
      setDebugResult({
        success: result.success,
        error: result.error?.message,
        duration: result.duration,
        categories: result.data?.length
      });
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      setDebugResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Database className="h-4 w-4" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        Diagnostic des Catégories
      </h3>

      {/* Statut de connexion */}
      <div className="mb-4 p-3 bg-white dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {getStatusIcon()}
          <span className="font-medium">Statut de connexion:</span>
          <span className={getStatusColor()}>
            {connectionStatus === 'connected' && 'Connecté'}
            {connectionStatus === 'disconnected' && 'Déconnecté'}
            {connectionStatus === 'checking' && 'Vérification...'}
          </span>
        </div>
        
        {connectionStatus === 'disconnected' && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Impossible de se connecter à la base de données. Vérifiez votre connexion internet.
          </p>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={runDebug} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          {isRunning ? 'Diagnostic en cours...' : 'Diagnostic complet'}
        </Button>
        
        <Button 
          onClick={testQuery} 
          disabled={isRunning}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Wifi className="h-4 w-4" />
          Test requête
        </Button>
      </div>

      {/* Résultats */}
      {debugResult && (
        <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium mb-2">Résultats du diagnostic:</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Statut:</span>
              <span className={debugResult.success ? 'text-green-600' : 'text-red-600'}>
                {debugResult.success ? 'Succès' : 'Échec'}
              </span>
            </div>
            
            {debugResult.duration && (
              <div className="flex justify-between">
                <span>Durée:</span>
                <span>{debugResult.duration.toFixed(2)}ms</span>
              </div>
            )}
            
            {debugResult.categories !== undefined && (
              <div className="flex justify-between">
                <span>Catégories:</span>
                <span>{debugResult.categories}</span>
              </div>
            )}
            
            {debugResult.themes !== undefined && (
              <div className="flex justify-between">
                <span>Thèmes:</span>
                <span>{debugResult.themes}</span>
              </div>
            )}
            
            {debugResult.networks !== undefined && (
              <div className="flex justify-between">
                <span>Réseaux sociaux:</span>
                <span>{debugResult.networks}</span>
              </div>
            )}
            
            {debugResult.error && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-400">
                <strong>Erreur:</strong> {debugResult.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conseils de dépannage */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
          Conseils de dépannage:
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Vérifiez votre connexion internet</li>
          <li>• Rechargez la page (Ctrl+F5)</li>
          <li>• Videz le cache du navigateur</li>
          <li>• Vérifiez que Supabase est accessible</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryDebugger; 