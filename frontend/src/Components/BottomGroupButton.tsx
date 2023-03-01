import { Box, Button } from '@chakra-ui/react';
import React from 'react';

// import { Container } from './styles';

type Props = {
    reset: () => void
}

const BottomGroupButton: React.FC<Props> = ({reset}) => {
  return                         <Box width={'80%'} display={'flex'} flex={1} alignItems='center' justifyContent={'space-around'} alignSelf={'center'}>
  <Button type="submit" size={'lg'} alignSelf={'center'} width='28' colorScheme="blue">
      Register
  </Button>
  <Button onClick={reset} size={'lg'} alignSelf={'center'} width='28' colorScheme="red">
      Reset
  </Button>
</Box>;
}

export default BottomGroupButton;