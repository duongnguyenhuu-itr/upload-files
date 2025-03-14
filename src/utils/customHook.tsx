/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DependencyList,
  EffectCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import emitter from '@/utils/emitter';

const useSetState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, set] = useState<T>(initialState);
  const setState = useCallback((patch: Partial<T> | ((prevState: T) => Partial<T>)) => {
    set((prevState) =>
      Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch),
    );
  }, []);
  return [state, setState];
};

const useMediaQuery = (query: string): boolean => {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange(): void {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
};

const useConstructor = (callBack: EffectCallback = () => {}): void => {
  const hasBeenCalled = useRef<boolean>(false);
  if (hasBeenCalled.current) return;
  callBack();
  hasBeenCalled.current = true;
};

const usePrevRender = (callBack: () => any, dependency: DependencyList = []): void => {
  const hasBeenCalled = useRef<boolean>(false);
  const prevDependency = useRef<DependencyList>([]);
  const cleanupRef = useRef<any>();

  useEffect(
    () => () => {
      if (_.isFunction(cleanupRef.current)) {
        cleanupRef.current();
      }
    },
    [],
  );

  // Handle clean up
  if (!_.isEqual(dependency, prevDependency.current) && hasBeenCalled.current) {
    hasBeenCalled.current = false;
    if (_.isFunction(cleanupRef.current)) {
      cleanupRef.current();
    }
  }

  prevDependency.current = [...dependency];
  if (hasBeenCalled.current) return;
  cleanupRef.current = callBack();
  hasBeenCalled.current = true;
};

const useEmitter = (
  key: string,
  callback: (...args: any[]) => any,
  deps: DependencyList = [],
): typeof emitter => {
  usePrevRender(() => {
    if (!(key && callback)) return;
    const listener = emitter.addListener(key, callback);
    return () => listener.remove();
  }, [key, ...deps]);

  return emitter;
};

/*
 *  const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * The hook will only return the latest value if it's been more than 500ms since searchTerm changed.
 */
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

function useIntersectionObserver(
  element: any,
  appear: () => void,
  dissolve: any,
  deps: any[],
) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      appear();
    } else {
      dissolve?.();
    }
  });
  useEffect(() => {
    if (!element) return;
    observer.observe(element);
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element, ...deps]);
  return observer;
}

function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

const useUpdateEffect = (
  effect: any,
  dependencies: DependencyList = [],
  cleanup?: any,
  timeOutConfig?: { timeout: 0 },
) => {
  const isInitialMount = useRef(true);
  const handleTimeOut = useRef<any>(undefined);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (!_.isEmpty(timeOutConfig)) {
      if (handleTimeOut.current) {
        clearTimeout(handleTimeOut.current);
      }
      handleTimeOut.current = setTimeout(() => {
        effect();
      }, timeOutConfig?.timeout || 0);
    } else {
      effect();
    }
    return cleanup;
  }, dependencies);
};

const useInternetConnectivity = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const interval = useRef<number | NodeJS.Timeout>();

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    interval.current = setInterval(() => {
      if (navigator.onLine && !isOnline) {
        setIsOnline(true);
      } else if (!navigator.onLine && isOnline) {
        setIsOnline(false);
      }
    }, 1000);
    return () => {
      clearInterval(interval.current);
    };
  }, [isOnline]);

  return isOnline;
};

const useForceRender = () => {
  const [, setTick] = useState(0);
  const forceRender = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return forceRender;
};

export {
  useSetState,
  useMediaQuery,
  useConstructor,
  usePrevRender,
  useEmitter,
  useDebounce,
  useIntersectionObserver,
  useForceUpdate,
  useUpdateEffect,
  useInternetConnectivity,
  useForceRender,
};
