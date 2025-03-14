import fetchMe from '@/apollo/functions/fetchMe';
import ExpiredModal from '@/components/modals/expiredModal';
import FacilityListUpdatedModal from '@/components/modals/facilityListUpdatedModal';
import SocketIOComponent from '@/components/socketIOComponent';
import { AppFlowActions } from '@/constants';
import MainLayout from '@/layouts/mainLayout';
import { handleSignOut } from '@/layouts/mainLayout/mainLayout.h';
import { IUserUpdated } from '@/model/messageSocket';
import useBoundStore from '@/store';
import { useEmitter, useSetState } from '@/utils/customHook';
import appLocalStorage from '@/utils/localStorage';
import staticSocket from '@/utils/socketIo';
import { message } from 'antd';
import { Auth, Hub } from 'aws-amplify';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
const { VITE_BIOCARE_PORTAL_URL } = import.meta.env;

interface IState {
  isLoadedData: boolean;
  isLoginBiocare: boolean;
  isOpenExpiredModal: boolean;
}

const AuthenticationGate = ({ children }: { children: JSX.Element }) => {
  const me = useBoundStore((state) => state.me);
  const isLogin = useBoundStore((state) => state.authentication.isLogin);
  const setAuthentication = useBoundStore((state) => state.setAuthentication);
  const setLoading = useBoundStore((state) => state.setLoading);
  const setMe = useBoundStore((state) => state.setMe);

  const shouldCallLogoutWhenExpireToken = useRef(false);

  const [state, setState] = useSetState<IState>({
    isLoadedData: false,
    isLoginBiocare: false,
    isOpenExpiredModal: false,
  });

  const handleLogin = async () => {
    try {
      const meData = await fetchMe();
      setMe(meData);
      setAuthentication(true);
    } catch (error) {
      if (error.networkError) {
        return;
      }
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckLoginStatus = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      appLocalStorage.setLoginBiocare(true);
      setState({ isLoginBiocare: true });
    } catch (error) {
      console.error('Failed to get current authenticated user: ', error);
      if (window.location.hostname === 'localhost') {
        Auth.federatedSignIn({ customProvider: 'Clinic' });
      } else {
        window.location.href = VITE_BIOCARE_PORTAL_URL;
      }
      return;
    }
    handleLogin();
  };

  const listenLocalLogin = () => {
    Hub.listen('auth', ({ payload: { event } }) => {
      switch (event) {
        case 'signIn':
          break;
        case 'cognitoHostedUI':
          handleCheckLoginStatus();
          break;
        default:
          break;
      }
    });
  };

  const onClickExpiredModal = () => {
    if (shouldCallLogoutWhenExpireToken.current) {
      handleSignOut();
      return;
    }
    window.location.reload();
  };

  useEmitter(AppFlowActions.EXPIRE_TOKEN, (shouldLogout = false) => {
    if (shouldLogout) {
      shouldCallLogoutWhenExpireToken.current = true;
    }
    setState({ isOpenExpiredModal: true });
  });

  useEmitter(
    AppFlowActions.USER_UPDATED,
    (message: IUserUpdated) => {
      if (message.id !== me._id) {
        return;
      }
      // deactivated user
      if (message.isDisabled) {
        return;
      }
    },
    [me],
  );

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      listenLocalLogin();
    }
  }, []);

  useEffect(() => {
    handleCheckLoginStatus();
  }, []);

  return isLogin ? (
    <>
      <ExpiredModal open={state.isOpenExpiredModal} onCancel={onClickExpiredModal} />
      <MainLayout>{children}</MainLayout>
      {me.id && <SocketIOComponent />}
    </>
  ) : null;
};

export default AuthenticationGate;
