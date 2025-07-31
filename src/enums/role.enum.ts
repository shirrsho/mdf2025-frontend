export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  INSTRUCTOR = 'instructor',
  AUTHOR = 'author',
}

export const roleOption = [
  { label: 'User', value: Role.USER },
  // { label: 'Admin', value: Role.ADMIN },
  { label: 'Moderator', value: Role.MODERATOR },
  { label: 'Instructor', value: Role.INSTRUCTOR },
  { label: 'Author', value: Role.AUTHOR },
];
