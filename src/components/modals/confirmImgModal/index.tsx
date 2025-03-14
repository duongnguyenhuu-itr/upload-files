import CustomButton from '@/components/button';
import { Modal } from 'antd';
import classNames from 'classnames';
import './confirmImgModal.s.scss';
import styles from './style.module.scss';
import { IBaseProps } from '@/model/baseProps';

interface IProps extends IBaseProps {
  /** Visible of modal */
  open?: boolean;
  /** Width of modal */
  width?: number;
  /** Icon */
  icon?: JSX.Element;
  /** Title */
  title?: JSX.Element | string;
  /** Description */
  desc?: JSX.Element | string;
  /** Button text */
  buttonText?: string;
  /** Event close modal */
  onCancel?: () => void;
}

const ConfirmImgModal = (props: IProps): JSX.Element => {
  return (
    <Modal
      open={props.open}
      destroyOnClose
      width={props.width}
      footer={null}
      closable={false}
      maskClosable={false}
      keyboard={false}
      centered
      className={classNames(styles.confirmImgModal, props.className, 'confirm-img-modal')}
    >
      <div className={styles.confirmImgModalBody}>
        {props.icon}
        {props.title && <div className={styles.confirmImgModalTitle}>{props.title}</div>}
        <div>{props.desc}</div>
        <CustomButton className={styles.confirmImgModalBtn} onClick={props.onCancel}>
          {props.buttonText}
        </CustomButton>
      </div>
    </Modal>
  );
};

ConfirmImgModal.defaultProps = {
  buttonText: 'Cancel',
  width: 500,
};

export default ConfirmImgModal;
