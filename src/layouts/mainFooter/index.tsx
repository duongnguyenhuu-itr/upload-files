import CustomButton from '@/components/button';
import ContactSupportModal from '@/components/modals/contactSupportModal';
import { t } from 'i18next';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import packageJson from '../../../package.json';
import './mainFooter.s.scss';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { IBaseProps } from '@/model/baseProps';

const MainFooter = (props: IBaseProps): JSX.Element => {
  const [isOpenContactSupportModal, setIsOpenContactSupportModal] = useState(false);
  return (
    <div className={classNames('main-footer', props.className)}>
      <span>{`© ${dayjs().format('YYYY')} Octomed Co. Ltd. All rights reserved. (v${
        packageJson.version
      }.${packageJson.buildNumber})`}</span>
      <div className='main-footer-more-info'>
        <CustomButton
          className='main-footer-more-info-btn'
          type='link'
          onClick={() => {
            setIsOpenContactSupportModal(true);
          }}
        >
          {t('supportContact')}
        </CustomButton>
        <Link
          target='_blank'
          to={'https://public.cdn.octomed.vn/octomed/alpha/term-of-use.html'}
        >
          {t('term')}
        </Link>
        <Link
          target='_blank'
          to={'https://public.cdn.octomed.vn/Octo360/Octo360_Privacy_V2.html'}
        >
          {t('policy')}
        </Link>
      </div>
      <ContactSupportModal
        open={isOpenContactSupportModal}
        onCancel={() => {
          setIsOpenContactSupportModal(false);
        }}
      />
    </div>
  );
};

export default MainFooter;
