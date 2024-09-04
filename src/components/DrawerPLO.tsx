import { Drawer, Tabs } from "@mantine/core";
import ThIcon from "@/assets/icons/thai.svg?react";
import EngIcon from "@/assets/icons/eng.svg?react";
import Icon from "./Icon";
import { useEffect, useState } from "react";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelPLO } from "@/models/ModelPLO";
import { useAppSelector } from "@/store";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function DrawerPLOdes({ opened, onClose }: Props) {
  const [ploList, setPloList] = useState<Partial<IModelPLO>>({});
  const user = useAppSelector((state) => state.user);
  const [isTH, setIsTH] = useState<string | null>("TH");

  const fetchPLO = async () => {
    let res = await getPLOs({
      role: user.role,
      departmentCode: user.departmentCode,
    });
    if (res) {
      setPloList(res.plos[1].collections[1]);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchPLO();
    }
  }, [opened]);

  return (
    <>
      <Drawer.Root
        position="right"
        opened={opened}
        onClose={onClose}
        padding={"sm"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <div className="flex flex-col gap-5 h-full overflow-hidden ">
            <Drawer.Header>
              <div className="flex flex-col w-full h-fit pt-4 gap-3">
                <div className="flex items-center justify-between w-full mt-2 ">
                  <Drawer.Title className="w-full">
                    <div className="flex flex-col gap-1 items-start">
                      <p className="text-secondary text-[16px] font-bold">
                        PLO Description
                      </p>

                      <p className="text-[#909090] text-[12px] font-medium">
                        PLO Collection
                      </p>
                    </div>
                  </Drawer.Title>
                  <Drawer.CloseButton />
                </div>

                <div className="flex w-full justify-between items-center ">
                  <p className="flex items-center font-medium text-tertiary h-9 text-[14px]">
                    {isTH === "TH" ? ploList.criteriaTH : ploList.criteriaEN}
                  </p>
                  <Tabs value={isTH} onChange={setIsTH} variant="pills">
                    <Tabs.List>
                      <Tabs.Tab value="TH">
                        <div className="flex flex-row items-center gap-2 ">
                          <Icon IconComponent={ThIcon} />
                          ไทย
                        </div>
                      </Tabs.Tab>
                      <Tabs.Tab value="EN">
                        <div className="flex flex-row items-center gap-2 ">
                          <Icon IconComponent={EngIcon} />
                          Eng
                        </div>
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                </div>
              </div>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-3 max-h-full overflow-y-auto ">
              {/* <div className="flex flex-col gap-3 w-full h-full overflow-y-auto"> */}
              {ploList.data?.map((plo) => (
                <div className="flex flex-col gap-2 bg-[#eff0ff] px-6 py-4 text-[13px]  rounded-lg ">
                  <p className="text-[14px] font-semibold text-secondary">
                    PLO-{plo.no}
                  </p>
                  <div className="flex flex-row">
                    {isTH === "TH" ? plo.descTH : plo.descEN}
                  </div>
                </div>
              ))}
              {/* </div> */}
            </Drawer.Body>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
