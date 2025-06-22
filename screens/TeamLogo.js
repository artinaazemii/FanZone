import React from 'react';
import { Image } from 'react-native';
import { SvgUri } from 'react-native-svg';

const TeamLogo = ({ uri, size = 40, style }) => {
  const isSvg = uri.toLowerCase().includes('.svg');
  if (isSvg) {
    return <SvgUri uri={uri} width={size} height={size} style={style} />;
  }
  return <Image source={{ uri }} style={[{ width: size, height: size }, style]} />;
};

export default TeamLogo;
