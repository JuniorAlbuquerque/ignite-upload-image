import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered colorScheme="orange">
      <ModalOverlay />

      <ModalContent
        minWidth="fit-content"
        height="fit-content"
        borderBottomRadius={10}
      >
        <ModalBody p="0">
          <Image src={imgUrl} maxWidth="900px" maxHeight="600px" />
        </ModalBody>

        <ModalFooter bgColor="pGray.800" p="2" borderBottomRadius={8}>
          <Link as="a" href={imgUrl} mr="auto" fontSize="small" target="_blank">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
