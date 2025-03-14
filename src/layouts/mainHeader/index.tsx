import Logo from '@/assets/logo-white.svg';
import CustomAvatar from '@/components/avatar';
import useBoundStore from '@/store';
import { Dropdown } from 'antd';
import SubMenuMainHeader from './layout/subMenuMainHeader';
import './mainHeader.s.scss';

const MainHeader: React.FC = () => {
  const me = useBoundStore((state) => state.me);

  return (
    <div className='main-header'>
      <div className='main-header-lef-side'>
        <img className='main-header-logo' src={Logo} alt='logo' />
      </div>
      <div className='main-header-right'>
        <Dropdown
          dropdownRender={() => <SubMenuMainHeader />}
          trigger={['click']}
          placement='bottomRight'
          getPopupContainer={(trigger) => trigger}
        >
          <div className='main-header-user'>
            <CustomAvatar
              className='main-header-avatar'
              firstName={me.firstName || ''}
              lastName={me.lastName || ''}
              size={32}
              avatarLink={me.photo || ''}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default MainHeader;
