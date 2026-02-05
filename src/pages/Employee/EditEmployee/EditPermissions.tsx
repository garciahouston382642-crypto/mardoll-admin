import { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Button,
  Badge,
  Tabs,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Table,
  Tag,
  Select,
  Alert,
  Modal,
  App
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
  SettingOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserSwitchOutlined,
  SaveOutlined
} from "@ant-design/icons";
import permissionsData from "./permissions-data.json";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { EmployeeModel } from "../../../models";
import { useQueryClient } from "react-query";
import { firestore } from "../../../lib/firebase";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface Permission {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CrudOperation {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface UserProfile {
  id: string;
  name: string;
  description: string;
  permissions: {[key: string]: string[]};
}

const crudOperations: CrudOperation[] = [
  {
    id: "view",
    name: "Xem",
    icon: <EyeOutlined />,
    color: "blue"
  },
  {
    id: "create",
    name: "Thêm",
    icon: <PlusOutlined />,
    color: "green"
  },
  {
    id: "edit",
    name: "Sửa",
    icon: <EditOutlined />,
    color: "orange"
  },
  {
    id: "delete",
    name: "Xoá",
    icon: <DeleteOutlined />,
    color: "red"
  }
];

const permissions: Permission[] = [
  {
    id: "ecommerce",
    name: "Ecommerce",
    icon: <ShoppingCartOutlined className="text-lg" />,
    description: "Quản lý cửa hàng trực tuyến và bán hàng"
  },
  {
    id: "employees",
    name: "Nhân viên",
    icon: <UserOutlined className="text-lg" />,
    description: "Quản lý thông tin và phân quyền nhân viên"
  },
  {
    id: "contracts",
    name: "Hợp đồng",
    icon: <FileTextOutlined className="text-lg" />,
    description: "Quản lý hợp đồng và tài liệu pháp lý"
  },
  {
    id: "wedding-dresses",
    name: "Váy Cưới",
    icon: <HomeOutlined className="text-lg" />,
    description: "Quản lý danh mục váy cưới và trang phục"
  },
  {
    id: "member-management",
    name: "Quản lý thành viên",
    icon: <TeamOutlined className="text-lg" />,
    description: "Quản lý hội viên và khách hàng thân thiết"
  },
  {
    id: "pricing",
    name: "Bảng giá",
    icon: <DollarOutlined className="text-lg" />,
    description: "Quản lý giá cả và chính sách giá"
  },
  {
    id: "page-management",
    name: "Quản lý Trang",
    icon: <SettingOutlined className="text-lg" />,
    description: "Quản lý nội dung trang web và CMS"
  },
  {
    id: "customer-contact",
    name: "Thông tin liên hệ khách hàng",
    icon: <PhoneOutlined className="text-lg" />,
    description: "Quản lý thông tin liên hệ và CSKH"
  },
  {
    id: "booking-schedule",
    name: "Lịch đặt của khách hàng",
    icon: <CalendarOutlined className="text-lg" />,
    description: "Quản lý lịch hẹn và đặt chỗ"
  },
  {
    id: "machine-schedule",
    name: "Lịch bấm máy của khách hàng",
    icon: <ClockCircleOutlined className="text-lg" />,
    description: "Quản lý lịch chụp ảnh và sử dụng thiết bị"
  }
];

const getOperationBgClass = (color: string) => {
  switch (color) {
    case 'blue': return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'green': return 'bg-green-50 border-green-200 text-green-700';
    case 'orange': return 'bg-orange-50 border-orange-200 text-orange-700';
    case 'red': return 'bg-red-50 border-red-200 text-red-700';
    default: return 'bg-gray-50 border-gray-200';
  }
};

export default function EditPermissions({ data, refetch, handleCancel }: { data: EmployeeModel, refetch: () => void, handleCancel: () => void }) {
  // console.log('data', data?.permission)
  const queryClient = useQueryClient();
    const employeeRef = collection(firestore, "employee");
  const [selectedPermissions, setSelectedPermissions] = useState<{[key: string]: string[]}>({});
  const [activeTab, setActiveTab] = useState("permissions");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(true);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);

  useEffect(() => {
    if (data?.permission) {
      setSelectedProfile(data?.permission);
       const profile = permissionsData.userProfiles.find(p => p.id === data?.permission);
       const mapProfile = {
         ...profile,
         permissions: data?.permissions ?? {}
       };
      if (profile) {
       
        // Map user permissions data to UI with validation
        const mappedPermissions = mapUserPermissionsToUI((mapProfile as any).permissions);
        setSelectedPermissions(mappedPermissions);

        // Log for debugging
        console.log('Profile loaded:', profile.name);
        console.log('Original permissions:', mapProfile.permissions);
        console.log('Mapped to UI:', mappedPermissions);
        console.log('Summary:', getPermissionSummary(mappedPermissions));
      }
    }
  }, [data])

  // Load permissions from selected profile
  useEffect(() => {
    if (selectedProfile && !isCustomMode) {
      const profile = permissionsData.userProfiles.find(p => p.id === selectedProfile);

      if (profile) {
       
        // Map user permissions data to UI with validation
        const mappedPermissions = mapUserPermissionsToUI((profile as any).permissions);
        setSelectedPermissions(mappedPermissions);

        // Log for debugging
        console.log('Profile loaded:', profile.name);
        console.log('Original permissions:', profile.permissions);
        console.log('Mapped to UI:', mappedPermissions);
        console.log('Summary:', getPermissionSummary(mappedPermissions));
      }
    }
  }, [selectedProfile, isCustomMode]);

  const handleProfileChange = (profileId: string) => {
    setSelectedProfile(profileId);
    setIsCustomMode(false);
  };

  const handleCustomMode = () => {
    setIsCustomMode(true);
    // Keep selectedProfile, don't reset it
  };

  const handleSavePermissions = async () => {
    const currentProfile = selectedProfile ?
      permissionsData.userProfiles.find(p => p.id === selectedProfile) : null;

    const result = {
      baseProfile: currentProfile ? {
        id: currentProfile.id,
        name: currentProfile.name,
        description: currentProfile.description
      } : null,
      isCustomized: isCustomMode,
      permissions: selectedPermissions,
      summary: {
        totalModules: getTotalPermissionsCount(),
        totalOperations: Object.values(selectedPermissions).flat().length,
        editableModules: Object.values(selectedPermissions).filter(ops => ops.includes('edit')).length,
        deletableModules: Object.values(selectedPermissions).filter(ops => ops.includes('delete')).length
      },
      timestamp: new Date().toISOString()
    };
    const docRef = doc(employeeRef, data.id);
     const payload = {
            ...data,
            permission: result?.baseProfile?.id,
            permissions: result?.permissions,
          };
          await updateDoc(docRef, payload);
          queryClient.invalidateQueries("employee");
          setTimeout(async () => await refetch(), 300);

    setSavedData(result);
    // setSaveModalVisible(true);
     toast.success("Đã lưu cấu hình quyền thành công!", {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                  handleCancel?.();
    // message.success('Đã lưu cấu hình quyền thành công!');
    return result;
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setIsCustomMode(true); // Switch to custom mode when manually changing permissions
    // Keep selectedProfile, don't reset it

    if (checked) {
      setSelectedPermissions(prev => ({
        ...prev,
        [permissionId]: ["view"]
      }));
    } else {
      setSelectedPermissions(prev => {
        const newState = { ...prev };
        delete newState[permissionId];
        return newState;
      });
    }
  };

  const handleCrudChange = (permissionId: string, operation: string, checked: boolean) => {
    setIsCustomMode(true); // Switch to custom mode when manually changing CRUD permissions
    // Keep selectedProfile, don't reset it

    setSelectedPermissions(prev => {
      const currentOps = prev[permissionId] || [];
      if (checked) {
        return {
          ...prev,
          [permissionId]: [...currentOps, operation]
        };
      } else {
        return {
          ...prev,
          [permissionId]: currentOps.filter(op => op !== operation)
        };
      }
    });
  };

  const getSelectedPermissions = () => {
    return permissions.filter(p => selectedPermissions[p.id]?.length > 0);
  };

  const getTotalPermissionsCount = () => {
    return Object.keys(selectedPermissions).filter(key => selectedPermissions[key].length > 0).length;
  };

  // Helper function to validate and map user permissions to UI
  const mapUserPermissionsToUI = (userPermissions: {[key: string]: string[]}) => {
    const validPermissions: {[key: string]: string[]} = {};

    // Ensure all permission modules exist and have valid operations
    permissions.forEach(permission => {
      const userOps = userPermissions[permission.id] || [];
      const validOps = userOps.filter(op =>
        crudOperations.some(crudOp => crudOp.id === op)
      );

      if (validOps.length > 0) {
        validPermissions[permission.id] = validOps;
      }
    });

    return validPermissions;
  };

  // Helper function to get permission summary for display
  const getPermissionSummary = (perms: {[key: string]: string[]}) => {
    const modules = Object.keys(perms).filter(key => perms[key].length > 0);
    const totalOps = Object.values(perms).flat().length;
    const editableModules = Object.values(perms).filter(ops => ops.includes('edit')).length;
    const deletableModules = Object.values(perms).filter(ops => ops.includes('delete')).length;

    return {
      totalModules: modules.length,
      totalOperations: totalOps,
      editableModules,
      deletableModules,
      modulesList: modules
    };
  };

  // Demo function to test mapping with detailed logging
  const demoJSONMapping = (profileId: string) => {
    const profile = permissionsData.userProfiles.find(p => p.id === profileId);
    if (!profile) return;

    console.group(`🎯 DEMO MAPPING: ${profile.name}`);
    console.log('📄 Original JSON Data:', profile);
    console.log('🔍 Permissions Object:', profile.permissions);

    // Test mapping
    const mapped = mapUserPermissionsToUI((profile as any).permissions);
    console.log('✅ Mapped to UI:', mapped);

    // Show mapping details for each module
    Object.entries(profile.permissions).forEach(([moduleId, operations]) => {
      const moduleName = permissions.find(p => p.id === moduleId)?.name || moduleId;
      console.log(`📋 ${moduleName} (${moduleId}):`, {
        original: operations ,
        mapped: mapped[moduleId] || [],
        uiDisplay: operations.map((op: string) => {
          const crudOp = crudOperations.find(c => c.id === op);
          return crudOp ? `${crudOp.name} (${op})` : op;
        })
      });
    });

    const summary = getPermissionSummary(mapped);
    console.log('�� Summary:', summary);
    console.groupEnd();

    // Apply to UI
    handleProfileChange(profileId);
  };

  // Mock table data for preview
  const mockTableColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: () => <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: () => <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
      render: () => <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => {
        const firstPermission = getSelectedPermissions()[0];
        const ops = firstPermission ? selectedPermissions[firstPermission.id] || [] : [];
        
        return (
          <Space>
            {ops.includes('view') && (
              <Button type="text" size="small" icon={<EyeOutlined />} />
            )}
            {ops.includes('edit') && (
              <Button type="text" size="small" icon={<EditOutlined />} />
            )}
            {ops.includes('delete') && (
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            )}
          </Space>
        );
      }
    }
  ];

  const mockTableData = [
    { key: '1' },
    { key: '2' },
    { key: '3' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafetyOutlined className="text-white text-xl" />
              </div>
              <div>
                <Title level={2} className="!mb-1">Quản lý quyền truy cập</Title>
                <Text type="secondary">Cấu hình và xem trước quyền hạn người dùng</Text>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <UserSwitchOutlined />
                <Text strong>Chọn vai trò:</Text>
                <Select
                  style={{ width: 200 }}
                  placeholder="Chọn vai trò sẵn có"
                  value={selectedProfile}
                  onChange={handleProfileChange}
                  allowClear
                  onClear={handleCustomMode}
                >
                  {permissionsData.userProfiles.map(profile => (
                    <Option key={profile.id} value={profile.id}>
                      {profile.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Badge
                count={`${getTotalPermissionsCount()} quyền đã chọn`}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSavePermissions}
                disabled={getTotalPermissionsCount() === 0}
              >
                Lưu quyền
              </Button>
              <Button
                type={activeTab === "preview" ? "primary" : "default"}
                icon={<EyeOutlined />}
                onClick={() => setActiveTab(activeTab === "preview" ? "permissions" : "preview")}
              >
                {activeTab === "preview" ? "Chỉnh sửa quyền" : "Xem trước"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          className="mb-8"
        >
          <TabPane 
            tab={
              <span>
                <SafetyOutlined />
                Cấu hình quyền
              </span>
            } 
            key="permissions"
          >
            <Space direction="vertical" size="large" className="w-full">
              {/* Profile Information Alert */}
              {selectedProfile && !isCustomMode && (
                <Space direction="vertical" size="middle" className="w-full">
                  <Alert
                    type="info"
                    showIcon
                    message={
                      <div>
                        <Text strong>Đang sử dụng vai trò: {permissionsData.userProfiles.find(p => p.id === selectedProfile)?.name}</Text>
                        <br />
                        <Text type="secondary">
                          {permissionsData.userProfiles.find(p => p.id === selectedProfile)?.description}
                        </Text>
                      </div>
                    }
                    action={
                      <Button size="small" onClick={handleCustomMode}>
                        Tùy chỉnh quyền
                      </Button>
                    }
                  />

                </Space>
              )}

              {isCustomMode && (
                <Alert
                  type="warning"
                  showIcon
                  message={`Chế độ tùy chỉnh${selectedProfile ? ` (Dựa trên: ${permissionsData.userProfiles.find(p => p.id === selectedProfile)?.name})` : ''}`}
                  description={
                    selectedProfile ?
                      "Bạn đang tùy chỉnh quyền dựa trên vai trò đã chọn. Các thay đổi sẽ được lưu riêng biệt." :
                      "Bạn đang tùy chỉnh quyền thủ công. Chọn một vai trò ở trên để sử dụng cấu hình có sẵn làm cơ sở."
                  }
                  action={
                    !selectedProfile ? (
                      <Space wrap>
                        <Button size="small" type="primary" onClick={() => demoJSONMapping('admin')}>
                          Demo Admin
                        </Button>
                        <Button size="small" onClick={() => demoJSONMapping('sale')}>
                          Demo Sale
                        </Button>
                        <Button size="small" onClick={() => demoJSONMapping('marketing')}>
                          Demo Marketing
                        </Button>
                      </Space>
                    ) : (
                      <Button size="small" onClick={() => setIsCustomMode(false)}>
                        Về vai trò gốc
                      </Button>
                    )
                  }
                  className="mb-4"
                />
              )}

              <Card>
                <Title level={4} className="!mb-2">
                  <SafetyOutlined className="text-blue-600 mr-2" />
                  Chọn quyền truy cập
                </Title>
                <Paragraph type="secondary" className="!mb-6">
                  Chọn các quyền mà người dùng có thể truy cập trong hệ thống
                </Paragraph>
                
                <Row gutter={[24, 24]}>
                  {permissions.map((permission) => {
                    const isSelected = selectedPermissions[permission.id]?.length > 0;
                    const selectedOps = selectedPermissions[permission.id] || [];
                    
                    return (
                      <Col xs={24} md={12} lg={8} key={permission.id}>
                        <Card
                          size="small"
                          className={`transition-all duration-200 ${
                            !isCustomMode ? 'opacity-75' : 'cursor-pointer hover:shadow-lg'
                          } ${
                            isSelected
                              ? 'border-blue-300 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
                          }`}
                          bodyStyle={{ padding: '20px' }}
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <Checkbox
                              checked={isSelected}
                              disabled={!isCustomMode}
                              onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-2 rounded transition-colors ${
                                  isSelected
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}>
                                  {permission.icon}
                                </div>
                                <Title level={5} className="!mb-0 !text-sm">
                                  {permission.name}
                                </Title>
                              </div>
                              <Text type="secondary" className="text-xs leading-relaxed">
                                {permission.description}
                              </Text>
                            </div>
                          </div>

                          {/* CRUD Operations */}
                          {isSelected && (
                            <div className="ml-7">
                              <div className="flex items-center gap-2 mb-3">
                                <SafetyOutlined className="text-blue-600 text-xs" />
                                <Text strong className="text-xs text-blue-900">Quyền thao tác</Text>
                              </div>
                              <Row gutter={[8, 8]}>
                                {crudOperations.map((operation) => (
                                  <Col span={12} key={operation.id}>
                                    <div className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                      selectedOps.includes(operation.id)
                                        ? getOperationBgClass(operation.color)
                                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                    }`}>
                                      <Checkbox
                                        checked={selectedOps.includes(operation.id)}
                                        disabled={!isCustomMode}
                                        onChange={(e) =>
                                          handleCrudChange(permission.id, operation.id, e.target.checked)
                                        }
                                        className="w-full"
                                      >
                                        <div className="flex items-center gap-1">
                                          {operation.icon}
                                          <Text className="text-xs font-medium">{operation.name}</Text>
                                        </div>
                                      </Checkbox>
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Card>

              {/* Summary Card */}
              <Card>
                <Title level={4} className="!mb-4">Tóm tắt quyền đã chọn</Title>
                {getTotalPermissionsCount() > 0 ? (
                  <Space direction="vertical" size="large" className="w-full">
                    {/* Statistics */}
                    <Row gutter={16}>
                      <Col span={6}>
                        <Card size="small" className="text-center bg-blue-50 border-blue-200">
                          <Text strong className="text-blue-600 text-lg">{getTotalPermissionsCount()}</Text>
                          <br />
                          <Text type="secondary" className="text-xs">Mô-đun được cấp quyền</Text>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" className="text-center bg-green-50 border-green-200">
                          <Text strong className="text-green-600 text-lg">
                            {Object.values(selectedPermissions).flat().length}
                          </Text>
                          <br />
                          <Text type="secondary" className="text-xs">Tổng số quyền thao tác</Text>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" className="text-center bg-orange-50 border-orange-200">
                          <Text strong className="text-orange-600 text-lg">
                            {Object.values(selectedPermissions).filter(ops => ops.includes('edit')).length}
                          </Text>
                          <br />
                          <Text type="secondary" className="text-xs">Có quyền chỉnh sửa</Text>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" className="text-center bg-red-50 border-red-200">
                          <Text strong className="text-red-600 text-lg">
                            {Object.values(selectedPermissions).filter(ops => ops.includes('delete')).length}
                          </Text>
                          <br />
                          <Text type="secondary" className="text-xs">Có quyền xóa</Text>
                        </Card>
                      </Col>
                    </Row>

                    <Divider />

                    {/* Detailed Permissions */}
                    {getSelectedPermissions().map((permission) => {
                      const ops = selectedPermissions[permission.id] || [];
                      return (
                        <Card size="small" key={permission.id} className="bg-gray-50">
                          <div className="flex items-center gap-2 mb-3">
                            {permission.icon}
                            <Text strong>{permission.name}</Text>
                            <Badge count={ops.length} size="small" style={{ backgroundColor: '#52c41a' }} />
                          </div>
                          <Space wrap>
                            {ops.map((opId) => {
                              const operation = crudOperations.find(op => op.id === opId);
                              return operation ? (
                                <Tag
                                  key={opId}
                                  color={operation.color}
                                  icon={operation.icon}
                                >
                                  {operation.name}
                                </Tag>
                              ) : null;
                            })}
                          </Space>
                        </Card>
                      );
                    })}
                  </Space>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SafetyOutlined className="text-gray-400 text-2xl" />
                    </div>
                    <Title level={4} type="secondary">Chưa có quyền nào được chọn</Title>
                    <Text type="secondary">Hãy chọn một vai trò ở trên hoặc tùy chỉnh quyền thủ công</Text>
                  </div>
                )}
              </Card>
            </Space>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <EyeOutlined />
                Xem trước giao diện
              </span>
            } 
            key="preview"
          >
            <Card>
              <Title level={4} className="!mb-2">
                <EyeOutlined className="text-blue-600 mr-2" />
                Xem trước giao diện admin
              </Title>
              <Paragraph type="secondary" className="!mb-6">
                Đây là giao diện mà người dùng sẽ thấy với các quyền đã được cấp
              </Paragraph>

              {getTotalPermissionsCount() === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafetyOutlined className="text-gray-400 text-3xl" />
                  </div>
                  <Title level={3} type="secondary">Chưa có quyền nào ��ược chọn</Title>
                  <Paragraph type="secondary" className="mb-6">
                    Vui lòng chọn ít nhất một quyền để xem trước giao diện
                  </Paragraph>
                  <Button type="primary" onClick={() => setActiveTab("permissions")}>
                    Chọn quyền
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Mock Admin Dashboard */}
                  <Card className="bg-gray-50">
                    <div className="flex items-center justify-between mb-6">
                      <Title level={3} className="!mb-0">Dashboard Admin</Title>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Text type="secondary">Hoạt động</Text>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <Tabs 
                      type="line" 
                      className="mb-6"
                      items={getSelectedPermissions().map((permission, index) => {
                        const ops = selectedPermissions[permission.id] || [];
                        return {
                          key: permission.id,
                          label: (
                            <span className="flex items-center gap-2">
                              {permission.icon}
                              {permission.name}
                              <Badge count={ops.length} size="small" />
                            </span>
                          ),
                          children: (
                            <Card>
                              <div className="flex items-center gap-3 mb-4">
                                {permission.icon}
                                <Title level={4} className="!mb-0">{permission.name}</Title>
                              </div>
                              <Paragraph type="secondary" className="mb-6">
                                {permission.description}
                              </Paragraph>

                              {/* Available Operations */}
                              <div className="mb-6">
                                <Title level={5} className="!mb-3">Quyền thao tác được cấp</Title>
                                <Space wrap>
                                  {ops.map((opId) => {
                                    const operation = crudOperations.find(op => op.id === opId);
                                    return operation ? (
                                      <Tag 
                                        key={opId}
                                        color={operation.color}
                                        icon={operation.icon}
                                      >
                                        {operation.name}
                                      </Tag>
                                    ) : null;
                                  })}
                                </Space>
                              </div>
                              
                              {/* Mock Data Table */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <Title level={5} className="!mb-0">Dữ liệu mẫu</Title>
                                  {ops.includes('create') && (
                                    <Button type="primary" size="small" icon={<PlusOutlined />}>
                                      Thêm mới
                                    </Button>
                                  )}
                                </div>
                                
                                <Table 
                                  columns={mockTableColumns}
                                  dataSource={mockTableData}
                                  pagination={false}
                                  size="small"
                                />
                              </div>
                            </Card>
                          )
                        };
                      })}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <EyeOutlined className="text-white text-xs" />
                        </div>
                        <div>
                          <Title level={5} className="!mb-1 !text-blue-900">
                            Lưu ý về xem trước
                          </Title>
                          <Text className="text-blue-700 text-sm">
                            Đây là bản xem trước mô phỏng. Trong thực tế, người dùng chỉ có thể truy cập các tab và chức năng tương ứng với quyền đã được cấp.
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* Save Modal */}
      <Modal
        title="Dữ liệu quyền đã lưu"
        open={saveModalVisible}
        onCancel={() => setSaveModalVisible(false)}
        footer={[
          <Button key="copy" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(savedData, null, 2));
            // message.success('Đã copy dữ liệu vào clipboard!');
             toast.success("Đã copy dữ liệu vào clipboard!", {
                    position: toast.POSITION.TOP_RIGHT,
                  });
          }}>
            Copy JSON
          </Button>,
          <Button key="close" type="primary" onClick={() => setSaveModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={1200}
      >
        {savedData && (
          <div>
            <Alert
              type="success"
              message={`Đã lưu thành công cấu hình quyền${savedData.baseProfile ? ` cho vai trò "${savedData.baseProfile.name}"` : ' tùy chỉnh'}`}
              description={
                <div>
                  <p><strong>Tổng số mô-đun:</strong> {savedData.summary.totalModules}</p>
                  <p><strong>Tổng quyền thao tác:</strong> {savedData.summary.totalOperations}</p>
                  <p><strong>Có thể chỉnh sửa:</strong> {savedData.summary.editableModules} mô-đun</p>
                  <p><strong>Có thể xóa:</strong> {savedData.summary.deletableModules} mô-đun</p>
                  <p><strong>Thời gian lưu:</strong> {new Date(savedData.timestamp).toLocaleString('vi-VN')}</p>
                </div>
              }
              className="mb-4"
            />

            {/* <Typography.Title level={5}>Dữ liệu JSON:</Typography.Title>
            <div className="bg-gray-50 p-4 rounded-lg overflow-auto" style={{maxHeight: '400px'}}>
              <pre className="text-xs">
                {JSON.stringify(savedData, null, 2)}
              </pre>
            </div> */}
          </div>
        )}
      </Modal>
    </div>
  );
}
