import {
  TAcademicSemesterNameCodeMapper,
  TMonths,
  TSemesterCode,
  TSemesterName,
} from './academic.Sem.Interface';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const semesterName: TSemesterName[] = ['Autumn', 'Fall', 'Summer'];
export const semesterCode: TSemesterCode[] = ['01', '03', '02'];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
