
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
  } from "@nextui-org/react";
  import axios from "axios";
  
  const DeleteEventModel = ({
    isOpen,
    onOpenChange,
    eventId,
    setEvent,
    setEventId,
  
  }) => {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Delete Event</h4>
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this Event</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={!eventId}
                  onClick={async () => {
                    if (eventId) {
                      try {
                        await axios.delete(
                          `http://localhost:5000/events/${eventId}`
                        );
                        setEvent((prevStaff) =>
                          prevStaff.filter((item) => item._id !== eventId)
                        );
                        setEventId(null);
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
  export default DeleteEventModel;
  