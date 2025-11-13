import {differenceInYears} from 'date-fns';

export const age = (dob: string) => {
  return differenceInYears(new Date(), new Date(dob)).toString();
};