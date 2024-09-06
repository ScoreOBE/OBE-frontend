import {
    Button,
    Checkbox,
    Group,
    Modal,
    Textarea,
    TextInput,
    NumberInput,
    NumberInputHandlers,
    Select,
  } from "@mantine/core";
  import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
  import { upperFirst } from "lodash";
  import { useRef, useState } from "react";
  
  type actionType = "add" | "edit";
  
  type Props = {
    opened: boolean;
    onClose: () => void;
    type: actionType;
  };
  export default function ModalManageTopic({ opened, onClose, type }: Props) {
    const height = type === "add" ? "h-full" : "h-fit";
    const handlersLecRef = useRef<NumberInputHandlers>(null);
    const handlersLabRef = useRef<NumberInputHandlers>(null);
    const topicLenght = 0;
  
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        closeOnClickOutside={false}
        title={`${upperFirst(type)} Topic 261405`}
        size={type === "add" && topicLenght > 0 ? "70vw" : "35vw"}
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content: `flex flex-col bg-[#F6F7FA] overflow-hidden `,
          body: `overflow-hidden ${height}`,
        }}
      >
       
        <div
          className={`flex flex-col   !gap-5 ${
            type === "add" ? "h-full" : "h-fit  "
          } `}
        > <Select size="xs" label='Select Topic' placeholder="Topic"></Select>
   
            {/* Input Field */}
            <div
              className={`flex h-fit mb-5 flex-col ${
                type === "add" && "p-5"
              } gap-1 rounded-lg overflow-hidden ${
                topicLenght > 0 && type === "add" ? "w-[45%]" : "w-full"
              }  relative`}
              style={{
                boxShadow:
                  type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
              }}
            >
              <div className="flex flex-col gap-4 h-full">
                <Textarea
                  withAsterisk
                  autoFocus={false}
                  label={<p className="font-semibold flex gap-1"> <span className=" text-secondary">Thai language</span> Description</p>}
                  className="w-full border-none rounded-r-none"
                  classNames={{
                    input: "flex h-[150px] py-2 px-3 text-[13px]",
                    label: "flex pb-1",
                  }}
                  placeholder="Ex. การอินทิเกรต"
                />

<Textarea
                  withAsterisk
                  autoFocus={false}
                  label={<p className="font-semibold flex gap-1"> <span className=" text-secondary">English language</span> Description</p>}
                  className="w-full border-none rounded-r-none"
                  classNames={{
                    input: "flex h-[150px] py-2 px-3 text-[13px]",
                    label: "flex pb-1",
                  }}
                  placeholder="Ex. Integration"
                />
  
              </div>
  
              {/* Add More Button */}
  
          
            </div>
            {/* List CLO */}
          
          </div>
          {/* Button */}
          <div className="flex gap-2  items-end  justify-end h-fit">
            <Button
              onClick={onClose}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-8 w-fit "
            >
              Cancel
            </Button>
            <Button
              // onClick={submit}
              className="rounded-[8px] text-[12px] h-8 w-fit "
            >
              Done
            </Button>
          </div>
     
      </Modal>
    );
  }
  