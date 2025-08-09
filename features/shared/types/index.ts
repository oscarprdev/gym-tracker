export type Nullable<T> = T | null;

export interface ActionResponse {
  error: Nullable<string>;
}

export type SidebarKind = 'create' | 'edit' | 'select';

export type SidebarState = {
  isOpen: boolean;
  kind: SidebarKind;
};

export const SidebarKinds = {
  create: 'create',
  edit: 'edit',
  select: 'select',
} as const as Record<SidebarKind, SidebarKind>;
