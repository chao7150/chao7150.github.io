function FindProxyForURL(url, host) {
  const hostRegExps = [
    /gstatic.com/,
    /googleapis.com/,
    /google.com/,
    /google-analytics.com/,
    /youtube.com/,
    /ytimg.com/,
    /ugtop/ // 確認用
  ];
  const isGoogle = hostRegExps.some(hostRegExp => host.match(hostRegExp));
  if (isGoogle) {
    return "PROXY fukamushi.chao.tokyo:3128";
  } else {
    return "DIRECT";
  }
}
