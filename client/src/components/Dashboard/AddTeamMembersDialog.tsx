import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { socket } from "@/lib/socket";
import { useUser } from "@/hooks/useUser";

const AddTeamMembersDialog = ({
  isVisible,
  setIsVisible,
  projectId,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
}) => {
  const { user } = useUser();

  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState("");

  const addMember = useCallback(() => {
    setIsPending(true);
    socket.emit("request-add-member", {
      email,
      projectId,
      userEmail: user?.email,
    });
    setEmail("");
    setIsPending(false);
  }, [email]);

  const handleRequestSent = useCallback(
    () => toast.success("Join request sent"),
    []
  );

  useEffect(() => {
    socket.on("request-sent", handleRequestSent);
    return () => {
      socket.off("request-sent", handleRequestSent);
    };
  }, []);
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Members</DialogTitle>
          <DialogDescription>Click add when you're done.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-2">
            <Input
              id="email"
              type="email"
              placeholder="Enter member's email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button disabled={isPending} onClick={addMember}>
              {isPending ? "Please wait..." : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMembersDialog;
