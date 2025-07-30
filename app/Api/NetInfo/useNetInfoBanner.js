// // hooks/useNetInfoBanner.js
// import { useEffect, useState } from 'react';
// import NetInfo from '@react-native-community/netinfo';

// export default function useNetInfoBanner() {
//   const [isOffline, setIsOffline] = useState(false);
//   const [isSlowConnection, setIsSlowConnection] = useState(false);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       const slow =
//         state.type === 'cellular' &&
//         ['2g', 'slow-2g'].includes(state.details?.cellularGeneration);

//       setIsOffline(!state.isConnected || !state.isInternetReachable);
//       setIsSlowConnection(slow);
//     });

//     return () => unsubscribe();
//   }, []);

//   return { isOffline, isSlowConnection };
// }

// hooks/useNetInfoBanner.js
// import { useEffect, useState } from 'react';
// import NetInfo from '@react-native-community/netinfo';

// export default function useNetInfoBanner() {
//   const [showBanner, setShowBanner] = useState(false);
//   const [bannerType, setBannerType] = useState(null); // 'offline' | 'slow'

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       const { isConnected, isInternetReachable, type, details } = state;

//       if (!isConnected) {
//         setShowBanner(true);
//         setBannerType('offline');
//       } else if (!isInternetReachable || details.cellularGeneration === '2g') {
//         setShowBanner(true);
//         setBannerType('slow');

//         // Auto-hide after 5s
//         setTimeout(() => {
//           setShowBanner(false);
//           setBannerType(null);
//         }, 5000);
//       } else {
//         setShowBanner(false);
//         setBannerType(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return { showBanner, bannerType };
// }

// hooks/useNetInfoBanner.js
import { useEffect, useState, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetInfoBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState(null); // 'offline' | 'slow'
  const timeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const { isConnected, isInternetReachable, type, details } = state;

      // Always clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!isConnected) {
        // Persist until connection is restored
        setShowBanner(true);
        setBannerType('offline');
      } else if (!isInternetReachable || details?.cellularGeneration === '2g') {
        // Temporary banner for poor connection
        setShowBanner(true);
        setBannerType('slow');

        timeoutRef.current = setTimeout(() => {
          setShowBanner(false);
          setBannerType(null);
        }, 5000); // auto-dismiss after 5 seconds
      } else {
        // Good connection: hide banner
        setShowBanner(false);
        setBannerType(null);
      }
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { showBanner, bannerType };
}
