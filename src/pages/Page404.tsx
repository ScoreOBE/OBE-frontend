import { ROUTE_PATH } from "@/helpers/constants/route";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-screen h-screen gap-10 font-sf-pro-rounded font-extrabold justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <p className="text-9xl font-bold">404</p>
        <p className="text-3xl font-bold">Page Not Found</p>
      </div>
      <Button onClick={() => navigate(ROUTE_PATH.LOGIN)}>
        Go Home
      </Button>
    </div>
  );
}
