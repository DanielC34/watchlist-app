import React from "react";
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
import PropTypes from "prop-types";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => (
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

LogoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default LogoutModal;
