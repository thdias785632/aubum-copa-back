import { Request, Response } from 'express';
import UserStickersControllerInterface from '../../../app/@shared/user-stickers/controller/user-stickers-controller.interface';
import UserStickersUseCaseInterface from '../../../app/@shared/user-stickers/usecases/user-stickers.usecase.interface';

export default class UserStickersController implements UserStickersControllerInterface {
  constructor(private useCase: UserStickersUseCaseInterface) {}

  async getAlbum(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const userId = String(req.params.userId || '');
      if (!userId)
        return res.status(400).json({ message: 'userId is required' });

      const album = await this.useCase.getAlbum(userId);
      return res.status(200).json(album);
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }

  async increment(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { userId, stickerId } = req.body;
      if (!userId || !stickerId) {
        return res
          .status(400)
          .json({ message: 'userId and stickerId are required' });
      }
      const updated = await this.useCase.increment(userId, stickerId);
      return res.status(200).json(updated);
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }

  async decrement(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { userId, stickerId } = req.body;
      if (!userId || !stickerId) {
        return res
          .status(400)
          .json({ message: 'userId and stickerId are required' });
      }
      const updated = await this.useCase.decrement(userId, stickerId);
      return res.status(200).json(updated);
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }

  async getRepetidas(
    req: Request,
    res: Response,
  ): Promise<Response | undefined> {
    try {
      const userId = String(req.params.userId || '');
      if (!userId)
        return res.status(400).json({ message: 'userId is required' });
      const repetidas = await this.useCase.getRepetidas(userId);
      return res.status(200).json(repetidas);
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }

  async reset(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const userId = String(req.params.userId || '');
      if (!userId)
        return res.status(400).json({ message: 'userId is required' });
      await this.useCase.reset(userId);
      return res.status(200).json({ message: 'Album reset successfully' });
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }

  async getTrocaUsers(
    _req: Request,
    res: Response,
  ): Promise<Response | undefined> {
    try {
      const users = await this.useCase.getTrocaUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }

  async getTrocaRepetidas(
    req: Request,
    res: Response,
  ): Promise<Response | undefined> {
    try {
      const userId = String(req.params.userId || '');
      if (!userId)
        return res.status(400).json({ message: 'userId is required' });
      const repetidas = await this.useCase.getTrocaRepetidas(userId);
      return res.status(200).json(repetidas);
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }
}
