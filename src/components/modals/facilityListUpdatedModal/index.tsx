import ConfirmImgModal from '@/components/modals/confirmImgModal';
import { HospitalIcon } from '@/static/svg';
import { t } from 'i18next';
import { FC } from 'react';
import './facilityListUpdatedModal.s.scss';

interface IProps {
  open: boolean;
  onCancel: () => void;
}

const FacilityListUpdatedModal: FC<IProps> = (props) => {
  return (
    <ConfirmImgModal
      width={448}
      open={props.open}
      icon={<img src={HospitalIcon} alt='icon' />}
      title={t('facilityListUpdated')}
      className='facility-list-updated-modal'
      desc={
        <p className='facility-list-updated-modal__content'>
          {t('yourFacilityListUpdated')}.
          <br />
          {t('pleaseReload')}.
        </p>
      }
      onCancel={props.onCancel}
      buttonText={t('understood')}
    />
  );
};

export default FacilityListUpdatedModal;
