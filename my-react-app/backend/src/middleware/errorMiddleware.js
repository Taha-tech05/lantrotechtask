export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Prisma-specific error handling
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate value for field: ${err.meta?.target?.join(', ') || 'unknown'}`;
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }
  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Invalid reference to related record';
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

// Wraps async route handlers so errors are passed to errorHandler automatically
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);