export interface IPropsDrawerLayout {
  open?: boolean;
  className?: string;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  destroyOnClose?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  width?: number;
  // use for close drawer middleware
  close?: boolean;
  onResetClose?: () => void;
}
