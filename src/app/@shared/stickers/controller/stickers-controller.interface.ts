import { Request, Response } from 'express';

export default interface StickersControllerInterface {
  findAll(req: Request, res: Response): Promise<Response | undefined>;
}
