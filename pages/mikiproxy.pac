function FindProxyForURL(url, host) {
  const hostRegExps = [
    /gstatic.com/,
    /googleapis.com/,
    /google.com/,
    /google-analytics.com/,
    /youtube.com/
  ];
  const proxy = "fukamushi.chao.tokyo"; //プロキシサーバーのURL
  const port = "3128"; //プロキシサーバーのポート
  const isGoogle = hostRegExps.find(
    hostRegExp => host.match(hostRegExp) != null
  );
  if (isGoogle) {
    return "PROXY " + proxy + ":" + port;
  } else {
    return "DIRECT";
  }
}
