import { Drawer, Tabs } from "@mantine/core";
import IconTh from "@/assets/icons/thai.svg?react";
import IconEng from "@/assets/icons/eng.svg?react";
import Icon from "./Icon";
import { useState } from "react";
import { IModelPLO } from "@/models/ModelPLO";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelPLO>;
  curriculum?: string;
};

export default function DrawerPLOdes({
  opened,
  onClose,
  data,
  curriculum,
}: Props) {
  const [isTH, setIsTH] = useState<string | null>("TH");

  return (
    <>
      <Drawer.Root
        position="right"
        opened={opened}
        onClose={onClose}
        padding={"xs"}
        className=" !rounded-none"
      >
        <Drawer.Overlay />
        <Drawer.Content className=" !rounded-none">
          <div className="flex flex-col gap-2 h-full overflow-y-auto ">
            <Drawer.Header>
              <div className="flex flex-col w-full h-fit pt-4 gap-4">
                <div className="flex items-center justify-between w-full mt-2 ">
                  <Drawer.Title className="w-full">
                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-secondary text-b1 acerSwift:max-macair133:!text-b2 font-bold">
                        PLO Description
                      </p>

                      <p className="text-[#909090] text-b3 acerSwift:max-macair133:!text-b4 font-medium">
                        {curriculum
                          ? curriculum + " Curriculum"
                          : "This course"}{" "}
                        uses {data.name}
                      </p>
                    </div>
                  </Drawer.Title>
                  <Drawer.CloseButton className="mb-4" />
                </div>

                <div className="flex w-full justify-between items-center gap-4">
                  <p className="flex flex-wrap items-center font-medium text-tertiary text-b2 acerSwift:max-macair133:!text-b3 break-all ">
                    {isTH === "TH" ? data.criteriaTH : data.criteriaEN}
                  </p>
                  <Tabs
                    value={isTH}
                    onChange={setIsTH}
                    variant="pills"
                    className="min-w-fit"
                  >
                    <Tabs.List>
                      <Tabs.Tab value="TH">
                        <div className="flex flex-row items-center gap-2 acerSwift:max-macair133:!text-b4">
                          <Icon IconComponent={IconTh} />
                          ไทย
                        </div>
                      </Tabs.Tab>
                      <Tabs.Tab value="EN">
                        <div className="flex flex-row items-center gap-2 acerSwift:max-macair133:!text-b4">
                          <Icon IconComponent={IconEng} />
                          Eng
                        </div>
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                </div>
              </div>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col h-full  overflow-y-auto ">
              {/* <div className="flex flex-col gap-3 w-full h-full overflow-y-auto"> */}
              {data.data?.map((plo, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 border-b-[1px] px-2  py-4 text-b3 acerSwift:max-macair133:!text-b4"
                >
                  <p className="text-[15px] acerSwift:max-macair133:!text-b3 font-semibold text-secondary">
                    PLO-{plo.no}
                  </p>
                  <div className="flex flex-row leading-6 font-normal text-b3 acerSwift:max-macair133:!text-b4">
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
