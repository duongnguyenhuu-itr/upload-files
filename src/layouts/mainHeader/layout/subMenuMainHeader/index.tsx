import CustomAvatar from '@/components/avatar';
import { CustomButton } from '@/components/button';
import { Auth } from 'aws-amplify';
import classnames from 'classnames';
import './subMenuMainHeader.s.scss';
import useBoundStore from '@/store';
import { formatDisplayRole, getFullName } from '@/utils';
import { Divider, Typography } from 'antd';
import { t } from 'i18next';

const {
  VITE_BIOCARE_PORTAL_URL,
  VITE_BIOCARE_DIAGNOSTICS_PORTAL_URL,
  VITE_AWS_DOMAIN,
  VITE_AWS_USER_POOLS_WEB_CLIENT_ID,
} = import.meta.env;

const LINKS = [
  {
    key: 'octoDxPortal',
    name: t('octoDxPortal'),
    icon: <i className='ri-heart-pulse-line' />,
    url: VITE_BIOCARE_DIAGNOSTICS_PORTAL_URL,
  },
  {
    key: 'octoSuiteHomepage',
    name: t('octoSuiteHomepage'),
    icon: <i className='ri-home-6-line' />,
    url: VITE_BIOCARE_PORTAL_URL,
  },
];

const SubMenu = (): JSX.Element => {
  const me = useBoundStore((state) => state.me);
  const fullName = getFullName({ firstName: me.firstName, lastName: me.lastName });
  const onMenuItemClick = (url: string) => () => {
    window.open(url, '_blank');
  };

  const onSignOutClick = async () => {
    try {
      localStorage.clear();
      await Auth.signOut();
      const urlRedirect = `${VITE_AWS_DOMAIN}/logout?client_id=${VITE_AWS_USER_POOLS_WEB_CLIENT_ID}&logout_uri=${VITE_BIOCARE_PORTAL_URL}`;
      window.location.href = urlRedirect;
    } catch (error) {
      console.error('Failed to sign out: ', error);
    }
  };

  return (
    <div className='sub-menu'>
      <div className='sub-menu-user'>
        <CustomAvatar
          firstName={me.firstName || ''}
          lastName={me.lastName || ''}
          avatarLink={me.photo || ''}
          size={24}
        />
        <div className='sub-menu-user-info'>
          <Typography.Text
            style={{ maxWidth: 162 }}
            ellipsis={{ tooltip: fullName }}
            className='sub-menu-user-name'
          >
            {fullName}
          </Typography.Text>
          <div className='sub-menu-user-role'>
            {me.roles?.map(formatDisplayRole).join(', ') || '--'}
          </div>
        </div>
      </div>
      <Divider type='horizontal' />
      <div className='sub-menu-content'>
        {LINKS.map((item) => (
          <CustomButton
            className='sub-menu-content-item'
            type='link'
            key={item.key}
            icon={item.icon}
            onClick={onMenuItemClick(item.url)}
          >
            {item.name}
          </CustomButton>
        ))}
        <Divider type='horizontal' />
        <CustomButton
          className={classnames('sub-menu-content-item', 'logout-btn')}
          type='link'
          icon={<i className='ri-logout-circle-r-line' />}
          onClick={onSignOutClick}
        >
          {t('signOut')}
        </CustomButton>
      </div>
    </div>
  );
};

export default SubMenu;
