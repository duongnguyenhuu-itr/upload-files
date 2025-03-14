import { IBaseProps } from '@/components/coreComponents/coreInterface/baseProps';
import EmptyDataIcon from '../../static/svg/empty-data-icon.svg';
import './emptyData.s.scss';
import { t } from 'i18next';
import classNames from 'classnames';

interface IProps extends IBaseProps {
  /** Empty content */
  content?: string;
  /** Class */
  className?: string;
}

const EmptyData = (props: IProps): JSX.Element => {
  return (
    <div className={classNames('empty-data', props.className)}>
      <img
        className='empty-data-icon'
        src={EmptyDataIcon}
        alt=''
        width={64}
        height={40}
      />
      <div className='empty-data-text'>{props.content}</div>
    </div>
  );
};

EmptyData.defaultProps = {
  content: t('noData'),
};

export default EmptyData;
