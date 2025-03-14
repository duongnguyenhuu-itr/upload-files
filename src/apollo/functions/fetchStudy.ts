import client from '@/apollo';
import { IStudyQuery } from '@/apollo/functions/function';
import STUDY_QUERY from '@/apollo/query/study';

interface IStudyRequest {
  id: string;
}

const fetchStudy = async (payload: IStudyRequest) => {
  const result = await client.query<IStudyQuery>({
    query: STUDY_QUERY,
    variables: payload,
  });
  return result.data.study;
};

export default fetchStudy;
