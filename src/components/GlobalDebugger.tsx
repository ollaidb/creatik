import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Database, Wifi, Clock, Bug, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMemory {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

interface DebugInfo {
  timestamp: string;
  userAgent: string;
  connectionStatus: 'checking' | 'connected' | 'disconnected';
  tables: {
    [key: string]: {
      success: boolean;
      count?: number;
      duration?: number;
      error?: string;
    };
  };
  performance: {
    loadTime: number;
    memoryUsage?: number;
  };
}

const GlobalDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

  const runGlobalDebug = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Lancement du diagnostic global...');
      
      const startTime = performance.now();
      
      // Test de toutes les tables importantes
      const tables = [
        { name: 'categories', query: () => supabase.from('categories').select('*').limit(5) },
        { name: 'themes', query: () => supabase.from('themes').select('*') },
        { name: 'challenges', query: () => supabase.from('challenges').select('*').eq('is_active', true) },
        { name: 'user_publications', query: () => supabase.from('user_publications').select('*').limit(10) },
        { name: 'user_challenges', query: () => supabase.from('user_challenges').select('*').limit(10) },
        { name: 'social_networks', query: () => supabase.from('social_networks').select('*') },
      ];

      const tableResults: DebugInfo['tables'] = {};

      for (const table of tables) {
        const tableStartTime = performance.now();
        
        try {
          const { data, error } = await table.query();
          const tableEndTime = performance.now();
          const duration = tableEndTime - tableStartTime;
          
          if (error) {
            tableResults[table.name] = {
              success: false,
              error: error.message,
              duration
            };
          } else {
            tableResults[table.name] = {
              success: true,
              count: data?.length || 0,
              duration
            };
          }
        } catch (error) {
          tableResults[table.name] = {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            duration: 0
          };
        }
      }

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      const debugData: DebugInfo = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        connectionStatus,
        tables: tableResults,
        performance: {
          loadTime,
          memoryUsage: (performance as Performance & { memory?: PerformanceMemory }).memory?.usedJSHeapSize
        }
      };

      setDebugInfo(debugData);
      console.log('✅ Diagnostic global terminé:', debugData);
      
    } catch (error) {
      console.error('❌ Erreur lors du diagnostic global:', error);
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

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3"
          title="Diagnostic global"
        >
          <Bug className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Diagnostic Global
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Statut de connexion */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                Impossible de se connecter à la base de données.
              </p>
            )}
          </div>

          {/* Bouton d'action */}
          <div className="mb-6">
            <Button 
              onClick={runGlobalDebug} 
              disabled={isRunning}
              className="flex items-center gap-2 w-full"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {isRunning ? 'Diagnostic en cours...' : 'Lancer le diagnostic global'}
            </Button>
          </div>

          {/* Résultats */}
          {debugInfo && (
            <div className="space-y-4">
              <h4 className="font-medium">Résultats du diagnostic:</h4>
              
              {/* Performance */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium mb-2">Performance:</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Temps de chargement:</span>
                    <span>{debugInfo.performance.loadTime.toFixed(2)}ms</span>
                  </div>
                  {debugInfo.performance.memoryUsage && (
                    <div className="flex justify-between">
                      <span>Mémoire utilisée:</span>
                      <span>{(debugInfo.performance.memoryUsage / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tables */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="font-medium mb-2">Tables de base de données:</h5>
                <div className="space-y-2">
                  {Object.entries(debugInfo.tables).map(([tableName, result]) => (
                    <div key={tableName} className="flex justify-between items-center text-sm">
                      <span className="capitalize">{tableName}:</span>
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <>
                            <span className="text-green-600">{result.count} éléments</span>
                            <span className="text-gray-500">({result.duration?.toFixed(0)}ms)</span>
                          </>
                        ) : (
                          <span className="text-red-600">{result.error}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informations système */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="font-medium mb-2">Informations système:</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span>{new Date(debugInfo.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Navigateur:</span>
                    <span className="text-xs truncate max-w-32">{debugInfo.userAgent.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conseils */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">
              Conseils de dépannage:
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Rechargez la page si les tables ne répondent pas</li>
              <li>• Vérifiez votre connexion internet</li>
              <li>• Videz le cache du navigateur</li>
              <li>• Contactez le support si le problème persiste</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalDebugger; 