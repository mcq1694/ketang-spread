<!--
* @description  基于video.js的视频播放组件，目前仅供H5平台使用
* @fileName  kt-video-player
* @author machuanqi
* @date 2023-02-23 10:09:02
-->
<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, unref, watch } from 'vue';
  import VideoJs from 'video.js';
  // import 'video.js/dist/video-js.min.css'; //已改用CDN引入
  import { isArray } from 'lodash';
  import { addUnit } from '/@/utils';
  import { props as comProps } from './props';

  const props = defineProps(comProps);

  const emits = defineEmits({
    play: () => true,
    pause: () => true,
    error: (_e) => true,
    ended: () => true,
    loadedmetadata: (_e: { detail: { duration: number } }) => true,
    durationchange: (_e: { detail: { duration: number } }) => true,
    ratechange: (rate: number) => true,
  });

  const Player = ref<ReturnType<typeof VideoJs>>();
  const isLive = computed(() => props.type === 'video/x-flv');

  onMounted(() => {
    const elWrapper = document.querySelector('#video-player-container')!;
    elWrapper.innerHTML = `<video class="video-js" id="${props.videoId}" style="width: ${addUnit(
      props.width,
      'rpx',
    )};height: ${addUnit(props.height, 'rpx')};" controls playsinline webkit-playsinlin>
  <source src="${props.src}" type="${props.type}" >
</video>`;
    // 控速配置
    const playbackRates = isArray(props.playbackRates)
      ? props.playbackRates
      : props.playbackRates
      ? [0.5, 1, 1.25, 1.5, 2, 2.5]
      : [];

    Player.value = VideoJs(
      props.videoId,
      {
        playbackRates,
        playbackRate: 1,
        width: addUnit(props.width, 'rpx'),
        height: addUnit(props.height, 'rpx'),
        language: 'zh-CN',
        muted: props.muted,
        controls: props.controls,
        // autoplay: props.autoplay,
        loop: props.loop,
        controlBar: {
          children: [
            { name: 'playToggle' },
            {
              name: 'volumePanel',
              inline: false,
            },
            { name: 'currentTimeDisplay' },
            { name: 'durationDisplay' },
            { name: 'timeDivider' },
            { name: 'progressControl' },
            { name: 'remainingTimeDisplay' },
            ...(unref(isLive) ? [{ name: 'LiveDisplay' }] : [{ name: 'playbackRateMenuButton' }]),
            { name: 'fullscreenToggle' },
          ],
        },
        userActions: {
          click: true,
          doubleClick: true,
        },
      },
      () => {
        const instance = unref(Player);
        instance?.poster(props.poster);
        if (props.autoplay) {
          instance?.play();
        }
      },
    );

    const instance = unref(Player);
    if (instance) {
      // @ts-expect-error
      instance.on('play', function () {
        // 开始播放
        emits('play');
      });
      // @ts-expect-error
      instance.on('pause', function () {
        // 暂停
        emits('pause');
      });
      // @ts-expect-error
      instance.on('loadedmetadata', function () {
        // 成功获取资源长度
        emits('loadedmetadata', { detail: { duration: instance.duration() } });
      });
      // @ts-expect-error
      instance.on('ended', function () {
        // 播放结束
        emits('ended');
      });
      // @ts-expect-error
      instance.on('durationchange', function () {
        // 资源长度改变
        emits('durationchange', { detail: { duration: instance.duration() } });
      });
      // @ts-expect-error
      instance.on('error', (err) => {
        emits('error', err);
      });
      instance.on('ratechange', () => {
        emits('ratechange', instance.playbackRate());
      });
    }
  });

  function seek(currentTime: number) {
    const instance = unref(Player);
    instance?.currentTime(currentTime);
  }

  onUnmounted(() => {
    unref(Player)?.dispose();
  });

  watch(
    () => props.src,
    (value) => {
      const instance = unref(Player);
      instance?.src([{ src: value, type: props.type }]);
      if (props.poster) {
        instance?.poster(props.poster);
      }
      if (props.autoplay) {
        instance?.play();
      }
    },
  );
  defineExpose({
    Player,
    seek,
  });
</script>

<template>
  <view id="video-player-container" class="w-full h-full" />
</template>
