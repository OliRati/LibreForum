import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch } from '../../lib/api';

interface AppFeatures {
  aiEnabled: boolean;
}

const AppFeaturesContext = createContext<AppFeatures>({ aiEnabled: false });

export function AppFeaturesProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<AppFeatures>({ aiEnabled: false });

  useEffect(() => {
    let active = true;

    async function loadFeatures() {
      try {
        const response = await apiFetch<unknown>('/api/features');
        if (
          typeof response !== 'object' ||
          response === null ||
          !('aiEnabled' in response) ||
          typeof response.aiEnabled !== 'boolean'
        ) {
          throw new Error('Invalid feature configuration response');
        }

        if (active) {
          setFeatures({ aiEnabled: response.aiEnabled });
        }
      } catch (error) {
        console.error('Unable to load application features', error);
      }
    }

    loadFeatures();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppFeaturesContext.Provider value={features}>
      {children}
    </AppFeaturesContext.Provider>
  );
}

export function useAppFeatures(): AppFeatures {
  return useContext(AppFeaturesContext);
}
