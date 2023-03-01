// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import { Router } from './Router'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


export function App() {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Router />
        <ToastContainer />
      </RecoilRoot>
    </ChakraProvider>
  )
}