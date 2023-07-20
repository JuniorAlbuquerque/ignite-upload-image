import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImagesQueryResponse {
  after?: string;
  data: {
    ts: number;
    id: string;
    title: string;
    description: string;
    url: string;
  }[];
}

const fecthImages = async (page = null): Promise<ImagesQueryResponse> => {
  const { data } = await api.get<ImagesQueryResponse>('/api/images', {
    params: {
      after: page,
    },
  });

  return data;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(['images'], {
    queryFn: ({ pageParam = null }) => fecthImages(pageParam),
    getNextPageParam: lastPage => {
      if (lastPage.after) {
        return lastPage.after;
      }

      return null;
    },
  });

  const formattedData = useMemo(() => {
    return data?.pages?.map(value => value.data).flat();
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button
            mt={8}
            onClick={() =>
              hasNextPage && !isFetchingNextPage && fetchNextPage()
            }
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
