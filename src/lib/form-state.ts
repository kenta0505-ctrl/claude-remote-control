import type { CardInput } from "./types";

export type FormState = {
  errors: string[];
  /** Echoed back so a rejected submission keeps what the user typed. */
  values: CardInput | null;
};

export const EMPTY_FORM_STATE: FormState = { errors: [], values: null };
