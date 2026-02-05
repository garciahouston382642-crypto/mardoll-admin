import React, { useState, useRef, useMemo } from "react";
import {
  Badge,
  Image,
  Input,
  InputRef,
  Modal,
  Popconfirm,
  Tooltip,
} from "antd";
import { Button, Space, Table, Breadcrumb } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { AiOutlineEye, AiTwotonePrinter } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import type {
  ColumnsType,
  FilterConfirmProps,
  ColumnType,
} from "antd/es/table/interface";

import {
  StatusColorType,
  StatusOnlineType,
  canDelete,
  canEdit,
  formatCurrency,
  formatNumber,
  getStatusColor,
  getStatusOnline,
} from "../../utils";
import dayjs, { Dayjs } from "dayjs";
import ColorButton from "../../components/ColorButton";
import { colors } from "../../styles/colors";
import { useQueryClient } from "react-query";
import { useContract } from "./useContract";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { ContractModel } from "../../models";
import EditContract from "./EditContract";
import { isEmpty, map, uniq } from "lodash";
import { v4 as uuid } from "uuid";
import { useUser } from "../../store/useUser";
import { PrintContract } from "../../components/ComponentToPrint/PrintContract";
const currentDate = dayjs();
const dateFormat = "DD-MM-YYYY";

type DataIndex = keyof ContractModel;

