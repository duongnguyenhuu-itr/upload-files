import _ from 'lodash';

export const getBackgroundAvatar = (firstName: string) => {
  if (firstName) {
    const myChar = _.lowerCase(firstName[0]);
    const arr = [
      'ab',
      'cd',
      'ef',
      'gh',
      'ij',
      'kl',
      'mn',
      'op',
      'qr',
      'st',
      'uv',
      'xy',
      'wz',
    ];
    let res = 'bgAvatar-1';
    _.forEach(arr, (x: string, i: number) => {
      if (_.includes(x, myChar)) {
        res = `bgAvatar-${i + 1}`;
      }
    });
    return res;
  }
  return undefined;
};

export const getFirstLetterName = (firstName: string, lastName: string) => {
  try {
    if (firstName && lastName) {
      return `${lastName[0]}${firstName[0]}`;
    }
    return '';
  } catch (error) {
    return '';
  }
};
