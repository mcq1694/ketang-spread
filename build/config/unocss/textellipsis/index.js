module.exports = () => ({
  'text-ellipsis-line2': {
    textAlign: 'justify',
    wordBreak: 'break-all',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '-webkit-line-clamp': '2',
  },
  'text-ellipsis-line3': {
    textAlign: 'justify',
    wordBreak: 'break-all',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '-webkit-line-clamp': '3',
  },
  'text-ellipsis': {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});
