import { Request, Response } from 'express';

export default interface UserControllerInterface {
  create(req: Request, res: Response): Promise<Response | undefined>;
  login(req: Request, res: Response): Promise<Response | undefined>;
}
