/**
 * Middleware to add success and error response methods to res object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */

export const responseHandler = (req, res, next) => {
  /**
   * Success response method
   * @param {Object} data - Data to send in the response
   * @param {string} message - Success message
   * @param {number} status - HTTP status code
   * @returns {Object} Express response object
   */
  res.success = (data = {}, message = "Success", status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
      error: null,
    });
  };

  /**
   * Error response method
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {Error|null} error - Error object
   * @returns {Object} Express response object
   */
  res.error = (message = "Error", status = 500, error = null) => {
    const errorResponse = error
      ? typeof error === "object" && error !== null
        ? error instanceof Error
          ? error.toString()
          : error
        : error.toString()
      : null;

    return res.status(status).json({
      success: false,
      message,
      data: null,
      error: errorResponse,
    });
  };

  next();
};
