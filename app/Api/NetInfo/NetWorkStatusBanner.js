// // components/NetworkStatusBanner.js
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// // import useNetInfoBanner from '../hooks/useNetInfoBanner';
// import useNetInfoBanner from './useNetInfoBanner';

// const NetworkStatusBanner = () => {
//   const { isOffline, isSlowConnection } = useNetInfoBanner();

//   if (!isOffline && !isSlowConnection) return null;

//   const message = isOffline
//     ? 'No internet connection'
//     : 'Slow internet connection';

//   return (
//     <View style={[styles.banner, isOffline ? styles.offline : styles.slow]}>
//       <Text style={styles.text}>{message}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   banner: {
//     padding: 8,
//     width: '100%',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   offline: {
//     backgroundColor: '#007bff',
//   },
//   slow: {
//     backgroundColor: 'orange',
//   },
//   text: {
//     color: 'white',
//     fontWeight: '600',
//   },
// });

// export default NetworkStatusBanner;


// components/NetworkStatusBanner.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import useNetInfoBanner from '../hooks/useNetInfoBanner';
import useNetInfoBanner from './useNetInfoBanner';

const NetworkStatusBanner = () => {
  const { showBanner, bannerType } = useNetInfoBanner();

  if (!showBanner || !bannerType) return null;

  const message =
    bannerType === 'offline'
      ? 'No internet connection'
      : 'Poor or unstable internet connection';

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: bannerType === 'offline' ? '#007bff' : '#ffa500' },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default NetworkStatusBanner;

