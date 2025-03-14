import { IMeQuery } from '@/apollo/functions/fetchMe';
interface IUpdateProfile {
  firstName: string;
  lastName: string;
  title: string;
  contact: {
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone1: string;
    nightPhone: string;
    fax: string;
  };
  photo: string | null;
}

interface IUpdateProfilePayload {
  input: Partial<IUpdateProfile>;
}

interface IUpdateProfileResponse {
  updateProfile: {
    isSuccess: boolean;
    message: string;
    profile: IMeQuery;
  };
}

interface ISendConsultingRequestInput {
  input: {
    userId?: string;
    fullname?: string;
    email?: string;
    phone?: string;
    facilityName?: string;
    subject?: string;
    specificSolutions?: string[];
  };
}

interface ISendVerificationEmailInput {
  input: {
    userId: string;
    email: string;
  };
}

interface ILoginAsCognitoInput {
  input: ILogin;
}

interface IForgotPasswordInput {
  username: string;
}

export interface ICountryCodesInput {
  filter: {
    isInUse?: boolean;
    search?: string;
  };
  pagination: {
    limit?: number;
    prevCursor?: string;
    cursor?: string;
    orderType?: 'asc' | 'desc';
  };
}

interface IUserQuery {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  contact: {
    address: string | null;
    city: string | null;
    country: string | null;
    zip: string | null;
    state: string | null;
    phone1: string | null;
    phone2: string | null;
    nightPhone: string | null;
    fax: string | null;
  } | null;
  roles: string[] | null;
  username: string | null;
  email: string | null;
  isDisabled: boolean | null;
  freshChatRestoreId: string | null;
  willViewTutorialLater: boolean | null;
  canUseAiViewer: boolean | null;
  isTestAccount: boolean | null;
  photo: string | null;
  isEmailVerified: boolean | null;
}

interface IUserResponse {
  user: IUserQuery;
}

interface IMeQuery {
  me: IUserQuery;
}

interface IStudyQuery {
  study: {
    facility: {
      id: string;
    };
  };
}

interface ICountryCodesInput {
  filter: {
    isInUse?: boolean;
    search?: string;
  };
  pagination: {
    limit?: number;
    prevCursor?: string;
    cursor?: string;
    orderType?: 'asc' | 'desc';
  };
}
