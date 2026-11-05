import { Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MiniPlayer from '../../../components/MiniPlayer';
import './index.scss';

export default function MemberPaymentSuccess() {
  const { t } = useTranslation();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(true);

  const tradeNo = router.params.tradeNo || '';
  const paidAtRaw = router.params.paidAt || '';

  const paidAt = useMemo(() => {
    if (!paidAtRaw) return '';
    const date = new Date(paidAtRaw);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (v: number) => String(v).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }, [paidAtRaw]);

  useEffect(() => {
    const refreshVipStatus = async () => {
      // [MODIFIED] 始终为永久会员
      Taro.setStorageSync('plus_vip_status', 'true');
      Taro.setStorageSync('plus_vip_data', JSON.stringify({ vipTier: 'LIFETIME', vipExpiresAt: null }));
      Taro.setStorageSync('plus_vip_updated_at', Date.now().toString());
      setRefreshing(false);
    };

    refreshVipStatus();
  }, []);

  return (
    <View className='payment-success-container'>
      <View className='card'>
        <Text className='success-icon'>✓</Text>
        <Text className='success-text'>{t('memberSuccess.paymentSuccess')}</Text>

        <View className='info-block'>
          <Text className='info-label'>{t('memberSuccess.paymentDate')}</Text>
          <Text className='info-value'>{paidAt || '-'}</Text>
        </View>

        <View className='info-block'>
          <Text className='info-label'>{t('memberSuccess.transactionId')}</Text>
          <Text className='info-value'>{tradeNo || '-'}</Text>
        </View>

        {refreshing && (
          <View className='refresh-row'>
            <Text className='refresh-text'>{t('memberSuccess.syncingMemberStatus')}</Text>
          </View>
        )}

        <View
          className='primary-button'
          onClick={() => Taro.redirectTo({ url: '/pages/member/detail/index' })}
        >
          <Text className='primary-button-text'>{t('member.detailTitle')}</Text>
        </View>
      </View>

      <MiniPlayer />
    </View>
  );
}
