import { Box, Spinner as ChakraSpinner } from '@chakra-ui/react';
import React from 'react';

export const Spinner: React.FC = () => {
    return <Box height={'100vh'} display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'}>
        <ChakraSpinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
        />
    </Box>;
}