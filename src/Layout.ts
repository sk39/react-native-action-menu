import {Dimensions} from 'react-native';
const _window = Dimensions.get('window');
const width = _window.width;
const height = _window.height;

export default {
  window: {
    width,
    height,
  },
};
