import { Checkbox, Button, Alert, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import checkbox from "@/assets/icons/checkbox.svg?react";
import Icon from "../Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import DrawerPLOdes from "@/components/DrawerPLO";
import { useEffect, useState } from "react";
import { IModelTQF3Part7 } from "@/models/ModelTQF3";
import { IModelPLO } from "@/models/ModelPLO";
import { getOnePLO } from "@/services/plo/plo.service";
import { useAppDispatch, useAppSelector } from "@/store";
import unplug from "@/assets/image/unplug.png";
import { cloneDeep, isEqual } from "lodash";
import { updatePartTQF3 } from "@/store/tqf3";
import { useParams, useSearchParams } from "react-router-dom";
import Loading from "../Loading";
import { initialTqf3Part7 } from "@/helpers/functions/tqf3";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part7TQF3({ setForm }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [coursePLO, setCoursePLO] = useState<Partial<IModelPLO>>();
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [validatePloRequired, setValidatePloRequired] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF3Part7[] },
    validate: {
      data: {
        plos: (value) => {
          setValidatePloRequired(true);
          return !value.length && "CLO must be linked to at least one PLO";
        },
      },
    },
    onValuesChange(values, previous) {
      setValidatePloRequired(false);
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF3({ part: "part7", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  useEffect(() => {
    fetchPLO();
    if (tqf3.part7) {
      form.setFieldValue("updatedAt", tqf3.part7.updatedAt);
      form.setFieldValue("data", cloneDeep(tqf3.part7.data));
    } else if (tqf3.part2) {
      form.setValues(initialTqf3Part7(tqf3.part2));
    }
  }, []);

  const fetchPLO = async () => {
    setLoading(true);
    const resPloCol = await getOnePLO({
      year: academicYear.year,
      semester: academicYear.semester,
      courseCode: courseNo?.slice(0, -3),
    });
    if (resPloCol) {
      setCoursePLO(resPloCol);
      if (!resPloCol.data) {
        localStorage.removeItem(`reuse${tqf3.id}-part7`);
        form.setValues(initialTqf3Part7(tqf3.part2));
      }
    }
    setLoading(false);
  };

  return tqf3?.part5?.updatedAt ? (
    coursePLO?.data?.length ? (
      <>
        {coursePLO && (
          <DrawerPLOdes
            opened={openDrawerPLOdes}
            onClose={() => setOpenDrawerPLOdes(false)}
            data={coursePLO}
          />
        )}

        <div className="flex flex-col w-full max-h-full gap-4 -mt-1 pb-4">
          {/* Topic */}
          <div className="flex text-secondary items-center w-full justify-between">
            <span className="text-[15px] font-semibold">
              CLO Mapping <span className=" text-red-500">*</span>
            </span>
            <Button
              className="text-center px-4"
              onClick={() => setOpenDrawerPLOdes(true)}
            >
              <div className="flex gap-2">
                <Icon IconComponent={IconPLO} />
                PLO Description
              </div>
            </Button>
          </div>
          <div className="w-full">
            <Alert
              radius="md"
              icon={<Icon IconComponent={checkbox} />}
              variant="light"
              color="rgba(6, 158, 110, 1)"
              classNames={{
                icon: "size-6",
                body: " flex justify-center",
              }}
              className="w-full"
              title={
                <p className="font-semibold">
                  Each CLO must be linked to at least one PLO.
                  {tqf3.ploRequired?.length && (
                    <>
                      And if you see
                      <span className="text-red-500 font-bold">
                        {" "}
                        'required'{" "}
                      </span>{" "}
                      in a PLO column, at least one of your CLOs must be linked
                      to that required PLO.
                    </>
                  )}
                </p>
              }
            ></Alert>
          </div>

          {/* Table */}
          <div
            key={form.key("data")}
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className=" overflow-x-auto w-full h-full max-h-full border flex flex-col rounded-lg border-secondary relative"
          >
            <Table stickyHeader striped>
              <Table.Thead className="z-[2]">
                <Table.Tr>
                  <Table.Th
                    style={{
                      filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                    }}
                    className="min-w-[500px] sticky left-0 !p-0"
                  >
                    <div className="w-full flex items-center px-[25px] h-[58px] border-r-[1px] border-[#DEE2E6]">
                      CLO Description ( {tqf3.part2?.clo.length} CLO
                      {tqf3.part2?.clo.length! > 1 ? "s" : ""} )
                    </div>
                  </Table.Th>
                  {coursePLO?.data?.map(({ no, id }) => (
                    <Table.Th
                      key={id}
                      className="min-w-[100px] !pt-3 !pb-2 w-fit"
                    >
                      <p className="">
                        PLO-{no}{" "}
                        <span className="text-red-500">
                          {tqf3.ploRequired?.includes(id) && "required"}
                        </span>
                      </p>
                      <p className="error-text mt-1">
                        {validatePloRequired &&
                          tqf3.ploRequired?.includes(id) &&
                          !form
                            .getValues()
                            .data.some(({ plos }) =>
                              (plos as string[]).includes(id)
                            ) &&
                          "Select CLO at least one"}
                      </p>
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.getValues().data.map(({ clo }, cloIndex) => {
                  const cloItem = tqf3?.part2?.clo.find((e) => e.id == clo);
                  return (
                    <Table.Tr
                      key={cloIndex}
                      className="text-[13px] text-default"
                    >
                      <Table.Td
                        key={form.key(`data.${cloIndex}.plos`)}
                        style={{
                          filter: "drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1))",
                        }}
                        className="!p-0 !py-1 sticky left-0 z-[1]"
                        {...form.getInputProps(`data.${cloIndex}.plos`)}
                      >
                        <div className="flex gap-5 justify-start  items-center  px-[20px] py-2">
                          <div className="text-secondary min-w-fit font-bold">
                            CLO-{cloItem?.no}
                          </div>
                          <p className="flex w-fit font-medium justify-between flex-col ">
                            <span className="mb-2">{cloItem?.descTH}</span>
                            <span>{cloItem?.descEN}</span>
                            <span className="error-text mt-1">
                              {
                                form.getInputProps(`data.${cloIndex}.plos`)
                                  .error
                              }
                            </span>
                          </p>
                        </div>
                      </Table.Td>
                      {coursePLO?.data?.map(({ id }, index) => {
                        const ploIndex = form
                          .getValues()
                          .data[cloIndex].plos?.findIndex((plo) => plo == id);
                        return (
                          <Table.Td key={index}>
                            <div className="flex items-start">
                              <Checkbox
                                size="sm"
                                classNames={{
                                  body: "mr-3 px-0",
                                  label:
                                    "text-[14px] text-[#615F5F] cursor-pointer",
                                }}
                                disabled={disabled}
                                checked={(
                                  form.getValues().data[cloIndex]
                                    .plos as string[]
                                ).includes(id)}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    form.insertListItem(
                                      `data.${cloIndex}.plos`,
                                      id
                                    );
                                  } else if (ploIndex >= 0) {
                                    form.removeListItem(
                                      `data.${cloIndex}.plos`,
                                      ploIndex
                                    );
                                  }
                                }}
                              />
                            </div>
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </>
    ) : (
      <div className="flex flex-col w-full h-full justify-center items-center">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex px-16 flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                Course Not Linked to PLO Collection
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                This course is currently not linked to any PLO collection.{" "}
                <br /> If you need to do this part, please contact your
                department administrator.
              </p>
            </div>
            <img
              className=" z-50  w-[580px] h-[300px] "
              src={unplug}
              alt="loginImage"
            />
          </div>
        )}
      </div>
    )
  ) : (
    <div className="flex px-16  flex-row items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px]">
          Complete TQF3 Part 6 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px]">
          To start TQF3 Part 7, please complete and save TQF3 Part 6. <br />{" "}
          Once done, you can continue to do it.
        </p>
      </div>
      <img
        className=" z-50  w-[580px] h-[300px] "
        src={unplug}
        alt="loginImage"
      />
    </div>
  );
}
