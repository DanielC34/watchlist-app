import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";

const ProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const modalSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader fontSize={{ base: "lg", md: "xl" }}>
          Profile Settings
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>
                Username
              </FormLabel>
              <Input
                placeholder="Username"
                defaultValue={user?.username}
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Email</FormLabel>
              <Input
                placeholder="Email"
                defaultValue={user?.email}
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>
                Profile Picture
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                p={1}
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={onClose}
            size={{ base: "sm", md: "md" }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={onSave}
            size={{ base: "sm", md: "md" }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
