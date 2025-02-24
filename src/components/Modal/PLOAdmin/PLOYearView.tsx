import { Modal } from "@mantine/core";
import { ScrollArea } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function PLOYearView({ opened, onClose }: Props) {
  const semesters = [
    { title: "Semester 1", courses: 4 },
    { title: "Semester 2", courses: 4 },
    { title: "Semester 3", courses: 4 },
  ];

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      autoFocus={false}
      fullScreen={true}
      zIndex={50}
      classNames={{ content: "!p-0 !bg-[#fafafa]" }}
    >
      <Modal.Content>
        {/* Header */}

        <Modal.Header className="flex w-full h-[64px] !bg-white px-6 !py-4 border-b">
          <div className="flex items-center gap-3">
            <Modal.CloseButton className="ml-0" />
            <p className="font-semibold text-h2  text-secondary">Year View</p>
          </div>
        </Modal.Header>

        {/* Body */}
        <Modal.Body className="flex h-full max-h-[92vh] !w-full  p-6 px-10   gap-4 overflow-hidden">
          {semesters.map((semester, semesterIndex) => (
            <div
              key={semesterIndex}
              className="bg-white w-full rounded-xl shadow p-5 border h-full flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {semester.title}
              </h3>
              <p className="text-sm text-gray-500">
                {semester.courses} Courses
              </p>

              <ScrollArea className="mt-4 flex-1 overflow-auto">
                {Array.from({ length: semester.courses }).map(
                  (_, courseIndex) => (
                    <div
                      key={courseIndex}
                      className="p-4 mb-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <p className="text-sm font-bold text-gray-700">259201</p>
                      <p className="text-xs text-gray-500">
                        Computer Programming for Engineers
                      </p>

                     
                        <div
                        
                          className="mt-3 p-3 bg-bgTableHeader rounded-md "
                        >
                          {["PLO 1", "PLO 2", "PLO 3"].map((plo, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between py-1 text-xs"
                            >
                              <p>{plo}</p>
                              <p className="font-medium text-blue-600">
                                {(8.9 + idx).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                    
                    </div>
                  )
                )}
              </ScrollArea>
            </div>
          ))}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
