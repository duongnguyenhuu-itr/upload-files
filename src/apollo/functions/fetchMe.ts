import client from '@/apollo';
import { IMeQuery } from '@/apollo/functions/function';
import ME_QUERY from '@/apollo/query/me';

const fetchMe = async () => {
  const result = await client.query<IMeQuery>({
    query: ME_QUERY,
  });
  return result.data.me;
};

export default fetchMe;
