import classNames from 'classnames';
import style from './style.module.scss';

interface IProps {
  /** The title for the Input */
  title?: string;
  /** Whether the input is required */
  isRequired?: boolean;
  className?: string;
  subTitle?: string;
}

const InputTitle = (props: IProps): JSX.Element => {
  return (
    <>
      {props.title && (
        <div
          className={classNames(
            'input-title-wrapper',
            style.inputTitleWrapper,
            props.className,
          )}
        >
          {props.isRequired && <div className={style.requiredIcon}>*</div>}
          <p>{props.title}</p>
          {Boolean(props.subTitle) && <p className={style.subTitle}>{props.subTitle}</p>}
        </div>
      )}
    </>
  );
};

InputTitle.defaultProps = {};

export default InputTitle;
