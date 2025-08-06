export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  COMPANY = 'company',
  INSTRUCTOR = 'instructor',
  AUTHOR = 'author',
}

export const roleOption = [
  { label: 'User', value: Role.USER },
  { label: 'Admin', value: Role.ADMIN },
  { label: 'Company', value: Role.COMPANY }
];
