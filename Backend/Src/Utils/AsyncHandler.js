// Created a Async Handler
export function AsyncHandler(Controller_Function) {
  return (req, res, next) => {
    Promise.resolve(Controller_Function(req, res, next)).catch((error) => {
      next(error);
    });
  };
}


