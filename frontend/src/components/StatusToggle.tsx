import { ButtonGroup, IconButton, useToast, Tooltip } from "@chakra-ui/react";
import { FaEye, FaClock, FaPlay } from "react-icons/fa";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { useState } from "react";

interface StatusToggleProps {
    watchlistId: string;
    itemId: string;
    currentStatus?: "watched" | "watching" | "plan_to_watch";
}

const StatusToggle = ({ watchlistId, itemId, currentStatus = "plan_to_watch" }: StatusToggleProps) => {
    const { updateWatchlistItem } = useWatchlistStore();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleStatusChange = async (newStatus: "watched" | "watching" | "plan_to_watch") => {
        if (newStatus === currentStatus) return;

        setLoading(true);
        try {
            await updateWatchlistItem(watchlistId, itemId, { status: newStatus });
            toast({
                title: "Status updated",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to update status",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Watched">
                <IconButton
                    aria-label="Watched"
                    icon={<FaEye />}
                    colorScheme={currentStatus === "watched" ? "green" : "gray"}
                    variant={currentStatus === "watched" ? "solid" : "outline"}
                    onClick={() => handleStatusChange("watched")}
                    isLoading={loading}
                />
            </Tooltip>
            <Tooltip label="Watching">
                <IconButton
                    aria-label="Watching"
                    icon={<FaPlay />}
                    colorScheme={currentStatus === "watching" ? "orange" : "gray"}
                    variant={currentStatus === "watching" ? "solid" : "outline"}
                    onClick={() => handleStatusChange("watching")}
                    isLoading={loading}
                />
            </Tooltip>
            <Tooltip label="Plan to Watch">
                <IconButton
                    aria-label="Plan to Watch"
                    icon={<FaClock />}
                    colorScheme={currentStatus === "plan_to_watch" ? "blue" : "gray"}
                    variant={currentStatus === "plan_to_watch" ? "solid" : "outline"}
                    onClick={() => handleStatusChange("plan_to_watch")}
                    isLoading={loading}
                />
            </Tooltip>
        </ButtonGroup>
    );
};

export default StatusToggle;
