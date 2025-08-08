export type Nullable<T> = T | null;

export interface ActionResponse {
  error: Nullable<string>;
}

export type SidebarKind = 'create' | 'edit';

export type SidebarState = {
  isOpen: boolean;
  kind: SidebarKind;
};

export const SidebarKinds = {
  create: 'create',
  edit: 'edit',
} as const as Record<SidebarKind, SidebarKind>;
