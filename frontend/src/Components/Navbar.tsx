import { Flex, Heading } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";


type NavbarProps = {
  title: string;
};

export const Navbar = ({ title }: NavbarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();



  return (
    <Flex as="nav" align="center" bgGradient='linear(to-l, blue.700, blue.500)' wrap="wrap" p={6}>
      {!['/voting-results', '/voting', '/', '/login'].includes(pathname) && <Flex cursor={'pointer'} onClick={() => navigate(-1)} align="center" mr={5}>
        <FaArrowLeft size={20} color={'white'} />
      </Flex>}
      <Flex align="center" mr={5}>
        <Heading color={'white'} as="h1" size="lg">
          {title}
        </Heading>
      </Flex>
    </Flex>
  );
};