
export function errorHandler(err, req, res, next) {
  console.error('[UNHANDLED ERROR]:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'SERVER_ERROR'
  });
}
