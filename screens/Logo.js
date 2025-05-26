// screens/Logo.js
import React from 'react';
import { View, Image } from 'react-native';

const logos = {
  '1':  require('../assets/crests/1.png'),
  '2':  require('../assets/crests/2.png'),
  '3':  require('../assets/crests/3.png'),
  '4':  require('../assets/crests/4.png'),
  '5':  require('../assets/crests/5.png'),
  '6':  require('../assets/crests/6.png'),
  '7':  require('../assets/crests/7.png'),
  '8':  require('../assets/crests/8.png'),
  '9':  require('../assets/crests/9.png'),
  '10': require('../assets/crests/10.png'),
  '11': require('../assets/crests/11.png'),
  '12': require('../assets/crests/12.png'),
  '13': require('../assets/crests/13.png'),
  '14': require('../assets/crests/14.png'),
  '15': require('../assets/crests/15.png'),
  '16': require('../assets/crests/16.png'),
  '17': require('../assets/crests/17.png'),
  '18': require('../assets/crests/18.png'),
  '19': require('../assets/crests/19.png'),
  '20': require('../assets/crests/20.png'),
  '21': require('../assets/crests/21.png'),
  '22': require('../assets/crests/22.png'),
  '23': require('../assets/crests/23.png'),
  '24': require('../assets/crests/24.png'),
  '25': require('../assets/crests/25.png'),
  '26': require('../assets/crests/26.png'),
  '27': require('../assets/crests/27.png'),
  '28': require('../assets/crests/28.png'),
  '29': require('../assets/crests/29.png'),
  '30': require('../assets/crests/30.png'),
  '31': require('../assets/crests/31.png'),
  '32': require('../assets/crests/32.png'),
  '33': require('../assets/crests/33.png'),
  '34': require('../assets/crests/34.png'),
  '35': require('../assets/crests/35.png'),
  '36': require('../assets/crests/36.png'),
  '37': require('../assets/crests/37.png'),
  '38': require('../assets/crests/38.png'),
  '39': require('../assets/crests/39.png'),
  '40': require('../assets/crests/40.png'),
  '41': require('../assets/crests/41.png'),
  '42': require('../assets/crests/42.png'),
  '43': require('../assets/crests/43.png'),
  '44': require('../assets/crests/44.png'),
  '45': require('../assets/crests/45.png'),
  '46': require('../assets/crests/46.png'),
  '47': require('../assets/crests/47.png'),
  '48': require('../assets/crests/48.png'),
  '49': require('../assets/crests/49.png'),
  '50': require('../assets/crests/50.png'),
  '51': require('../assets/crests/51.png'),
  '52': require('../assets/crests/52.png'),
  '53': require('../assets/crests/53.png'),
  '54': require('../assets/crests/54.png'),
  '55': require('../assets/crests/55.png'),
  '56': require('../assets/crests/56.png'),
  '57': require('../assets/crests/57.png'),
};

export default function Logo({ id, size = 40, style }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Image
        source={logos[id]}
        style={{
          width: size * 0.9,
          height: size * 0.9,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}