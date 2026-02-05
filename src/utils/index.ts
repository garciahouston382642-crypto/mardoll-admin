import { MenuProps } from "antd";
import { chain, isEmpty, isNil } from "lodash";

export type StatusColorType =
  | "pending"
  | "active"
  | "complete"
  | "rejected"
  | "canceled";

export type StatusOnlineType = "online" | "offline";

const getStatusColor = (color: StatusColorType = "pending") => {
  const defaultColor = {
    pending: "orange",
    active: "cyan",
    complete: "green",
    rejected: "red",
    canceled: "red",
  };
  return defaultColor[color];
};

const getStatusOnline = (color: StatusOnlineType = "offline") => {
  const defaultColor = {
    offline: "gray",
    online: "green",
  };
  return defaultColor[color];
};

function generateSlugUrl(str: string) {
  // Remove diacritics
  str = str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    ?.replace("đ", "d");
  // Replace spaces with hyphens and convert to lowercase
  str = str?.replace(/\s+/g, "-").toLowerCase();
  return str;
}

const regexPassword =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const isVietnamesePhoneNumber = (number: string) => {
  return /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/.test(number);
};

const formatCurrency = (number: string) => {
  if (isNil(number) || isEmpty(number)) return "--";
  return parseInt(number).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const formatNumber = (num: number) => {
  if (num === 0) return `${num.toString()}`;
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(0)} tỷ`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(0)} tr`;
  } else {
    return `${(num / 1000).toFixed(0)} k`;
  }
};

export {
  isVietnamesePhoneNumber,
  formatCurrency,
  getStatusColor,
  getStatusOnline,
  regexPassword,
  formatNumber,
  generateSlugUrl,
};

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

type MenuItem = Required<MenuProps>["items"][number];

export const canView = (
  permissions: Partial<Record<PermissionKey, string[]>>,
  key: PermissionKey
) => {
  return permissions?.[key]?.includes("view");
};

export const canCreate = (
  permissions: Partial<Record<PermissionKey, string[]>>,
  key: PermissionKey
) => {
  return permissions?.[key]?.includes("create");
};

export const canEdit = (
  permissions: Partial<Record<PermissionKey, string[]>>,
  key: PermissionKey
) => {
  return permissions?.[key]?.includes("edit");
};

export const canDelete = (
  permissions: Partial<Record<PermissionKey, string[]>>,
  key: PermissionKey
) => {
  return permissions?.[key]?.includes("delete");
};

// Helper để tránh false/null trong mảng
export const canViewItem = (
  key: PermissionKey,
  item: MenuItem,
  permissions: Partial<Record<PermissionKey, string[]>>
): MenuItem | null => (canView(permissions, key) ? item : null);

export const last3Digits = (phone: string) =>
  chain(phone)
    .replace(/\D/g, "") // bỏ mọi ký tự không phải số
    .toArray() // chuyển thành mảng ký tự
    .takeRight(3) // lấy 3 ký tự cuối
    .join("") // ghép lại thành string
    .value();

export const lastWord = (s: string) =>
  chain(s)
    .trim() // bỏ khoảng trắng đầu/cuối
    .split(/\s+/) // tách theo 1+ khoảng trắng
    .last() // lấy phần tử cuối
    .defaultTo("") // phòng chuỗi rỗng
    .value();
