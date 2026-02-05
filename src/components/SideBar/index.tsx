// import React from "react";

// import { Menu, MenuProps, Tag } from "antd";
// import { FaFileContract, FaRegListAlt } from "react-icons/fa";
// import { FcCalendar, FcSalesPerformance } from "react-icons/fc";
// import { GiAmpleDress, GiSaddle, GiTeamIdea } from "react-icons/gi";
// import { HiNewspaper, HiUser, HiUserGroup, HiUserPlus } from "react-icons/hi2";
// import {
//   MdAssignmentAdd,
//   MdOutlineContactPhone,
//   MdOutlinePlaylistAdd,
//   MdViewKanban,
// } from "react-icons/md";
// import { SiShopware } from "react-icons/si";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useUser } from "../../store/useUser";
// import { useWindowSizeMenu } from "../../store/useWindowSizeMenu";

// type MenuItem = Required<MenuProps>["items"][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: "group",
//   disabled?: boolean
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//     disabled,
//   } as MenuItem;
// }

// const SideBar: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useUser();
//   const { isActiveMenu, setIsActiveMenu } = useWindowSizeMenu();
//   const isAdmin = user?.permission === "Admin";
//   const isManager = user?.permission === "Manager";

//   const onClick: MenuProps["onClick"] = (e) => {
//     if (e.key === "manager-page/news-page") {
//       return window.open("https://mardoll-sanity.sanity.studio", "_blank");
//     }
//     navigate(`/${e.key}`);
//   };

//   const ecommerceItem = isAdmin
//     ? getItem(
//         "Dashboard",
//         "dashboard",
//         null,
//         [getItem("Ecommerce", "ecommerce", <FcSalesPerformance />)],
//         "group"
//       )
//     : null;
//   const employeesItem = isAdmin
//     ? getItem("Nhân viên", "employees", <HiUser />, [
//         getItem("Danh sách nhân viên", "employees-list", <HiUserGroup />),
//         getItem("Tạo nhân viên", "create-employees", <HiUserPlus />),
//       ])
//     : null;

//   const contractItem =
//     isAdmin || isManager
//       ? getItem("Hợp đồng", "contract", <FaFileContract />, [
//           getItem("Danh sách hợp đồng", "contract-list", <FaRegListAlt />),
//           getItem("Tạo hợp đồng", "create-contract", <MdOutlinePlaylistAdd />),
//           isAdmin
//             ? getItem(
//                 "Danh sách loại hợp đồng",
//                 "contract-type-list",
//                 <FaRegListAlt />
//               )
//             : null,
//           isAdmin
//             ? getItem(
//                 "Tạo loại hợp đồng",
//                 "create-contract-type",
//                 <MdOutlinePlaylistAdd />
//               )
//             : null,
//           isAdmin
//             ? getItem(
//                 "Danh sách danh mục phát",
//                 "services-arising-list",
//                 <FaRegListAlt />
//               )
//             : null,
//           isAdmin
//             ? getItem(
//                 "Tạo danh mục phát",
//                 "create-services-arising",
//                 <MdOutlinePlaylistAdd />
//               )
//             : null,
//         ])
//       : null;

//   const items: MenuItem[] = [
//     getItem(
//       <Link
//         to="/"
//         className="py-2 items-center justify-center gap-3 ml-3 flex text-xl font-extrabold tracking-tight text-slate-900"
//       >
//         <img
//           src="/marrdoll_studio_logo.jpeg"
//           className="object-cover w-[80px] h-[40px]"
//         />
//       </Link>,
//       "home",
//       null
//     ),
//     ecommerceItem,

