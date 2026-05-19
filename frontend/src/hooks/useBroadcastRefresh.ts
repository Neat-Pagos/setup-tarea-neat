import { useEffect, useRef, useCallback } from 'react';

export function useBroadcastRefresh(channelName: string, onRefresh?: () => void) {
  const callbackRef = useRef(onRefresh);

  useEffect(() => {
    callbackRef.current = onRefresh;
  });

  useEffect(() => {
    if (!onRefresh) return;
    const channel = new BroadcastChannel(channelName);
    channel.onmessage = () => callbackRef.current?.();
    return () => channel.close();
  }, [channelName]);

  const broadcast = useCallback(() => {
    const channel = new BroadcastChannel(channelName);
    channel.postMessage('refresh');
    channel.close();
  }, [channelName]);

  return { broadcast };
}
