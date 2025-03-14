import client from '@/apollo';
import REQUEST_FILE_UPLOAD from '@/apollo/query/requestFileUpload';

export type FileExtension =
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'gif'
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'txt'
  | 'dat'
  | 'json'
  | 'jfif';

export interface IRequestFileUploadPayload {
  input: {
    type: FileExtension;
    amount: number;
  };
}

const fetchRequestFileUpload = async (payload: IRequestFileUploadPayload) => {
  const result = await client.query({
    query: REQUEST_FILE_UPLOAD,
    variables: payload,
    context: {
      queryDeduplication: false,
    },
  });
  return result.data?.requestFileUpload?.urls;
};

export default fetchRequestFileUpload;
