import Validator from 'validatorjs';
import express from 'express';

export const validatorMiddleware = (rules: Validator.Rules) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const validation = new Validator(req.body, rules);

    validation.passes(() => next());
    validation.fails(() => {
      const errors = validation.errors.all();
      res.status(422).json({ errors });
    });
  };
};
