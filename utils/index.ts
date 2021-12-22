import { User } from 'next-auth';
import { UserStr } from 'types';

export const uniqueString = (length: number) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const formatDate = (date = Date.now()) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('-');
};

export const isBrowser = () => typeof window !== 'undefined';

export const getAvatarPath = (user: User | UserStr) => {
  return user.provider === 'credentials'
    ? `${process.env.NEXT_PUBLIC_AVATARS_PATH}${user.image || 'placeholder-avatar.jpg'}`
    : user.image;
  // can edit avatar, startsWith('https://')
};

export const getAvatarFullUrl = (user: User | UserStr) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${getAvatarPath(user)}`;
};

export const getHeaderImagePath = (user: User | UserStr) => {
  return `${process.env.NEXT_PUBLIC_HEADERS_PATH}${
    user.headerImage || 'placeholder-header.jpg'
  }`;
};

export const getHeaderImageFullUrl = (user: User | UserStr) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${getHeaderImagePath(user)}`;
};

type ObjectWithDates = { createdAt: Date; updatedAt: Date };
type ObjectWithStrings = {
  createdAt: string;
  updatedAt: string;
};

export const datesToStrings = <T extends ObjectWithDates>(
  _object: T
): Omit<T, keyof ObjectWithDates> & ObjectWithStrings => {
  return {
    ..._object,
    createdAt: _object.createdAt.toISOString(),
    updatedAt: _object.updatedAt.toISOString(),
  };
};

/**
 * min, max included
 */
export const getRandomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
