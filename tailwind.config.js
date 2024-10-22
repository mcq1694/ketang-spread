const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

// 循环创建spacingList
const spacing = {
  px: '1px',
  0: '0px',
};
const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

let i = 1;
while (i <= 750) {
  lineHeight[i] = spacing[i] = `${2 * i}rpx`;
  i += 1;
}

module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx,vue}',
    './node_modules/ui/**/*.{html,js,ts,jsx,tsx,vue}',
  ],
  theme: {
    spacing,
    lineHeight,
    fontSize: {
      16: ['16rpx', { lineHeight: '22rpx' }],
      20: ['20rpx', { lineHeight: '30rpx' }],
      mini: ['22rpx', { lineHeight: '32rpx' }],
      xs: ['24rpx', { lineHeight: '32rpx' }],
      '2xs': ['26rpx', { lineHeight: '40rpx' }],
      sm: ['28rpx', { lineHeight: '40rpx' }],
      md: ['30rpx', { lineHeight: '48rpx' }],
      base: ['32rpx', { lineHeight: '48rpx' }],
      bl: ['34rpx', { lineHeight: '50rpx' }],
      lg: ['36rpx', { lineHeight: '56rpx' }],
      38: ['38rpx', { lineHeight: '56rpx' }],
      xl: ['40rpx', { lineHeight: '56rpx' }],
      '2xl': ['48rpx', { lineHeight: '64rpx' }],
      '3xl': ['60rpx', { lineHeight: '72rpx' }],
      '4xl': ['72rpx', { lineHeight: '80rpx' }],
      '5xl': ['96rpx', { lineHeight: '1' }],
      '6xl': ['120rpx', { lineHeight: '1' }],
      '7xl': ['144rpx', { lineHeight: '1' }],
      '8xl': ['192rpx', { lineHeight: '1' }],
      '9xl': ['256rpx', { lineHeight: '1' }],
      68: ['68rpx', { lineHeight: '1' }],
      28: ['28rpx', { lineHeight: '1' }],
    },
    colors: {
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      gray: colors.zinc,
      neutral: colors.neutral,
      stone: colors.stone,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
    },
    extend: {
      zIndex: {
        top: 900,
      },
      colors: {
        primary: '#1448ff',
        danger: '#ff1313',
        orange: '#ff5a30',
        skeleton: '#d7d7da',
      },
      fontFamily: {
        'din-bold': ['din-bold'],
        'din-medium': ['din-medium'],
        'din-black': ['din-black'],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('./build/config/unocss'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.text-ellipsis': {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        },
      });
    }),
  ],
};
