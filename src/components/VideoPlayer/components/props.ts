import type { PropType } from 'vue';

export const props = {
  src: {
    type: String,
    required: true,
  },
  /** 同一页面使用多个video 需要不同的id */
  videoId: {
    type: String,
    default: 'video-player',
  },
  /**
   * 视频资源类型
   * MP4 : video/mp4
   * Flv直播 : video/x-flv
   * 分片视频流 : application/x-mpegURL
   */
  type: {
    type: String as PropType<'video/mp4' | 'video/x-flv' | 'application/x-mpegURL'>,
    default: 'video/mp4',
  },
  /**
   * 宽度，设置number单位默认按rpx处理
   */
  width: {
    type: [String, Number],
    default: '100%',
  },
  /**
   * 高度，设置number单位默认按rpx处理
   */
  height: {
    type: [String, Number],
    default: '100%',
  },
  poster: {
    type: String,
    default: '',
  },
  direction: {
    type: Number as PropType<0 | -90 | 90>,
    default: 0,
  },
  controls: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  muted: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  fitMode: {
    type: String as PropType<'contain' | 'cover'>,
    default: 'contain',
  },
  /**
   * 视频播放速度控制
   * @param {Array} playbackRates = [0.5, 1, 1.25, 1.5, 2, 2.5]
   */
  playbackRates: {
    type: [Boolean, Array] as PropType<boolean | number[]>,
    default: true,
  },
};

export const rateArr = [0.5, 0.8, 1.0, 1.25, 1.5, 2.0];
