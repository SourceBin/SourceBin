/* eslint-disable global-require */

export const cryptos = {
  BTC: {
    name: 'Bitcoin',
    addr: '3CPz5ykmXVNYdbhz59c46LGvC8QGdVNXXi',
    urlPrefix: 'bitcoin:',
    img: require('./btc.svg'),
  },
  ETH: {
    name: 'Ethereum',
    addr: '0xF61A33D5e869aA6E72dFE596E6E11C29716eAA2D',
    urlPrefix: 'ethereum:',
    img: require('./eth.svg'),
  },
  ADA: {
    name: 'Cardano',
    addr: 'addr1q9gz7m9g3sz0p6kw3mg0jdk66qugyvhq9f3s6whh707cghmmk2j4ewgm83u8daha7jcn3qhrzu8kwwytdrjw9s23rwcqsfn3mz',
    urlPrefix: 'cardano:',
    img: require('./ada.svg'),
  },
  DOGE: {
    name: 'Dogecoin',
    addr: 'DB3MrJYYLRsKwuzm8RpfhjbPkknp9vg23U',
    urlPrefix: 'dogecoin:',
    img: require('./doge.svg'),
  },
};
