import { Button, Input, Modal } from "@mantine/core";
import { IconUserCircle, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { AiOutlineSwap } from "react-icons/ai";
import Icon from "../Icon";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor } from "@/services/user/user.service";
import { useAppSelector } from "@/store";
import { ROLE } from "@/helpers/constants/enum";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalChangeSupremeAdmin({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<any[]>([]);

  useEffect(() => {
    const fetchIns = async () => {
      let res = await getInstructor();
      //   res = res.filter((e: any) => e.id !== user.id && e.role === ROLE.ADMIN);
      res = res.filter((e: any) => e.id !== user.id);

      setAdminList(
        res.map((e: IModelUser) => {
          return {
            firstNameEN: e.firstNameEN,
            lastNameEN: e.lastNameEN,
            value: e.id,
            email: e.email,
          };
        })
      );
    };
    if (opened) {
      fetchIns();
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title="Management Supreme Admin"
      size="45vw"
      radius={"12px"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "text-primary font-medium text-[18px]",
        header: "bg-[#F6F7FA]",
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-[95%]",
      }}
    >
      <div
        className="w-full max-h-[500px]  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
        style={{
          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Show List Of Admin */}
        <div className="flex  flex-col  flex-1  p-4  overflow-y-hidden">
          <Input
            leftSection={<TbSearch />}
            placeholder="Name"
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            className="focus:border-none px-1"
            classNames={{ input: "bg-gray-200 rounded-md border-none" }}
            rightSectionPointerEvents="all"
          />
          {/* List of Admin */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-1">
            {adminList.map((e) => (
              <div
                key={e.id}
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className="flex flex-1 items-center justify-between mt-2 py-3 px-4 rounded-md "
              >
                <div className="gap-4 flex items-center">
                  <IconUserCircle size={32} stroke={1} />
                  <div className="flex flex-col">
                    <p className="font-[500]">
                      {e.firstNameEN} {e.lastNameEN}
                    </p>
                    <p className="text-[#4E5150] text-[12px] font-normal">
                      {e.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  color="#5768D5"
                  className=" rounded-full px-[7px]"
                >
                  <AiOutlineSwap className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
