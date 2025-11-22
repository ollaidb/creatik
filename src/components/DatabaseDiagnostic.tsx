import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';

interface TableStatus {
  name: string;
  status: 'success' | 'error' | 'checking';
  error?: string;
  count?: number;
  duration?: number;
}

export const DatabaseDiagnostic: React.FC = () => {
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Liste des tables principales à vérifier
  const mainTables = [
    'categories',
    'subcategories',
    'subcategories_level2',
    'content_titles',
    'challenges',
    'user_challenges',
    'user_publications',
    'user_favorites',
    'social_networks',
    'themes',
    'profiles',
    'hooks',
    'daily_events',
    'event_categories',
  ];

  const testTable = async (tableName: string): Promise<TableStatus> => {
    const startTime = performance.now();
    try {
      // Essayer une requête simple
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      const duration = performance.now() - startTime;

      if (error) {
        return {
          name: tableName,
          status: 'error',
          error: error.message || 'Erreur inconnue',
          duration,
        };
      }

      return {
        name: tableName,
        status: 'success',
        count: count ?? data?.length ?? 0,
        duration,
      };
    } catch (err) {
      const duration = performance.now() - startTime;
      return {
        name: tableName,
        status: 'error',
        error: err instanceof Error ? err.message : 'Erreur inconnue',
        duration,
      };
    }
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setTables(mainTables.map(name => ({ name, status: 'checking' })));

    const results: TableStatus[] = [];

    // Tester les tables une par une
    for (const tableName of mainTables) {
      const result = await testTable(tableName);
      results.push(result);
      setTables([...results, ...mainTables.slice(results.length).map(name => ({ name, status: 'checking' as const }))]);
      // Petit délai pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTables(results);
    setLastUpdate(new Date());
    setIsRunning(false);
  };

  useEffect(() => {
    // Exécuter le diagnostic au montage
    runDiagnostic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const successCount = tables.filter(t => t.status === 'success').length;
  const errorCount = tables.filter(t => t.status === 'error').length;

  return (
    <Card className="m-4 border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Diagnostic de la Base de Données</CardTitle>
          </div>
          <Button
            onClick={runDiagnostic}
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Test en cours...' : 'Actualiser'}
          </Button>
        </div>
        {lastUpdate && (
          <p className="text-xs text-muted-foreground mt-2">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <Badge variant="default" className="gap-2">
            <CheckCircle className="h-3 w-3" />
            {successCount} table(s) accessible(s)
          </Badge>
          <Badge variant="destructive" className="gap-2">
            <XCircle className="h-3 w-3" />
            {errorCount} erreur(s)
          </Badge>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tables.map((table) => (
            <div
              key={table.name}
              className={`p-3 rounded-lg border ${
                table.status === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : table.status === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {table.status === 'checking' && (
                    <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
                  )}
                  {table.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {table.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">{table.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {table.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {table.count} ligne(s)
                    </span>
                  )}
                  {table.duration !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {table.duration.toFixed(0)}ms
                    </span>
                  )}
                </div>
              </div>
              {table.error && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  <strong>Erreur:</strong> {table.error}
                </div>
              )}
            </div>
          ))}
        </div>

        {errorCount > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Attention:</strong> Certaines tables ne sont pas accessibles. 
              Cela peut être dû à:
            </p>
            <ul className="list-disc list-inside text-xs text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
              <li>Les tables n'existent pas dans la base de données</li>
              <li>Les permissions RLS (Row Level Security) bloquent l'accès</li>
              <li>La clé API Supabase n'a pas les permissions nécessaires</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

