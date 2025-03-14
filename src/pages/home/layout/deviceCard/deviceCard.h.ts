import handleStoreDeviceData, {
  FileDeviceType,
} from '@/apollo/functions/handleStoreDeviceData';
import handleSyncDeviceData from '@/apollo/functions/handleSyncDeviceData';
import {
  DEVICE_EXAMPLE_INFO,
  FileHeaderInfo,
} from '@/pages/home/layout/deviceCard/constant';
import { uploadFileToUrl, UploadFileToUrlType } from '@/utils';
import { toastError } from '@/utils/toastNotification';
import { Buffer } from 'buffer';
import _ from 'lodash';
import { DeviceFiles, MissingItem, MissingPromise } from './deviceCard.d';

export const formatFolder = (files: File[]) => {
  try {
    const formattedFiles = getFormatFiles(files);
    if (!formattedFiles.isSuccess) {
      toastError(formattedFiles.message);
      return;
    }

    const { data } = formattedFiles;
    return data;
  } catch (error) {
    console.error('Error format folder:', error);
  }
};

const getFormatFiles = (files: File[] = []) => {
  const checkFileName = _.find(files, (file) => file.name.includes('check'))?.name;
  const formatFiles = {
    'check-0001.dat': {
      ecg: 'D1',
      log: 'D2',
      notification: 'D3',
    },
  };
  if (!formatFiles[checkFileName]) {
    return {
      isSuccess: false,
      message: 'Format folder is not correct.',
    };
  }

  const data: DeviceFiles = {
    ecgs: _.filter(files, (file) => file.name.startsWith(formatFiles[checkFileName].ecg)),
    logs: _.filter(files, (file) => file.name.startsWith(formatFiles[checkFileName].log)),
    notifications: _.filter(files, (file) =>
      file.name.startsWith(formatFiles[checkFileName].notification),
    ),
  };

  return {
    isSuccess: true,
    data,
  };
};

const readFileAsArrayBuffer = (
  file: File,
  start: number,
  end: number,
): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileSlice = file.slice(start, end);
    reader.readAsArrayBuffer(fileSlice);

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      resolve(bytes);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

const getLookupTablePromises = async (files: File[]) => {
  const promises = files.map((file) => {
    return readFileAsArrayBuffer(
      file,
      FileHeaderInfo.startNumOfBlock,
      FileHeaderInfo.endNumOfBlock,
    );
  });
  const results = await Promise.all(promises);

  return results.map((buffer, index) =>
    readFileAsArrayBuffer(
      files[index],
      FileHeaderInfo.startLookupTable,
      FileHeaderInfo.startLookupTable + arrayBufferToHex(buffer) * 16,
    ),
  );
};

export const getLookupTables = async (files: File[]) => {
  try {
    const promises = await getLookupTablePromises(files);
    const results = await Promise.all(promises);
    const lookupTables = [];
    _.forEach(results, (buffer, index) => {
      for (let i = 0; i < buffer.length; i += 16) {
        const block = buffer.slice(i, i + 16);
        const start = arrayBufferToHex(block.slice(0, 4));
        const stop = arrayBufferToHex(block.slice(4, 8));
        const startPosition = arrayBufferToHex(block.slice(8, 12));
        const stopPosition = arrayBufferToHex(block.slice(12, 16));
        lookupTables.push({
          start,
          stop,
          startPosition,
          stopPosition,
          index,
        });
      }
    });

    return lookupTables;
  } catch (error) {
    console.log('Error get lookup tables:', error);
    return [];
  }
};

export const hexToArrayBuffer = (hex: string): ArrayBuffer => {
  // remove the leading 0x
  const hexString = hex.replace(/^0x/, '');

  // ensure even number of characters
  if (hexString.length % 2 != 0) {
    console.log('WARNING: expecting an even number of characters in the hexString');
    return null;
  }

  // check for some non-hex characters
  const bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.log('WARNING: found non-hex characters', bad);
    return null;
  }

  // split the string into pairs of octets
  const pairs = hexString.match(/[\dA-F]{2}/gi);

  // convert the octets to integers
  const integers = pairs.map(function (s) {
    return parseInt(s, 16);
  });

  const array = new Uint8Array(integers);

  return array.reverse().buffer;
};

export const arrayBufferToHex = (buffer: Uint8Array): number => {
  const hexString = Array.prototype.map
    .call(_.reverse(buffer), (x) => ('00' + x.toString(16)).slice(-2))
    .join('');
  return Number(`0x${hexString}`);
};

