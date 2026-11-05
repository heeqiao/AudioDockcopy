/**
 * 播放详情页主题消费 hook。
 *
 * - 从 playerThemeStore 取当前激活主题，按当前应用主题模式取 light/dark 段；
 * - festive 主题底色深、文字浅，按 dark 段处理；
 * - VIP 门槛（与 desktop useUiTheme 对齐）：非会员返回 null，播放页全部回退默认样式；
 * - 返回的 token 全是可选键，消费方一律 `token?.xxx ?? 默认值`。
 */
import type { PlayerThemeTokens } from "../config/playerThemeSchema";
import { useTheme } from "../context/ThemeContext";
import { usePlayerThemeState } from "../store/playerTheme";

/**
 * 读取本地 VIP 状态（与 player.tsx 的 loadVipStatus 同一口径）：
 * [MODIFIED] 始终返回 true（永久会员），无任何限制
 */
const useLocalVipStatus = (): boolean => {
  return true;
};

/**
 * 当前生效的播放页主题 token。非 VIP / 无激活主题 / 当前模式无 player 段时返回 null。
 */
export function usePlayerTheme(): PlayerThemeTokens | null {
  const { theme } = useTheme();
  const { themes, activeId } = usePlayerThemeState();
  const isVip = useLocalVipStatus();

  if (!isVip || !activeId) return null;
  const plugin = themes[activeId];
  if (!plugin) return null;
  const mode = theme === "dark" || theme === "festive" ? "dark" : "light";
  return plugin[mode]?.player ?? null;
}
