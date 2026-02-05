import React from "react";
import { Breadcrumb } from "antd";
import CreateEmployeeForm from "./CreateEmployeeForm";
import { useUser } from "../../../store/useUser";
import { canCreate } from "../../../utils";

const CreateEmployee = () => {
  const { user } = useUser();
  const userPermissions = user?.permissions || {};
  return (
    <div className="m-2 p-2 md:p-10 bg-white rounded-3xl">
      {canCreate(userPermissions, "employees") && (
        <>
          <div className="mb-4">
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: "Trang chủ",
                },
                {
                  title: "Tạo nhân viên",
                },
              ]}
            />
          </div>

          <CreateEmployeeForm />
        </>
      )}
    </div>
  );
};
export default CreateEmployee;
