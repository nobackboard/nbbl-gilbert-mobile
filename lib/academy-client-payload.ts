import type { ChildGradeEntry } from "./academy";

/** Shape serialized by `AcademyForm` to `POST /api/forms/academy`. */
export type AcademyFormClientFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  childCount: number;
  childGrades: ChildGradeEntry[];
  dataProcessingConsent: boolean;
  marketingOptIn: boolean;
  botCheck: string;
};

export function serializeAcademyFormPayload(fields: AcademyFormClientFields) {
  return {
    fields: {
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      phone: fields.phone,
      childCount: fields.childCount,
      childGrades: fields.childGrades,
      dataProcessingConsent: fields.dataProcessingConsent,
      marketingOptIn: fields.marketingOptIn,
      botCheck: fields.botCheck,
    },
  };
}
