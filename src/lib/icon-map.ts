import {
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  Save,
  Search,
  X,
  Check,
  RefreshCw,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/**
 * Built-in actions Button recognizes out of the box. Pass `icon` directly
 * with any lucide-react icon to bypass this map entirely for custom actions.
 */
export type ButtonAction =
  | "add"
  | "edit"
  | "delete"
  | "download"
  | "upload"
  | "save"
  | "search"
  | "close"
  | "confirm"
  | "refresh"
  | "next";

export const actionIconMap: Record<ButtonAction, LucideIcon> = {
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  download: Download,
  upload: Upload,
  save: Save,
  search: Search,
  close: X,
  confirm: Check,
  refresh: RefreshCw,
  next: ArrowRight,
};

/**
 * Default label per action, per lifecycle stage. All of these are just
 * fallbacks — pass `label` / `loadingLabel` / `successLabel` to Button to
 * override any of them dynamically (e.g. "Saving changes..." instead of "Saving...").
 */
export const actionLabelMap: Record<
  ButtonAction,
  { idle: string; loading: string; success?: string }
> = {
  add: { idle: "Add", loading: "Adding..." },
  edit: { idle: "Edit", loading: "Saving...", success: "Saved" },
  delete: { idle: "Delete", loading: "Deleting...", success: "Deleted" },
  download: { idle: "Download", loading: "Downloading..." },
  upload: { idle: "Upload", loading: "Uploading..." },
  save: { idle: "Save", loading: "Saving...", success: "Saved" },
  search: { idle: "Search", loading: "Searching..." },
  close: { idle: "Close", loading: "Closing..." },
  confirm: { idle: "Confirm", loading: "Confirming...", success: "Confirmed" },
  refresh: { idle: "Refresh", loading: "Refreshing..." },
  next: { idle: "Next", loading: "Loading..." },
};
