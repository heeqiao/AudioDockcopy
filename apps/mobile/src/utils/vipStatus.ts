import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncWidgetMembership } from "../native/WidgetBridge";

export type VipStatusSnapshot = {
  isVip: boolean;
  vipData: any | null;
  updatedAt: number | null;
};

type RefreshVipStatusOptions = {
  setPlusToken?: (token: string) => Promise<unknown> | unknown;
  syncWidget?: boolean;
};

const VIP_STATUS_KEY = "plus_vip_status";
const VIP_DATA_KEY = "plus_vip_data";
const VIP_UPDATED_AT_KEY = "plus_vip_updated_at";

export const getCachedVipStatus = async (): Promise<VipStatusSnapshot> => {
  // [MODIFIED] 始终返回永久会员状态，无任何限制
  const vipData = { vipTier: "LIFETIME", vipExpiresAt: null };
  return {
    isVip: true,
    vipData,
    updatedAt: Date.now(),
  };
};

export const persistVipStatus = async (
  vipData: any | null,
  isVip?: boolean,
): Promise<VipStatusSnapshot> => {
  // [MODIFIED] 始终持久化为永久会员状态
  const resolvedVipData = vipData || { vipTier: "LIFETIME", vipExpiresAt: null };
  const resolvedIsVip = true;

  await AsyncStorage.setItem(VIP_STATUS_KEY, "true");
  await AsyncStorage.setItem(VIP_DATA_KEY, JSON.stringify(resolvedVipData));
  await AsyncStorage.setItem(VIP_UPDATED_AT_KEY, String(Date.now()));

  return {
    isVip: resolvedIsVip,
    vipData: resolvedVipData,
    updatedAt: Date.now(),
  };
};

export const refreshVipStatus = async (
  options: RefreshVipStatusOptions = {},
): Promise<VipStatusSnapshot> => {
  // [MODIFIED] 始终返回永久会员状态，不请求远程服务器
  const vipData = { vipTier: "LIFETIME", vipExpiresAt: null };
  const nextStatus = await persistVipStatus(vipData, true);

  if (options.syncWidget) {
    await syncWidgetMembership(true);
  }

  return nextStatus;
};
