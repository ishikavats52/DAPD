// ─── Navigation & Shared Types ────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  office_name: string;
  address: string;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Entry: { user: User };
};
