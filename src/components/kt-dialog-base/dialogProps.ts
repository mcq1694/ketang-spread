import type { PropType } from 'vue';

export const dialoagProps = {
  /**
   * @description 动画类型 请参考https://animate.style/    默认animate_bounceIn
   * @default bounce
   */
  aniName: {
    type: String,
    default: 'animate_bounceIn',
  },
  /**
   * @description 弹窗主体的定位信息位于屏幕X轴的位置 默认center
   * @default center
   */
  fixedX: {
    type: String as PropType<'center' | 'top' | 'bottom' | 'left' | 'right'>,
    default: 'center',
  },
  /**
   * @description 弹窗主体的定位信息位于屏幕Y轴的位置 默认center
   * @default center
   */
  fixedY: {
    type: String as PropType<'center' | 'top' | 'bottom' | 'left' | 'right'>,
    default: 'center',
  },
  /**
   * @description 弹窗主体的定位信息的样式信息，优先级高于fixed 多个属性用,隔开
   * @default center
   */
  contentStyle: {
    type: String,
    default: '',
  },
  mask: {
    type: Boolean,
    default: true,
  },
};
