import {
  CloseGreyBaseIcon,
  ToastErrorIcon,
  ToastSuccessIcon,
  ToastWarningIcon,
} from '@/static/svg';
import { notification } from 'antd';
import { ReactNode } from 'react';

type PlacementProp = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

const notificationStyle = {
  padding: '0.5625rem 1.25rem 0.5625rem 0.75rem',
  fontWeight: '400',
  color: '#2F3845',
  fontSize: '0.875rem',
  maxWidth: '23rem',
};

export const toastError = (
  message: ReactNode = '',
  isMessage = true,
  description: ReactNode = undefined,
  placement: PlacementProp = 'bottomLeft',
  duration = 3,
) => {
  notification.error({
    message,
    description,
    placement,
    duration,
    style: isMessage ? notificationStyle : {},
    closeIcon: isMessage ? null : (
      <img src={CloseGreyBaseIcon} alt='' width={24} height={24} />
    ),
    icon: <img src={ToastErrorIcon} alt='' width={24} height={24} />,
  });
};

export const toastWarning = (
  message: ReactNode = '',
  isMessage = true,
  description: ReactNode = undefined,
  placement: PlacementProp = 'bottomLeft',
  duration = 3,
) => {
  notification.warning({
    message,
    description,
    placement,
    duration,
    style: isMessage ? notificationStyle : {},
    closeIcon: isMessage ? null : (
      <img src={CloseGreyBaseIcon} alt='' width={24} height={24} />
    ),
    icon: <img src={ToastWarningIcon} alt='' width={24} height={24} />,
  });
};

export const toastSuccess = (
  message: ReactNode = '',
  isMessage = true,
  description: ReactNode = undefined,
  placement: PlacementProp = 'bottomLeft',
  duration = 3,
) => {
  notification.success({
    message,
    description,
    placement,
    duration,
    style: isMessage ? notificationStyle : {},
    closeIcon: isMessage ? null : (
      <img src={CloseGreyBaseIcon} alt='' width={24} height={24} />
    ),
    icon: <img src={ToastSuccessIcon} alt='' width={24} height={24} />,
  });
};

export const toastInfo = (
  message: ReactNode = '',
  isMessage = true,
  icon: ReactNode = null,
  description: ReactNode = undefined,
  placement: PlacementProp = 'bottomLeft',
  duration = 3,
) => {
  notification.open({
    message,
    description,
    placement,
    duration,
    style: isMessage ? notificationStyle : {},
    closeIcon: isMessage ? null : (
      <img src={CloseGreyBaseIcon} alt='' width={24} height={24} />
    ),
    icon,
  });
};
