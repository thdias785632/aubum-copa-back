import { Request, Response } from 'express';
import StickersControllerInterface from '../../../app/@shared/stickers/controller/stickers-controller.interface';
import StickersUseCaseInterface from '../../../app/@shared/stickers/usecases/stickers.usecase.interface';

export default class StickersController implements StickersControllerInterface {
  constructor(private useCase: StickersUseCaseInterface) {}

  async findAll(_req: Request, res: Response): Promise<Response | undefined> {
    try {
      const stickers = await this.useCase.findAll();
      return res.status(200).json(stickers);
    } catch (error: any) {
      return res.status(error.status ? error.status : 500).json({
        message: error.message ? error.message : 'Internal Server Error',
      });
    }
  }
}
