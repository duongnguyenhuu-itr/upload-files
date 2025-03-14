/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import errorIcon from './errorMessageIcon.svg';
import closeIcon from './close-grey-light.svg';
import style from './style.module.scss';

interface IProps {
  /** The error message for the Input */
  errorMessage?: string;
  /** Whether has error icon */
  hasIcon?: boolean;
  /** Whether has close button */
  isCloseButton?: boolean;
  /** The icon of error mess */
  icon?: string;
  /** Whether has  error mess background */
  hasBackground?: boolean;
  /** Event click close button */
  onClick?: (e: any) => void;
  className?: string;
}

const ErrorMessage = (props: IProps): JSX.Element => {
  return (
    <div
      className={classNames(
        style.errorMessageWrapper,
        props.hasBackground ? style.hasBackgroundError : '',
        props.className,
      )}
    >
      {props.hasIcon && (
        <div className={style.errorMessageIconWrapper}>
          <img
            width={16}
            height={20}
            className={classNames(style.errorMessageIcon)}
            alt=''
            src={props.icon || errorIcon}
          />
        </div>
      )}
      <p className={style.errorMessageText}>{props.errorMessage}</p>
      {props.isCloseButton && (
        <div className={style.errorMessageButton} onClick={props.onClick} aria-hidden>
          <img width={14} height={14} alt='' src={closeIcon} />
        </div>
      )}
    </div>
  );
};

ErrorMessage.defaultProps = {
  isCloseButton: false,
};

export default ErrorMessage;
