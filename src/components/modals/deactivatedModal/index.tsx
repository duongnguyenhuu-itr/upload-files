import ConfirmImgModal from '@/components/modals/confirmImgModal';
import { Typography } from 'antd';
import { FC } from 'react';
import './deactivatedModal.s.scss';
import { t } from 'i18next';
import { NotFoundIcon } from '@/static/svg';

interface IProps {
  open: boolean;
  onCancel: () => void;
}

const DeactivatedModal: FC<IProps> = (props) => {
  return (
    <ConfirmImgModal
      width={448}
      open={props.open}
      icon={<img src={NotFoundIcon} alt='icon' />}
      title={t('accountDeactivated')}
      className='deactivated-modal'
      desc={
        <p className='deactivated-modal__content'>
          {t('yourAccountDeactivated')}.
          <br />
          {t('pleaseContactCompany')}
          <br />
          {t('throughEmail')}{' '}
          <Typography.Link href={`mailto:${t('supportEmail')}`}>
            {t('supportEmail')}
          </Typography.Link>{' '}
          {t('moreInfo')}.
        </p>
      }
      onCancel={props.onCancel}
      buttonText={t('understood')}
    />
  );
};

DeactivatedModal.propTypes = {};

export default DeactivatedModal;
