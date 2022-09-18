const toCapitalCase = (text: string): string => {
   return text
      .split(' ')
      .map((text) => {
         return text
            .split('')
            .map((v, i) => (i === 0 ? v.toUpperCase() : v))
            .join('');
      })
      .join(' ');
};

export default toCapitalCase;
