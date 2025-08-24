

export function getAvailableLocaleFromPathname(pathname: string) {
  const urlParts = pathname.split('/');

  const firstSegment = urlParts[1]?.toLowerCase();
  //check if the firstSegment is a locale part or not like the guy

  return firstSegment === 'en-us' ? 'en-us' : 'vi-vn';
}

export function getAvailableLocaleUrlPartFromPathname(pathname: string) {
  const urlParts = pathname.split('/');

  const firstSegment = urlParts[1]?.toLowerCase();
  //check if the firstSegment is a locale part or not like the guy

  return firstSegment === 'en-us' ? '/en-us' : '';
}

export function cutLocalePartFromPathname(pathname: string) {
  const urlParts = pathname.split('/');
  const possibleLocalesList = ['vi-vn', 'en-us', 'en'];

  const firstSegment = urlParts[1]?.toLowerCase();
  if(possibleLocalesList.includes(firstSegment)) {
    return '/' + urlParts.slice(2).join('/');
  }

  return pathname;
}