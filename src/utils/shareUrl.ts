import LZString from 'lz-string';
import type { AppState } from '../store/useAppStore';

// AppState → URL-safe 압축 string
export const encodeShareState = (s: AppState): string => {
  return LZString.compressToEncodedURIComponent(JSON.stringify(s));
};

export const decodeShareState = (str: string): Partial<AppState> | null => {
  try {
    const json = LZString.decompressFromEncodedURIComponent(str);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const buildShareUrl = (s: AppState, baseUrl?: string): string => {
  const base = baseUrl ?? window.location.origin + window.location.pathname.replace(/\/$/, '');
  return `${base}/result?r=${encodeShareState(s)}`;
};

// 클립보드 복사 (모던 + 폴백)
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch { return false; }
  }
};

// 카카오톡 공유 URL (간이 - 실제 앱키 발급 필요)
export const kakaoShareUrl = (text: string, link: string) => {
  // 카카오 SDK 미연동 시 단순 카카오톡 모바일 공유 스킴
  return `https://accounts.kakao.com/weblogin/account/info`;  // placeholder
};