//     getItem(
//       "Pages",
//       "pages",
//       null,
//       [
//         employeesItem,
//         contractItem,
//         getItem("Váy Cưới", "wedding-dress", <GiAmpleDress />, [
//           getItem("Danh sách váy cưới", "wedding-dress-list", <GiSaddle />),
//           getItem("Tạo váy cưới", "create-wedding-dress", <MdAssignmentAdd />),
//           getItem(
//             "Danh sách tên loại váy cưới",
//             "wedding-dress-type-list",
//             <MdAssignmentAdd />
//           ),
//           getItem(
//             "Tạo loại váy cưới",
//             "create-wedding-dress-type",
//             <MdAssignmentAdd />
//           ),
//         ]),
//         getItem("Quản lý thành viên", "manage-team", <GiTeamIdea />, [
//           getItem(
//             "Danh sách thành viên",
//             "team-management-list",
//             <GiTeamIdea />
//           ),
//           getItem("Tạo thành viên", "create-team-management", <HiUserPlus />),
//         ]),
//         getItem("Bảng giá", "price-wedding", <GiAmpleDress />, [
//           getItem("Danh sách bảng giá", "price-wedding-list", <GiSaddle />),
//           getItem("Tạo bảng giá", "create-price-wedding", <MdAssignmentAdd />),
//         ]),
//         getItem("Quản lý Trang", "manager-pages", <GiTeamIdea />, [
//           getItem("Trang chủ", "manager-page/home-page", <GiTeamIdea />),
//           getItem("Về chúng tôi", "manager-page/about-me-page", <HiUserPlus />),
//           getItem("Dịch vụ", "manager-page/services-page", <HiUserPlus />, [
//             getItem("Bảng giá", "manager-page/price-page", <HiUserPlus />),
//             getItem(
//               "Chụp album cưới",
//               "manager-page/wedding-album-page",
//               <HiUserPlus />
//             ),
//             getItem(
//               "Phóng sự ngày cưới",
//               "manager-page/wedding-day-reportage-page",
//               <HiUserPlus />
//             ),
//           ]),
//           // getItem(
//           //   "Váy cưới",
//           //   "manager-page/wedding-dress-page",
//           //   <HiUserPlus />
//           // ),
//           getItem("Liên hệ", "manager-page/contact-page", <HiUserPlus />),
//           getItem("Tin tức", "manager-page/news-page", <HiNewspaper />),
//         ]),
//         getItem(
//           "Thông tin liên hệ khách hàng",
//           "contacts-information",
//           <MdOutlineContactPhone />
//         ),
//       ],
//       "group"
//     ),
//     getItem(
//       "Apps",
//       "apps",
//       null,
//       [
//         getItem("Lịch đặt của khách hàng", "calendar", <FcCalendar />),
//         getItem("Lịch bấm máy của khách hàng", "shooting-date-calendar", <FcCalendar />),
//         getItem(
//           <div className="flex justify-between items-center">
//             <p>Kanban</p>
//             <Tag color="#f50">Sắp ra mắt</Tag>
//           </div>,
//           "kanban",
//           <MdViewKanban />,
//           undefined,
//           undefined,
//           true
//         ),
//       ],
//       "group"
//     ),
//     // getItem(
//     //   "Charts",
//     //   "chart",
//     //   null,
//     //   [
//     //     getItem("Bar Chart", "bar-chart", <PieChartOutlined />),
//     //     getItem("Line Chart", "line-chart", <PieChartOutlined />),
//     //   ],
//     //   "group"
//     // ),
//   ];

//   return (
//     <div className="max-h-full overflow-auto">
//       {/* <Button
//         type='primary'
//         onClick={toggleCollapsed}
//         style={{ marginBottom: 16 }}
//       >
//         {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//       </Button> */}
//       {isActiveMenu && (
//         <div className="w-72 fixed sidebar bg-white overflow-y-auto">
//           <Menu
//             defaultSelectedKeys={["1"]}
//             defaultOpenKeys={["sub1"]}
//             mode="inline"
//             theme="light"
//             style={{
//               overflow: "auto",
//               height: "100vh",
//             }}
//             selectedKeys={[location.pathname.replace("/", "")]}
//             onClick={onClick}
//             inlineCollapsed={false}
//             items={items}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SideBar;

import React from "react";
import { Menu, MenuProps } from "antd";
import { FaFileContract, FaRegListAlt } from "react-icons/fa";
import { FcCalendar, FcSalesPerformance } from "react-icons/fc";
import { GiAmpleDress, GiSaddle, GiTeamIdea } from "react-icons/gi";
import { HiNewspaper, HiUser, HiUserGroup, HiUserPlus } from "react-icons/hi2";
import {
  MdAssignmentAdd,
  MdOutlineContactPhone,
  MdOutlinePlaylistAdd,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../store/useUser";
import { useWindowSizeMenu } from "../../store/useWindowSizeMenu";
import { canCreate, canViewItem } from "../../utils";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  disabled?: boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    disabled,
  } as MenuItem;
}

type PermissionKey =
  | "ecommerce"
  | "employees"
  | "contracts"
  | "wedding-dresses"
  | "member-management"
  | "pricing"
  | "page-management"
  | "customer-contact"
  | "booking-schedule"
  | "machine-schedule";

