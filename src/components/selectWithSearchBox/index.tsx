import CustomSelect from '@/components/select';
import { SelectProps } from 'antd';
import { SelectValue } from 'antd/es/select';
import classNames from 'classnames';
import { useState } from 'react';
import './style.scss';
import { removeAccents } from '@/utils';
import Search from 'antd/es/input/Search';
import { t } from 'i18next';
import EmptyData from '@/components/emptyData';
import { IBaseProps } from '@/model/baseProps';

export type SelectWithSearchBoxOption = {
  label: string | number;
  value: string | number;
};

interface IProps<T extends SelectValue>
  extends Omit<SelectProps<T>, 'onChange'>,
    IBaseProps {
  /** Name of component */
  name: string;
  /** Search placeholder of component */
  searchPlaceholder?: string;
  /** Called when select an option or input value change */
  onChange?: (name: string, option: SelectWithSearchBoxOption) => void;
}

const SelectWithSearchBox = <T extends SelectValue>({
  children,
  ...props
}: IProps<T>) => {
  const { searchPlaceholder, ...rest } = props;
  const [search, setSearch] = useState<string>('');

  const filteredOptions = (props.options || []).filter((option) => {
    const normalizedOption = removeAccents(
      option?.search?.toString().toLowerCase() || '',
    );
    const normalizedSearch = removeAccents(search.toLowerCase());
    return normalizedOption.includes(normalizedSearch);
  });

  const handleChange = (name: string, option: SelectWithSearchBoxOption) => {
    props.onChange?.(props.name, option);
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <CustomSelect
      className={classNames('select-with-search-box', props.className)}
      dropdownRender={(menu) => (
        <>
          <Search
            className='select-with-search-box-search'
            name='search'
            value={search}
            placeholder={searchPlaceholder}
            allowClear
            onChange={onSearchChange}
          />
          {menu}
        </>
      )}
      {...rest}
      options={filteredOptions}
      onChange={handleChange}
      notFoundContent={<EmptyData content={t('noData')} />}
    >
      {children}
    </CustomSelect>
  );
};

SelectWithSearchBox.defaultProps = {
  searchPlaceholder: 'Search',
};

export default SelectWithSearchBox;
