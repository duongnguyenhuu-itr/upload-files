import fetchRequestFileUpload, {
  FileExtension,
} from '@/apollo/functions/fetchRequestFileUpload';
import { RoleEnum } from '@/constants';
import i18n from '@/translation/i18n';
import { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import _ from 'lodash';
import mime from 'mime-types';

const getFullName = (x) => {
  const arr =
    i18n.language === 'vi' ? [x?.lastName, x?.firstName] : [x?.firstName, x?.lastName];
  return arr.filter(Boolean).join(' ');
};

const formatDisplayRole = (role: RoleEnum) => {
  return t(role);
};

const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const consoleTimeLog = (message: string, value?: any) => {
  const formattedMessage = `${dayjs().format('YYYY-MM-DDTHH:mm:ss')} ${message}`;
  if (value === undefined) {
    console.log(formattedMessage);
  } else {
    console.log(formattedMessage, value);
  }
};

const getCodeAndStateFromUrl = (url: string) => {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.search);
  return {
    code: params.get('code'),
    state: params.get('state'),
  };
};

export type UploadFileToUrlType = {
  data: any;
  customFileType: FileExtension | null;
};

const putFileToUrl = async (
  url: string,
  binaryData: any,
  contentType: string,
): Promise<Response> => {
  const options = {
    method: 'PUT',
    body: binaryData as BodyInit,
    headers: {
      'Content-Type': contentType,
    },
  };
  return fetch(url, options);
};

const uploadFileToUrl = async (fileData: UploadFileToUrlType[] = []) => {
  if (!fileData.length) {
    return [];
  }
  const dataGrouped = _.groupBy(fileData, 'customFileType');
  const data = _.map(dataGrouped, (value, key: FileExtension) => ({
    customFileType: key,
    files: value.map((item) => item.data),
  }));
  const urls = [];
  for (let i = 0; i < data.length; i += 1) {
    const sendingData = {
      input: {
        amount: data[i].files.length,
        type: data[i].customFileType,
      },
    };
    try {
      const uploadFileUrls: string[] = await fetchRequestFileUpload(sendingData);
      const binaryData = data[i].files;
      let customContentType = mime.contentType(data[i].customFileType) || '';
      if (!customContentType) {
        if (data[i].customFileType === 'jfif') {
          customContentType = 'image/jpeg';
        }
      }
      if (uploadFileUrls?.length) {
        const promises = [];
        uploadFileUrls.map((uploadFileUrl, index) => {
          promises.push(
            putFileToUrl(uploadFileUrl, binaryData[index], customContentType),
          );
        });
        await Promise.all(promises);
        urls.push(...uploadFileUrls);
      }
    } catch (error) {
      console.log('Failed to fetch request file upload', error);
      throw error;
    }
  }
  return urls;
};

export {
  consoleTimeLog,
  getCodeAndStateFromUrl,
  formatDisplayRole,
  getFullName,
  removeAccents,
  uploadFileToUrl,
};
