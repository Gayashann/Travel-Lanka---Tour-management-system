import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";

const DeleteUserModel = ({
  isOpen,
  onOpenChange,
  userId,
  setUser,
  setUserId,
  setRefetch,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4>Delete Staff</h4>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this user?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                disabled={!userId}
                onClick={async () => {
                  if (userId) {
                    try {
                      await axios.delete(
                        `http://localhost:5000/auth/${userId}`
                      );
                      setUser((prevUser) =>
                        prevUser.filter((item) => item._id !== userId)
                      );
                      setUserId(null);
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  onClose();
                }}
              >
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default DeleteUserModel;
