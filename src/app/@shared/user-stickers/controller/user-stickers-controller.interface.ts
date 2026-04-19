import { Request, Response } from 'express';

export default interface UserStickersControllerInterface {
  getAlbum(req: Request, res: Response): Promise<Response | undefined>;
  increment(req: Request, res: Response): Promise<Response | undefined>;
  decrement(req: Request, res: Response): Promise<Response | undefined>;
  getRepetidas(req: Request, res: Response): Promise<Response | undefined>;
  reset(req: Request, res: Response): Promise<Response | undefined>;
}