const Contract = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();
  const { data: contractData, isLoading, refetch, isFetching } = useContract();

  const collectionRef = collection(firestore, "contract");
  const [opened, setOpened] = useState(false);
  const { user } = useUser();
  const role = user?.permission || "";
  const userPermissions = user?.permissions || {};
  const [statusFilter, setStatusFilter] = useState<string[] | null>(null);
  const [defaultValues, setDefaultValues] = useState<ContractModel>({
    contractType: "",
    dressName: "",
    status: "",
    phone: "",
    address: "",
    createDate: "",
    dueDate: "",
    shottingDate: "",
    contractPrice: "",
    notes: [],
    contractImage: [],
    discount: "",
    contractTypeValuePrice: [],
    firstCheckDeposit: false,
    firstDepositPrice: "",
    firstDepositPriceDate: "",
    secondCheckDeposit: false,
    secondDepositPrice: "",
    secondDepositPriceDate: "",
    shootingDate: "",
    totalPrice: "",
    userName: "",
    servicesArisingPrice: "",
    firstPaymentMethod: "",
    secondPaymentMethod: "",
    servicesArisingItems: undefined,
    contractPriceItems: undefined,
    totalContractPrice: "",
    servicesArising: [],
    id: "",
  });

  // tạo danh sách trạng thái từ data (hoặc dùng constant riêng của bạn)
  const statusOptions = useMemo(
    () =>
      uniq(
        (contractData ?? []).map((x) => (x.status ?? "").trim()).filter(Boolean)
      ).map((s) => ({ text: s, value: s })),
    [contractData]
  );

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleEditContract = (record: ContractModel) => () => {
    setDefaultValues({
      ...record,
      createDate: dayjs(record.createDate) as any,
      dueDate: dayjs(record.dueDate) as any,
      shootingDate: dayjs(record.shootingDate) as any,
      firstDepositPriceDate: !isEmpty(record.firstDepositPriceDate)
        ? (dayjs(record.firstDepositPriceDate) as any)
        : undefined,
      secondDepositPriceDate: !isEmpty(record.secondDepositPriceDate)
        ? (dayjs(record.secondDepositPriceDate) as any)
        : undefined,
    });
    setOpened(true);
  };

  const handleCancel = () => {
    setOpened(false);
  };

  const handleDelete = (record: ContractModel) => async () => {
    const docRef = doc(collectionRef, record?.id);
    await deleteDoc(docRef);
    queryClient.invalidateQueries("contract");
    setTimeout(async () => await refetch(), 300);
  };

  const handlePrint = (record: ContractModel) => () => {
    console.log("record", record);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    type:
      | "contractType"
      | "phone"
      | "createDate"
      | "shootingDate" = "contractType"
  ): ColumnType<ContractModel> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => {
      const handleResetAll = () => {
        if (clearFilters) {
          handleReset(clearFilters);
          setTimeout(() => {
            handleSearch(selectedKeys as string[], confirm, dataIndex);
          }, 100);
        }
      };

      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={handleResetAll} size="small" style={{ width: 90 }}>
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: any, record: ContractModel) => {
      if (dataIndex === "createDate" || dataIndex === "shootingDate") {
        return dayjs(record[dataIndex])
          .format("DD/MM/YYYY")
          .toString()
          .includes(value as string);
      }
      return record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        ?.includes?.(value?.toLowerCase?.() as string);
      // ?.toLowerCase?.();
    },
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      if (type !== "contractType") {
        return (
          <>
            {searchedColumn === dataIndex ? (
              <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={
                  text
                    ? type === "createDate" || type === "shootingDate"
                      ? dayjs(text).format("DD/MM/YYYY").toString()
                      : text.toString()
                    : ""
                }
              />
            ) : type === "createDate" || type === "shootingDate" ? (
              dayjs(text).format("DD/MM/YYYY")
            ) : (
              text
            )}
          </>
        );
      }
      return (
        <div className="flex flex-col gap-2 items-center">
          {record?.contractImage.length > 0 ? (
            <div className="overflow-hidden rounded-lg drop-shadow-lg w-[40px] h-[40px]">
              <Image.PreviewGroup items={map(record?.contractImage, "url")}>
                <Image
                  src={record.contractImage?.[0]?.url}
                  width={40}
                  height={40}
                  preview={{
                    mask: <AiOutlineEye />,
                  }}
                />
              </Image.PreviewGroup>
            </div>
          ) : null}

          {searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text?.toString() : ""}
            />
          ) : (
            <p className="font-semibold text-base">{text}</p>
          )}
        </div>
      );
    },
  });

  const columns: ColumnsType<ContractModel> = [
    {
      title: "Tên hợp đồng",
      dataIndex: "contractType",
      key: "contractType",
      fixed: "left",
      width: "20%",
      ...getColumnSearchProps("contractType", "contractType"),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: statusOptions, // ⬅️ dropdown các trạng thái
      filterMultiple: true,
      filterSearch: true, // ô search trong dropdown
      onFilter: (value, record) =>
        (record.status ?? "").toLowerCase() === String(value).toLowerCase(),
      filteredValue: statusFilter ?? null, // (tuỳ chọn) controlled
      render: (text) => (
        <Badge
          color={getStatusColor(
            (`${text}`.toLowerCase() as StatusColorType) || "pending"
          )}
          text={text}
        />
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Kênh KH",
      dataIndex: "customerType",
      key: "customerType",
      sortDirections: ["descend", "ascend"],
       render: (text, record) => {
        console.log('text, ', text)
        return (
        <Badge
          color={getStatusOnline(
            (`${record?.customerType || 'offline'}`.toLowerCase() as StatusOnlineType) || "offline"
          )}
          text={record?.customerType || '--'}
        />
      )
       },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      // sorter: (a, b) => a.phone.length - b.phone.length,
      // sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("phone", "phone"),
    },
    {
      title: "Giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice.localeCompare(b.totalPrice),
      sortDirections: ["descend", "ascend"],
      render: (text: string) => {
        return <p>{formatCurrency(text)}</p>;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      // sorter: (a, b) => a.status.localeCompare(b.status),
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ngày ký hợp đồng",
      dataIndex: "createDate",
      key: "createDate",
      sorter: (a, b) => a.createDate.localeCompare(b.createDate),
      sortDirections: ["descend", "ascend"],
      // sorter: (a, b) =>
      //   dayjs(a.createDate).format("DD/MM/YYYY").length -
      //   dayjs(b.createDate).format("DD/MM/YYYY").length,
      // sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("createDate", "createDate"),
      // render: (text: string) => {
      //   return <p>{dayjs(text).format("DD/MM/YYYY")}</p>;
      // },
    },
    {
      title: "Ngày ngày bấm máy",
      dataIndex: "shootingDate",
      key: "shootingDate",
      sorter: (a, b) => a.shootingDate.localeCompare(b.shootingDate),
      sortDirections: ["descend", "ascend"],
      // sorter: (a, b) =>
      //   dayjs(a.createDate).format("DD/MM/YYYY").length -
      //   dayjs(b.createDate).format("DD/MM/YYYY").length,
      // sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("shootingDate", "shootingDate"),
      // render: (text: string) => {
      //   return <p>{dayjs(text).format("DD/MM/YYYY")}</p>;
      // },
    },
    {
      title: "Ngày hoàn thành",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
      sortDirections: ["descend", "ascend"],
      render: (text: string) => {
        return <p>{dayjs(text).format("DD/MM/YYYY")}</p>;
      },
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "editDelete",
      key: "editDelete",
      fixed: "right",
      width: "10%",
      render: (text, record) => (
        <div className="flex items-center gap-1">
          <Tooltip title="In hợp đồng">
            <PrintContract getValues={handlePrintContract(record)} />
          </Tooltip>
          {canEdit(userPermissions, "contracts") && (
            <Tooltip title="Chỉnh sửa">
              <ColorButton
                override={colors.primary}
                type="primary"
                size="small"
                icon={<FaEdit />}
                onClick={handleEditContract(record)}
              />
            </Tooltip>
          )}
          {canDelete(userPermissions, "contracts") && (
            <Tooltip title="Xoá">
              <Popconfirm
                title="Xóa hợp đồng"
                description="Bạn có chắc là muốn xóa hợp đồng?"
                icon={<QuestionCircleOutlined style={{ color: colors.red2 }} />}
                onConfirm={handleDelete(record)}
              >
                <ColorButton
                  override={colors.red2}
                  type="primary"
                  size="small"
                  disabled={role !== "admin"}
                  icon={<MdDeleteForever />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const handlePrintContract = (record: ContractModel) => () => {
    return {
      ...record,
    };
  };

  // if (user?.permission === "admin" || user?.permission === "manager") {
  //   columns.push({
  //     title: "Chỉnh sửa",
  //     dataIndex: "editDelete",
  //     key: "editDelete",
  //     fixed: "right",
  //     width: "10%",
  //     render: (text, record) => (
  //       <div className="flex items-center gap-1">
  //         <Tooltip title="In hợp đồng">
  //           <PrintContract getValues={handlePrintContract(record)} />
  //         </Tooltip>
  //         {user?.permission === "admin" ? (
  //           <>
  //             <Tooltip title="Chỉnh sửa">
  //               <ColorButton
  //                 override={colors.primary}
  //                 type="primary"
  //                 size="small"
  //                 icon={<FaEdit />}
  //                 onClick={handleEditContract(record)}
  //               />
  //             </Tooltip>

  //             <Tooltip title="Xoá">
  //               <Popconfirm
  //                 title="Xóa hợp đồng"
  //                 description="Bạn có chắc là muốn xóa hợp đồng?"
  //                 icon={
  //                   <QuestionCircleOutlined style={{ color: colors.red2 }} />
  //                 }
  //                 onConfirm={handleDelete(record)}
  //               >
  //                 <ColorButton
  //                   override={colors.red2}
  //                   type="primary"
  //                   size="small"
  //                   icon={<MdDeleteForever />}
  //                 />
  //               </Popconfirm>
  //             </Tooltip>
  //           </>
  //         ) : null}
  //       </div>
  //     ),
  //   });
  // }

  return (
    <div className="m-6 p-2 md:p-10 bg-white rounded-3xl">
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: "Trang chủ",
            },
            {
              title: "Danh sách hợp đồng",
            },
          ]}
        />
      </div>

      <Table
        rowKey={(record) => `${uuid()}-${record.id}`}
        columns={columns}
        dataSource={contractData}
        onChange={(_, filters) => setStatusFilter((filters.status as string[]) ?? null)}
        bordered
        scroll={{ x: 1300 }}
      />
      <Modal
        title="Cập nhật hợp đồng"
        open={opened}
        footer={null}
        onCancel={handleCancel}
        width={1000}
        bodyStyle={{
          overflowY: "scroll",
          height: "calc(100vh - 250px)",
        }}
      >
        <EditContract
          defaultValues={defaultValues}
          handleCancel={handleCancel}
          refetch={refetch}
        />
      </Modal>
    </div>
  );
};
export default Contract;
