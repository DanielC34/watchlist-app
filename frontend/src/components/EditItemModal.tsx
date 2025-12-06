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
    Textarea,
    VStack,
    HStack,
    Text,
    useToast,
    Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useWatchlistStore } from "../store/useWatchlistStore";
import StatusToggle from "./StatusToggle";
import { WatchlistItem } from "../types";

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: WatchlistItem;
    watchlistId: string;
}

const EditItemModal = ({ isOpen, onClose, item, watchlistId }: EditItemModalProps) => {
    const [rating, setRating] = useState<number>(item.rating || 0);
    const [notes, setNotes] = useState<string>(item.personalNotes || "");
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    const { updateWatchlistItem } = useWatchlistStore();
    const toast = useToast();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateWatchlistItem(watchlistId, item._id, {
                rating,
                personalNotes: notes,
            });
            toast({
                title: "Item updated",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: "Failed to update item",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay backdropFilter="blur(2px)" />
            <ModalContent bg="gray.800" color="white">
                <ModalHeader>{item.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={6} align="stretch">
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <StatusToggle
                                watchlistId={watchlistId}
                                itemId={item._id}
                                currentStatus={item.status}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Rating</FormLabel>
                            <HStack spacing={1}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Box
                                        key={star}
                                        as="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        color={star <= (hoverRating || rating) ? "yellow.400" : "gray.600"}
                                        transition="color 0.2s"
                                        _hover={{ transform: "scale(1.1)" }}
                                    >
                                        <FaStar size={24} />
                                    </Box>
                                ))}
                                <Text ml={2} fontSize="sm" color="gray.400">
                                    {rating > 0 ? `${rating}/5` : "No rating"}
                                </Text>
                            </HStack>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Personal Notes</FormLabel>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Write your thoughts, review, or memories..."
                                bg="gray.700"
                                border="none"
                                _focus={{ ring: 2, ringColor: "blue.500" }}
                                rows={5}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSave} isLoading={isSaving}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditItemModal;
