import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Confirm Logout</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>Are you sure you want to logout?</Text>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={3}>
          No
        </Button>
        <Button colorScheme="red" onClick={onConfirm}>
          Yes
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default LogoutModal;
