import { Avatar } from 'antd';
import classnames from 'classnames';
import { SyntheticEvent, useState } from 'react';
import { getBackgroundAvatar, getFirstLetterName } from './helper';
import style from './style.module.scss';

interface IProps {
  /** First name of avatar */
  firstName: string;
  /** Last name of avatar */
  lastName: string;
  /** Size of avatar */
  size: 16 | 24 | 32 | 28 | 40 | 48 | 56 | 64 | 72 | 80 | 88 | 96 | 100;
  /** The address of the image or base64 format for an image avatar (highest priority) */
  avatarLink?: string;
  /** Class name */
  className?: string;
  /** Show border */
  isBorder?: boolean;
}

const CustomAvatar = (props: IProps) => {
  const [error, setError] = useState<boolean>(false);
  const bgClassName = getBackgroundAvatar(props.firstName);

  const onError = (e: SyntheticEvent<HTMLDivElement>) => {
    if (e.type === 'error') {
      setError(true);
    }
  };

  return (
    <div className={classnames(style.customAvatarWrapper, props.className)}>
      {props.avatarLink && !error ? (
        <img
          className={classnames(
            style.customAvatar,
            style.linkAvatar,
            style[`size-${props.size}`],
            props.isBorder ? style.border : '',
          )}
          src={props.avatarLink || ''}
          alt='Avatar'
          onError={onError}
        />
      ) : (
        <Avatar
          className={classnames(
            style.customAvatar,
            props.isBorder ? style.border : '',
            style[`size-${props.size}`],
            style[`${bgClassName}`],
          )}
        >
          {getFirstLetterName(props.firstName, props.lastName)}
        </Avatar>
      )}
    </div>
  );
};

CustomAvatar.defaultProps = {
  size: 32,
};

CustomAvatar.propTypes = {};

export default CustomAvatar;
