import { CustomButton } from '@/components/button';
import { CustomerServiceIcon } from '@/static/svg';
import { Modal } from 'antd';
import Link from 'antd/es/typography/Link';
import { t } from 'i18next';
import './contactSupportModal.s.scss';

interface IVerifyEmailModal {
  open: boolean;
  onCancel: () => void;
}

const ContactSupportModal = (props: IVerifyEmailModal) => {
  return (
    <Modal
      maskClosable={false}
      closable={false}
      open={props.open}
      destroyOnClose
      onCancel={props.onCancel}
      className='contact-support-modal'
      centered
      footer={
        <div className='contact-support-modal__footer'>
          <CustomButton onClick={props.onCancel}>{t('understood')}</CustomButton>
        </div>
      }
    >
      <div className='contact-support-modal__content'>
        <img src={CustomerServiceIcon} alt='' />
        <p className='contact-support-modal-title'>{t('supportContact')}</p>
        <div className='contact-support-modal-desc-wrapper'>
          <p className='contact-support-modal-desc'>{t('pleaseContact')}</p>
          <p className='contact-support-modal-info'>
            Email:
            <Link href='mailto:cs@octomed.vn'>&nbsp;cs@octomed.vn</Link>
          </p>
          <p className='contact-support-modal-info'>
            {t('phone')}:<Link href='tel:+842873099928'>&nbsp;(+84) 287 309 9928</Link>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ContactSupportModal;
