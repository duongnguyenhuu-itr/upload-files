import { Select, SelectProps } from 'antd';
import { SelectValue } from 'antd/es/select';
import classNames from 'classnames';
import ErrorMessage from '../errorMessage';
import InputTitle from '../inputTitle';
import styles from './style.module.scss';
import './style.scss';
import { useEffect } from 'react';
import { IBaseProps } from '@/model/baseProps';

export type SelectOption = {
  label: string | number;
  value: string | number;
};

interface IProps<T extends SelectValue>
  extends Omit<SelectProps<T>, 'onChange'>,
    IBaseProps {
  /** Title of component */
  title?: string;
  /** Subtitle of component */
  subTitle?: string;
  /** Empty placeholder of component */
  emptyPlaceholder?: string;
  /** Whether the select is required */
  isRequired?: boolean;
  /** Name of component */
  name: string;
  /** Error message */
  errorMessage?: string;
  /** Called when select an option or input value change */
  onChange?: (name: string, option: SelectOption) => void;
}

const CustomSelect = <T extends SelectValue>({ children, ...props }: IProps<T>) => {
  const { emptyPlaceholder, subTitle, errorMessage, isRequired, ...rest } = props;
  const handleChange = (value: T, option: SelectOption) => {
    props.onChange?.(props.name, option);
  };

  useEffect(() => {
    if (emptyPlaceholder && props.name) {
      setTimeout(() => {
        const select = document.querySelector(`.custom-select-${props.name}`);
        if (select) {
          const emptyText = select.querySelector('.ant-empty-description');
          if (emptyText) {
            emptyText.textContent = emptyPlaceholder as string;
          }
        }
      }, 1000);
    }
  }, [emptyPlaceholder, props.name, props.options]);

  return (
    <div
      className={classNames(
        styles.customSelectWrapper,
        'custom-select',
        `custom-select-${props.name}`,
        props.className,
      )}
    >
      <InputTitle title={props.title} isRequired={isRequired} subTitle={subTitle} />
      <Select<T>
        className={classNames(
          styles.customSelect,
          'custom-select',
          props.status === 'error' ? 'custom-error' : '',
          props.className,
        )}
        filterOption={(input, option) =>
          option
            ? option.label.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
            : true
        }
        getPopupContainer={(triggerNode) => triggerNode}
        {...rest}
        onChange={handleChange}
      >
        {children}
      </Select>
      {errorMessage && <ErrorMessage errorMessage={errorMessage} hasIcon />}
    </div>
  );
};

CustomSelect.defaultProps = {};

export default CustomSelect;
