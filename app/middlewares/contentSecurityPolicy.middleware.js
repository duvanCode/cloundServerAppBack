const contentSecurityPolicy = (req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "object-src 'self' telegram.ondeploy.space;"
  );
  next();
}

module.exports = contentSecurityPolicy;