const permissions: Partial<Record<PermissionKey, string[]>> = {
  // ecommerce: ["view", "create", "edit", "delete"],
  // employees: ["view", "create", "edit", "delete"],
  // contracts: ["view", "create", "edit", "delete"],
  // "wedding-dresses": ["view", "create", "edit", "delete"],
  // "member-management": ["view", "create", "edit", "delete"],
  // pricing: ["view", "create", "edit", "delete"],
  // "page-management": ["view", "create", "edit", "delete"],
  // "customer-contact": ["view", "create", "edit", "delete"],
  // "booking-schedule": ["view", "create", "edit", "delete"],
  "machine-schedule": ["view", "create", "edit", "delete"],
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const userPermissions = user?.permissions || {};
  const isAdmin = user?.permission === "admin";
  const { isActiveMenu } = useWindowSizeMenu();

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "manager-page/news-page") {
      return window.open("https://mardoll-sanity.sanity.studio", "_blank");
    }
    navigate(`/${e.key}`);
  };

  const ecommerceItem = canViewItem(
    "ecommerce",
    getItem(
      "Dashboard",
      "dashboard",
      null,
      [getItem("Ecommerce", "ecommerce", <FcSalesPerformance />)],
      "group"
    ),
    userPermissions
  );

  const employeesItem = canViewItem(
    "employees",
    getItem("Nhân viên", "employees", <HiUser />, [
      getItem("Danh sách nhân viên", "employees-list", <HiUserGroup />),
      canCreate(userPermissions, "employees")
        ? getItem("Tạo nhân viên", "create-employees", <HiUserPlus />)
        : null,
    ]),
    userPermissions
  );

  const contractItem = canViewItem(
    "contracts",
    getItem("Hợp đồng", "contract", <FaFileContract />, [
      getItem("Danh sách hợp đồng", "contract-list", <FaRegListAlt />),

      canCreate(userPermissions, "contracts")
        ? getItem("Tạo hợp đồng", "create-contract", <MdOutlinePlaylistAdd />)
        : null,
      ...(isAdmin
      ? [
          getItem(
            "Danh sách loại hợp đồng",
            "contract-type-list",
            <FaRegListAlt />
          ),
          getItem(
            "Tạo loại hợp đồng",
            "create-contract-type",
            <MdOutlinePlaylistAdd />
          ),
          getItem(
            "Danh sách danh mục phát",
            "services-arising-list",
            <FaRegListAlt />
          ),
          getItem(
            "Tạo danh mục phát",
            "create-services-arising",
            <MdOutlinePlaylistAdd />
          ),
        ]
      : []),
    ]),
    userPermissions
  );

  const pageChildren: MenuItem[] = [
    employeesItem,
    contractItem,
    canViewItem(
      "wedding-dresses",
      getItem("Váy Cưới", "wedding-dress", <GiAmpleDress />, [
        getItem("Danh sách váy cưới", "wedding-dress-list", <GiSaddle />),
        getItem("Tạo váy cưới", "create-wedding-dress", <MdAssignmentAdd />),
      ]),
      userPermissions
    ),
    canViewItem(
      "member-management",
      getItem("Quản lý thành viên", "manage-team", <GiTeamIdea />, [
        getItem("Danh sách thành viên", "team-management-list", <GiTeamIdea />),
        getItem("Tạo thành viên", "create-team-management", <HiUserPlus />),
      ]),
      userPermissions
    ),
    canViewItem(
      "pricing",
      getItem("Bảng giá", "price-wedding", <GiAmpleDress />, [
        getItem("Danh sách bảng giá", "price-wedding-list", <GiSaddle />),
        getItem("Tạo bảng giá", "create-price-wedding", <MdAssignmentAdd />),
      ]),
      userPermissions
    ),
    canViewItem(
      "page-management",
      getItem("Quản lý Trang", "manager-pages", <GiTeamIdea />, [
        getItem("Trang chủ", "manager-page/home-page", <GiTeamIdea />),
        getItem("Về chúng tôi", "manager-page/about-me-page", <HiUserPlus />),
        getItem("Dịch vụ", "manager-page/services-page", <HiUserPlus />, [
          getItem("Bảng giá", "manager-page/price-page", <HiUserPlus />),
          getItem(
            "Chụp album cưới",
            "manager-page/wedding-album-page",
            <HiUserPlus />
          ),
        ]),
        getItem("Liên hệ", "manager-page/contact-page", <HiUserPlus />),
        getItem("Tin tức", "manager-page/news-page", <HiNewspaper />),
      ]),
      userPermissions
    ),
    canViewItem(
      "customer-contact",
      getItem(
        "Thông tin liên hệ khách hàng",
        "contacts-information",
        <MdOutlineContactPhone />
      ),
      userPermissions
    ),
  ].filter((i): i is MenuItem => i !== null);

  const appsChildren: MenuItem[] = [
    canViewItem(
      "booking-schedule",
      getItem("Lịch đặt của khách hàng", "calendar", <FcCalendar />),
      userPermissions
    ),
    canViewItem(
      "machine-schedule",
      getItem(
        "Lịch bấm máy của khách hàng",
        "shooting-date-calendar",
        <FcCalendar />
      ),
      userPermissions
    ),
  ].filter((i): i is MenuItem => i !== null);

  const items: MenuItem[] = [
    getItem(
      <Link
        to="/"
        className="grid place-items-center"
        // className="py-2 items-center gap-3 ml-3 flex text-xl font-extrabold text-slate-900"
      >
        <img
          src="/marrdoll_studio_logo.jpeg"
          className="object-cover w-[80px] h-[40px]"
        />
      </Link>,
      "home",
      null
    ),
    ecommerceItem,
    getItem("Quản lý", "pages", null, pageChildren, "group"),
    getItem("Lịch", "apps", null, appsChildren, "group"),
  ].filter((i): i is MenuItem => i !== null);

  return (
    <div className="max-h-full overflow-auto">
      {isActiveMenu && (
        <div
          className="w-72 fixed sidebar bg-white"
          style={{ height: "100vh", overflowY: "auto" }}
        >
          <Menu
            selectedKeys={[location.pathname.replace("/", "")]}
            onClick={onClick}
            mode="inline"
            theme="light"
            items={items}
          />
        </div>
      )}
    </div>
  );
};

export default SideBar;
