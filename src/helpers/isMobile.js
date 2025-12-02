export default function detectMobileOS() {
  const ua = navigator.userAgent;

  const isIOS = /iPad|iPhone|iPod/.test(ua)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isAndroid = /Android/.test(ua);

  return isIOS || isAndroid;
}

