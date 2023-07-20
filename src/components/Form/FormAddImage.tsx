import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { FieldError, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type FormImageData = {
  url: string;
  title: string;
  description: string;
};

function isSizeBelow10MB(sizeInBytes: number): boolean {
  const tenMBInBytes = 10 * 1024 * 1024; // 10 MB em bytes

  return sizeInBytes < tenMBInBytes;
}

function isImageFileType(file): boolean {
  const acceptedTypesRegex = /^image\/(jpeg|png|gif)$/;

  return acceptedTypesRegex.test(file.type);
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: (file: FileList) => {
        if (!file?.length) return 'Arquivo obrigatório';

        return null;
      },
      validate: (file: FileList) => {
        if (!file?.length) return null;

        if (!isSizeBelow10MB(file[0]?.size)) {
          return 'O arquivo deve ser menor que 10MB';
        }

        if (!isImageFileType(file[0])) {
          return 'Somente são aceitos arquivos PNG, JPEG e GIF';
        }

        return null;
      },
    },
    title: {
      required: (title: string) => {
        if (!title) return 'Título obrigatório';
        return null;
      },
      minLength: (title: string) => {
        if (title.length < 2) return 'Mínimo de 2 caracteres';
        return null;
      },
      maxLength: (title: string) => {
        if (title.length > 20) return 'Máximo de 20 caracteres';
        return null;
      },
    },
    description: {
      required: (description: string) => {
        if (!description) return 'Descrição obrigatória';
        return null;
      },
      maxLength: (title: string) => {
        if (title.length > 65) return 'Máximo de 65 caracteres';
        return null;
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async ({ url, title, description }: FormImageData) => {
      await api.post('/api/images', {
        url,
        title,
        description,
      });
    },
    // TODO MUTATION API POST REQUEST,
    {
      onSuccess() {
        toast({
          title: 'Imagem cadastrada',
          description: 'Sua imagem foi cadastrada com sucesso',
          status: 'success',
        });

        queryClient.invalidateQueries(['images']);
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, string>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
        });
      }

      await mutation.mutateAsync({
        description: data?.description,
        title: data?.title,
        url: imageUrl,
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors?.image as unknown as FieldError}
          {...register('image', {
            validate: {
              required: (file: FileList) =>
                formValidations.image.required(file),
              validate: (file: FileList) =>
                formValidations.image.validate(file),
            },
          })}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors?.title as unknown as FieldError}
          {...register('title', {
            validate: {
              required: (value: string) =>
                formValidations.title.required(value),
              minLength: (value: string) =>
                formValidations.title.minLength(value),
              maxLength: (value: string) =>
                formValidations.title.maxLength(value),
            },
          })}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors?.description as unknown as FieldError}
          {...register('description', {
            validate: {
              required: (value: string) =>
                formValidations.description.required(value),
              maxLength: (value: string) =>
                formValidations.description.maxLength(value),
            },
          })}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
