export interface IUser{
  id: number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  displayName: string;
  description: string;
  socialMediaLink: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  creditCardNumber: string;

  username: string;
  password: string;
  permissionLevel: string;

  active: boolean;

  artistId: number;
}


export interface IUpdateUser{
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  description: string;
  socialMediaLink: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;

  active: boolean;
}

export interface IPaginationUser {
  currentPage: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  items: IUser[];
}

export interface IUserSearch {
  page: number;
  size: number;
  order: string;
  sortBy: string;
  firstName: string;
  lastName: string;
  username: string;
}
