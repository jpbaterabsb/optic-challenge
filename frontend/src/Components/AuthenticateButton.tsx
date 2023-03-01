import { Button } from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";

type Props = {
    onClick: () => void
}

export function AuthenticateButton({ onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      leftIcon={<FaEthereum />}
      colorScheme="blue"
      variant="solid"
      size="lg"
      _hover={{ bg: "blue.700" }}
      _active={{ bg: "blue.800" }}
    >
      Authenticate with Metamask
    </Button>
  );
}
