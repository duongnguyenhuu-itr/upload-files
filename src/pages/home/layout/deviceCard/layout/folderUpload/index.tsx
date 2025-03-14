import { toastError } from '@/utils/toastNotification';
import './folderUpload.s.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { t } from 'i18next';

interface FolderUploadProps {
  onFolderUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowFolders: string[];
  loading?: boolean;
}

const FolderUpload: React.FC<FolderUploadProps> = (props) => {
  const allowFolders = props.allowFolders || [];
  const onFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files = [] } = e.target;
    if (files && files.length > 0) {
      const folderName = files[0].webkitRelativePath.split('/')[0];
      if (allowFolders.length > 0 && !allowFolders.includes(folderName)) {
        toastError(
          allowFolders.length === 1
            ? `Please select a folder named '${allowFolders[0]}'.`
            : 'Please select the correct device folder.',
        );
        return;
      } else {
        props.onFolderUpload(e);
      }
    }
  };
  return (
    <div className='folder-upload'>
      <label
        htmlFor='folder-upload'
        className={classNames(
          'custom-upload-button',
          props.loading && 'custom-upload-button-loading',
        )}
      >
        {props.loading && <Spin indicator={<LoadingOutlined spin />} size='small' />}
        {t('uploadData')}
      </label>
      <input
        className='folder-upload-input'
        type='file'
        id='folder-upload'
        ref={(input) => input && (input.webkitdirectory = true)}
        multiple
        onChange={onFolderUpload}
      />
    </div>
  );
};
FolderUpload.propTypes = {
  onFolderUpload: PropTypes.func.isRequired,
  allowFolders: PropTypes.array,
  loading: PropTypes.bool,
};

export default FolderUpload;
