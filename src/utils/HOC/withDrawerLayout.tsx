import { IPropsDrawerLayout } from '@/model/hoc';
import { Drawer } from 'antd';
import classNames from 'classnames';
import React, { ComponentType, useEffect, useState } from 'react';
import styles from './style.module.scss';

const withDrawerLayout = <P extends IPropsDrawerLayout>(
  ChildrenComponent: ComponentType<P>,
) => {
  const WithDrawerLayout: React.FC<P> = (props) => {
    const { destroyOnClose = false, maskClosable = false, keyboard = false } = props;

    const [open, setOpen] = useState(false);

    // this state use for close drawer middleware
    const [close, setClose] = useState(false);

    useEffect(() => {
      setOpen(props.open);
    }, [props.open]);

    const handleClose = () => {
      setClose(true);
    };

    const onResetClose = () => {
      setClose(false);
    };

    const onClose = () => {
      setOpen(false);
      setTimeout(() => {
        props.onCancel();
      }, 200); // Set the delay to the Drawer's animation duration (200ms by default in Ant Design)
    };

    useEffect(() => {
      if (!open) {
        setClose(false);
      }
    }, [open]);

    return (
      <Drawer
        open={open}
        destroyOnClose={destroyOnClose}
        maskClosable={maskClosable}
        keyboard={keyboard}
        closable={false}
        width={props.width}
        className={classNames(
          styles.drawerLayout,
          props.loading ? styles.drawerLayoutLoading : '',
          props.className,
        )}
        onClose={handleClose}
      >
        <ChildrenComponent
          {...{ ...props, close, onResetClose: onResetClose, onCancel: onClose }}
        />
      </Drawer>
    );
  };

  return WithDrawerLayout;
};

export default withDrawerLayout;