const uploadMissingDataByDuration = async ({
  missingPromises,
  deviceId,
  studyId,
  type,
}: {
  missingPromises: MissingPromise[];
  deviceId: string;
  studyId: string;
  type: FileDeviceType;
}) => {
  try {
    const results: Uint8Array[] = await Promise.all(_.map(missingPromises, 'buffer'));
    console.log('Results:', results);

    // Merge file buffer by duration
    const mergedBuffer = Buffer.concat(results);
    console.log('Merged buffer:', mergedBuffer);

    // Get info start, stop, start position, stop position of missing data in merged buffer
    const missingInfo = _.map(missingPromises, 'info');
    console.log('Missing info:', missingInfo);

    // Handle upload files to S3
    const [url] = await uploadFileToUrl([
      {
        data: mergedBuffer,
        customFileType: 'dat',
      },
    ]);

    const storeData = await handleStoreDeviceData({
      input: {
        deviceId,
        studyId,
        mssingHourlys: missingInfo,
        type,
        url,
      },
    });

    return storeData;
  } catch (error) {
    console.log('Error get missing data by duration:', error);
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};

const uploadMissingData = async ({
  missingList,
  files,
  duration,
  deviceId,
  studyId,
  type,
}: {
  missingList: MissingItem[];
  files: File[];
  duration: number;
  deviceId: string;
  studyId: string;
  type: FileDeviceType;
}) => {
  try {
    const sliceMissingTest = missingList.slice(0, 11);
    console.log(`Start upload missing ${type} data: `, { missingList: sliceMissingTest });
    let missingPromises: MissingPromise[] = [];
    let start = 0;
    for (const missingItem of sliceMissingTest) {
      console.log('Missing item:', { missingPromises });
      if (missingPromises?.length === 0) {
        start = missingItem.start;
      }
      const file = files[missingItem.index];
      if (!file) {
        return {
          isSuccess: false,
          message: 'File not found.',
        };
      }

      const byteStart = missingPromises.length
        ? missingPromises[missingPromises.length - 1].info.byteStop
        : 0;
      missingPromises.push({
        info: {
          timeStart: missingItem.start,
          timeStop: missingItem.stop,
          byteStart,
          byteStop: byteStart + missingItem.stopPosition - missingItem.startPosition,
        },
        buffer: readFileAsArrayBuffer(
          file,
          missingItem.startPosition,
          missingItem.stopPosition,
        ),
      });
      if (missingItem.stop - start <= duration) {
        continue;
      }

      const result = await uploadMissingDataByDuration({
        missingPromises,
        deviceId,
        studyId,
        type,
      });
      if (!result.isSuccess) {
        return result;
      }

      missingPromises = [];
    }
    console.log('Missinggggggggg promises:', missingPromises);

    if (missingPromises.length) {
      const result = await uploadMissingDataByDuration({
        missingPromises,
        deviceId,
        studyId,
        type,
      });
      if (!result.isSuccess) {
        return result;
      }
    }

    return {
      isSuccess: true,
    };
  } catch (error) {
    console.log('Error get missing data:', error);
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};

export const handlePushFilesToS3 = async (formattedFiles: DeviceFiles) => {
  try {
    // Logic handle push files to S3
    console.log('Push files to S3:', formattedFiles);
  } catch (error) {
    console.log('Error push files to S3:', error);
  }
};

export const handleUploadDatFiles = async (files: File[]) => {
  try {
    const uploadFiles = files.map(
      (file): UploadFileToUrlType => ({
        data: file,
        customFileType: 'dat',
      }),
    );
    return await uploadFileToUrl(uploadFiles);
  } catch (error) {
    console.log('Error upload notifications:', error);
    return [];
  }
};

export const handleUploadFilesToS3 = async ({
  formattedFiles,
  deviceId,
  studyId,
}: {
  formattedFiles: DeviceFiles;
  deviceId: string;
  studyId: string;
}) => {
  try {
    // Logic handle upload notifications
    const urls = await handleUploadDatFiles(formattedFiles.notifications);

    const promises = [
      getLookupTables(formattedFiles.ecgs),
      getLookupTables(formattedFiles.logs),
      ...urls.map((url) =>
        handleStoreDeviceData({
          input: {
            deviceId: DEVICE_EXAMPLE_INFO.deviceId,
            studyId: DEVICE_EXAMPLE_INFO.studyId,
            type: 'notification',
            url,
          },
        }),
      ),
    ];
    const [ecgLookupTables, logLookupTables] = await Promise.all(promises);
    console.log('Lookup tables:', { ecgLookupTables, logLookupTables });
    const uploadData: UploadFileToUrlType[] = [
      {
        data: JSON.stringify({
          ecg: ecgLookupTables,
          log: logLookupTables,
        }),
        customFileType: 'json',
      },
    ];
    console.log('Upload data:', uploadData);
    const [lookupTableUrl] = await uploadFileToUrl(uploadData);
    const sendingData = {
      input: {
        deviceId,
        studyId,
        url: lookupTableUrl,
      },
    };
    await handleSyncDeviceData(sendingData);
  } catch (error) {
    console.log('Error upload notifications:', error);
    return {};
  }
};

export const handleSyncMissingData = async ({
  missingEcg,
  missingLog,
  formattedFiles,
  deviceId,
  studyId,
}) => {
  try {
    console.time('upload missing data');
    console.log('start upload missing ecg data:', { missingEcg });
    const ecgResult = await uploadMissingData({
      missingList: missingEcg,
      files: formattedFiles.ecgs,
      deviceId,
      studyId,
      duration: 10800,
      type: 'ecg',
    });

    if (!ecgResult.isSuccess) {
      return ecgResult;
    }

    console.log('start upload missing log data:', { missingLog });
    const logResult = await uploadMissingData({
      missingList: missingLog,
      files: formattedFiles.logs,
      deviceId,
      studyId,
      duration: 10800,
      type: 'log',
    });
    console.timeEnd('upload missing data');

    if (!logResult.isSuccess) {
      return logResult;
    }
    return {
      isSuccess: true,
    };
  } catch (error) {
    console.log('Error sync missing data:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
};
