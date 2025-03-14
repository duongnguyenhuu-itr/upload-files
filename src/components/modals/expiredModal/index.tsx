import ConfirmImgModal from '@/components/modals/confirmImgModal';
import { WarningSignIcon } from '@/static/svg';
import { t } from 'i18next';
import { FC } from 'react';
import './expiredModal.s.scss';

interface IProps {
  open: boolean;
  onCancel: () => void;
}

const ExpiredModal: FC<IProps> = (props) => {
  return (
    <ConfirmImgModal
      width={448}
      open={props.open}
      icon={<img src={WarningSignIcon} alt='icon' />}
      title={t('sessionExpired')}
      className='expired-modal'
      desc={
        <p className='expired-modal__content'>
          {t('yourSessionExpired')}.
          <br />
          {t('pleaseLoginAgain')}
        </p>
      }
      onCancel={props.onCancel}
      buttonText={t('loginAgain')}
    />
  );
};

ExpiredModal.propTypes = {};

export default ExpiredModal;
