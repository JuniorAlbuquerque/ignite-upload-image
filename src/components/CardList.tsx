import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

export interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const disclousure = useDisclosure();

  const [currentImage, setCurrentImage] = useState('');

  const handleViewImage = (imgUrl: string): void => {
    setCurrentImage(imgUrl);
    disclousure.onOpen();
  };

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid columns={3} gap={10}>
        {cards?.map(card => (
          <Card
            data={{
              description: card?.description,
              title: card?.title,
              ts: card?.ts,
              url: card?.url,
            }}
            viewImage={(url: string) => handleViewImage(url)}
          />
        ))}
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage
        imgUrl={currentImage}
        isOpen={disclousure.isOpen}
        onClose={disclousure.onClose}
      />
    </>
  );
}
