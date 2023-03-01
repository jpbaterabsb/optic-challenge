import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Components/Navbar';



export const Home: React.FC = () => {
  const navigate = useNavigate();


  return <>
  <Navbar title='Home' />
  <Box minH='100vh' display={'flex'} flex={1} justifyContent='center' alignItems='center' >
      <Box width='80%' height='20%' display={'flex'} flex={1} justifyContent='center' flexDirection={'column'} alignItems='center'>
        <Button onClick={() => navigate('/voters')} colorScheme={'blue'} marginBottom={12}>Register Voter</Button>
        <Button onClick={() => navigate('/options')} colorScheme={'blue'} marginBottom={12}>Register Options</Button>
        <Button onClick={() => navigate('/start-voting')} colorScheme={'blue'} size='lg' bgColor={'green.500'}>Start Voting</Button>
      </Box>
  </Box>
  </>
}

