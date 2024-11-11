import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Combobox,
  Group,
  Input,
  InputBase,
  Tabs,
  Text,
  useCombobox,
} from "@mantine/core";
import Icon from "@/components/Icon";
import IconCheck from "@/assets/icons/Check.svg?react";
import { useParams, useSearchParams } from "react-router-dom";
import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
import { isEmpty, isEqual } from "lodash";
import { getValueEnumByKey } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { useForm, UseFormReturnType } from "@mantine/form";
import Loading from "@/components/Loading";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import Part1TQF5 from "@/components/TQF5/Part1TQF5";
import Part2TQF5 from "@/components/TQF5/Part2TQF5";
import Part3TQF5 from "@/components/TQF5/Part3TQF5";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { PartTopicTQF5 } from "@/helpers/constants/TQF5.enum";

export default function TQF5() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const [openModalExportTQF3, setOpenModalExportTQF3] = useState(false);
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [tqf3Original, setTqf3Original] = useState<
    Partial<IModelTQF5> & { topic?: string; ploRequired?: string[] }
  >();
  const tqf5 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf5Part, setTqf5Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [confirmToEditData, setConfirmToEditData] = useState(false);
  const [loadingRes, setLoadingRes] = useState(false);
  const partTab = [
    {
      value: Object.keys(partLabel)[0],
      tab: partLabel.part1,
      compo: <Part1TQF5 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[1],
      tab: partLabel.part2,
      compo: <Part2TQF5 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[2],
      tab: partLabel.part3,
      compo: <Part3TQF5 setForm={setForm} />,
    },
  ];

  interface option {
    topic: string;
    description: string;
  }

  const groceries: option[] = [
    {
      topic: "ScoreOBE +",
      description: "The smartest way to evaluate and analyze your TQF 5",
    },
    {
      topic: "Manual",
      description: "Customize all data what you want",
    },
  ];

  function SelectOption({ topic, description }: option) {
    return (
      <Group>
        <div>
          <Text fz="sm" fw={500}>
            {topic}
          </Text>
          <Text fz="xs" opacity={0.6}>
            {description}
          </Text>
        </div>
      </Group>
    );
  }
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(null);
  const selectedOption = groceries.find((item) => item.topic === value);

  const options = groceries.map((item) => (
    <Combobox.Option value={item.topic} key={item.topic}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    if (academicYear && (tqf5.topic !== tqf3Original?.topic || !tqf3Original)) {
      // fetchOneCourse(true);
    }
  }, [academicYear, tqf5.topic, courseNo]);

  const checkActiveTerm = () => {
    return (
      parseInt(params.get("year") || "") === academicYear.year &&
      parseInt(params.get("semester") || "") === academicYear.semester
    );
  };

  const setCurrentPartTQF3 = (tqf5: IModelTQF5) => {
    if (!tqf5 || !tqf5.part1) {
      setTqf5Part("part1");
    } else if (!tqf5.part2) {
      setTqf5Part("part2");
    } else {
      setTqf5Part("part3");
    }
  };

  return loading || !tqf3Original ? (
    <Loading />
  ) : (
    <>
      <div
        className={`flex flex-col h-full w-full overflow-hidden ${
          !checkActiveTerm() && "pb-2"
        }`}
      >
        <Tabs
          value={tqf5Part}
          onChange={setTqf5Part}
          defaultValue={"part1"}
          classNames={{
            root: "overflow-hidden w-full flex flex-col h-full",
            tab: "px-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold text-[12px]",
          }}
          className="px-6 pt-2 flex flex-col h-full w-full"
        >
          <div
            className={`flex flex-col w-full h-fit ${
              tqf5Part === "part2" ? "pb-1" : "border-b-[2px] pb-4 mb-1"
            }`}
          >
            <Tabs.List className="md:gap-x-5 gap-x-3 w-full">
              {partTab.map(({ tab, value }) => (
                <Tabs.Tab key={value} value={value}>
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      IconComponent={IconCheck}
                      //   className={checkPartStatus(value as keyof IModelTQF3)}
                    />
                    {tab}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary   overflow-y-auto font-semibold  whitespace-break-spaces">
                {getValueEnumByKey(PartTopicTQF5, tqf5Part!)}
              </div>
              <Combobox
                store={combobox}
                withinPortal={false}
                onOptionSubmit={(val) => {
                  setValue(val);
                  combobox.closeDropdown();
                }}
                size="xs"
              >
                <Combobox.Target>
                  <InputBase
                    component="button"
                    type="button"
                    pointer
                    size="xs"
                    rightSection={<Combobox.Chevron />}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                    multiline
                    className="w-[25vw]"
                    classNames={{ label: "" }}
                  >
                    {selectedOption ? (
                      <SelectOption {...selectedOption} />
                    ) : (
                      <Input.Placeholder>Pick value</Input.Placeholder>
                    )}
                  </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
            </div>
          </div>
          <div
            className={`h-full w-full flex overflow-y-auto rounded-md text-[14px]
              ${
                tqf3Original &&
                (tqf3Original.part3 && tqf5Part === "part4" ? "" : "pt-3 px-3")
              }`}
          >
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.value} className="w-full">
                {tqf5Part === part.value && tqf5.id ? (
                  part.compo
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loading />
                  </div>
                )}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  );
}
