import { useEffect, useRef, useState } from 'react';

/**
 * Composant pour coordonner les requêtes entre les onglets du navigateur
 * Évite que tous les onglets ne lancent des requêtes simultanément
 */
export const TabCoordinator = ({ children }: { children: React.ReactNode }) => {
  const [isPrimaryTab, setIsPrimaryTab] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Utiliser BroadcastChannel pour la communication entre onglets
    if (typeof BroadcastChannel !== 'undefined') {
      channelRef.current = new BroadcastChannel('creatik-tab-coordinator');

      // Vérifier si on est l'onglet principal
      const checkPrimaryTab = () => {
        const tabId = sessionStorage.getItem('tab-id');
        if (!tabId) {
          // Premier onglet à se charger
          const newTabId = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('tab-id', newTabId);
          sessionStorage.setItem('tab-primary', 'true');
          setIsPrimaryTab(true);
          return;
        }

        // Vérifier si on est l'onglet principal
        const isPrimary = sessionStorage.getItem('tab-primary') === 'true';
        setIsPrimaryTab(isPrimary);

        // Si on n'est pas l'onglet principal, écouter les messages
        if (!isPrimary) {
          channelRef.current?.postMessage({
            type: 'TAB_ALIVE',
            tabId: tabId,
          });
        }
      };

      // Vérifier immédiatement
      checkPrimaryTab();

      // Écouter les messages des autres onglets
      channelRef.current.onmessage = (event) => {
        if (event.data.type === 'TAB_ALIVE' && isPrimaryTab) {
          // Un autre onglet est actif, on reste l'onglet principal
          // Les autres onglets ne doivent pas faire de requêtes
        }
      };

      // Vérifier périodiquement si l'onglet principal est toujours actif
      checkIntervalRef.current = setInterval(() => {
        if (isPrimaryTab) {
          channelRef.current?.postMessage({
            type: 'PRIMARY_TAB_HEARTBEAT',
            timestamp: Date.now(),
          });
        }
      }, 5000); // Toutes les 5 secondes

      // Nettoyer quand l'onglet se ferme
      window.addEventListener('beforeunload', () => {
        if (isPrimaryTab) {
          // Supprimer le statut de primary tab
          sessionStorage.removeItem('tab-primary');
          channelRef.current?.postMessage({
            type: 'PRIMARY_TAB_CLOSED',
          });
        }
        channelRef.current?.close();
      });

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
        if (isPrimaryTab) {
          sessionStorage.removeItem('tab-primary');
        }
        channelRef.current?.close();
      };
    } else {
      // Fallback : si BroadcastChannel n'est pas disponible, considérer tous les onglets comme primaires
      setIsPrimaryTab(true);
    }
  }, [isPrimaryTab]);

  // Sauvegarder l'état dans le contexte si nécessaire
  useEffect(() => {
    // Stocker l'état dans sessionStorage pour que les autres composants puissent y accéder
    if (typeof window !== 'undefined') {
      (window as any).__CREATIK_IS_PRIMARY_TAB__ = isPrimaryTab;
    }
  }, [isPrimaryTab]);

  return <>{children}</>;
};

/**
 * Hook pour vérifier si l'onglet actuel est l'onglet principal
 */
export const useIsPrimaryTab = (): boolean => {
  const [isPrimary, setIsPrimary] = useState(() => {
    if (typeof window !== 'undefined') {
      return (window as any).__CREATIK_IS_PRIMARY_TAB__ ?? 
             sessionStorage.getItem('tab-primary') === 'true';
    }
    return true;
  });

  useEffect(() => {
    const checkPrimary = () => {
      const isPrimaryTab = sessionStorage.getItem('tab-primary') === 'true';
      setIsPrimary(isPrimaryTab);
    };

    // Vérifier immédiatement
    checkPrimary();

    // Écouter les changements de sessionStorage (déclenchés par d'autres onglets)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tab-primary') {
        checkPrimary();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return isPrimary;
};

