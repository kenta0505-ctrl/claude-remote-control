export type Card = {
  id: number;
  name: string;
  nameKana: string;
  company: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  postalCode: string;
  address: string;
  tags: string[];
  notes: string;
  metAt: string; // YYYY-MM-DD, "" when unknown
  imagePath: string; // e.g. /api/uploads/<uuid>.jpg, "" when no image
  createdAt: string;
  updatedAt: string;
};

/** Everything a caller may set. `id` and the timestamps are owned by the store. */
export type CardInput = Omit<Card, "id" | "createdAt" | "updatedAt">;

export const EMPTY_CARD_INPUT: CardInput = {
  name: "",
  nameKana: "",
  company: "",
  department: "",
  jobTitle: "",
  email: "",
  phone: "",
  mobile: "",
  fax: "",
  website: "",
  postalCode: "",
  address: "",
  tags: [],
  notes: "",
  metAt: "",
  imagePath: "",
};

export const CARD_TEXT_FIELDS = [
  "name",
  "nameKana",
  "company",
  "department",
  "jobTitle",
  "email",
  "phone",
  "mobile",
  "fax",
  "website",
  "postalCode",
  "address",
  "notes",
  "metAt",
  "imagePath",
] as const satisfies readonly (keyof CardInput)[];

export const FIELD_LABELS: Record<keyof CardInput, string> = {
  name: "氏名",
  nameKana: "フリガナ",
  company: "会社名",
  department: "部署",
  jobTitle: "役職",
  email: "メールアドレス",
  phone: "電話番号",
  mobile: "携帯番号",
  fax: "FAX",
  website: "Web サイト",
  postalCode: "郵便番号",
  address: "住所",
  tags: "タグ",
  notes: "メモ",
  metAt: "交換日",
  imagePath: "名刺画像",
};

export type SortKey = "updatedAt" | "createdAt" | "name" | "company" | "metAt";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "updatedAt", label: "更新が新しい順" },
  { value: "createdAt", label: "登録が新しい順" },
  { value: "name", label: "氏名（フリガナ順）" },
  { value: "company", label: "会社名順" },
  { value: "metAt", label: "交換日が新しい順" },
];
