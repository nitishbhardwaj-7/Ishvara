import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type Props = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> & { src: string };

/**
 * <video> that plays Bunny Stream HLS playlists. Prefers hls.js (Media Source Extensions) because
 * several Chromium builds report canPlayType('…mpegurl') as "maybe" yet fail to play; native HLS
 * is only the fallback where MSE is missing. hls.js is code-split and bundled locally in the APK.
 */
export const HlsVideo = forwardRef<HTMLVideoElement, Props>(({ src, ...rest }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHls = /\.m3u8(\?|$)/i.test(src);
    if (!isHls) {
      video.src = src;
      return;
    }

    let cancelled = false;
    let destroy: (() => void) | undefined;
    import('hls.js').then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        video.src = src; // native HLS (e.g. iOS)
        return;
      }
      const hls = new Hls({ capLevelToPlayerSize: true, maxBufferLength: 20 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else hls.destroy();
      });
      destroy = () => hls.destroy();
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [src]);

  return <video ref={videoRef} {...rest} />;
});

HlsVideo.displayName = 'HlsVideo';
