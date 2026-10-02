import { Response } from "express";
import { CardStatus } from "@prisma/client";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { CardService } from "./card.service";
import {
  createCardSchema,
  createManyCardsSchema,
  updateCardStatusSchema,
} from "./card.validation";


export class CardController {


  // Create single card
  static async createCard(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const companyId = req.user!.companyId;

      const data = createCardSchema.parse(req.body);


      const card = await CardService.createCard(
        companyId,
        data.cardNumber,
        data.rfidUid
      );


      return res.status(201).json({
        success:true,
        message:"Card created successfully.",
        data:card,
      });


    } catch(error){

      return res.status(400).json({
        success:false,
        error:error instanceof Error
          ? error.message
          : "Failed to create card.",
      });

    }
  }





  // Create cards in batch
  static async createManyCards(
    req: AuthenticatedRequest,
    res: Response
  ){

    try{

      const companyId = req.user!.companyId;


      const data =
        createManyCardsSchema.parse(req.body);



      const result =
        await CardService.createManyCards(
          companyId,
          data.startNumber,
          data.endNumber
        );


      return res.status(201).json({
        success:true,
        message:"Cards created successfully.",
        data:result,
      });


    }catch(error){

      return res.status(400).json({
        success:false,
        error:error instanceof Error
          ? error.message
          :"Failed to create cards.",
      });

    }

  }





  // Get company cards
  static async getCards(
    req:AuthenticatedRequest,
    res:Response
  ){

    try{

      const cards =
        await CardService.getCards(
          req.user!.companyId
        );


      return res.json({
        success:true,
        data:cards,
      });


    }catch(error){

      return res.status(400).json({
        success:false,
        error:error instanceof Error
          ? error.message
          :"Failed to get cards.",
      });

    }

  }





  // Update card status
  static async updateStatus(
    req:AuthenticatedRequest,
    res:Response
  ){

    try{

      const companyId =
        req.user!.companyId;


      const cardId = String(req.params.cardId);


      const data =
        updateCardStatusSchema.parse(
          req.body
        );


      const card =
        await CardService.updateStatus(
          companyId,
          cardId,
          data.status as CardStatus
        );


      return res.json({
        success:true,
        message:"Card status updated.",
        data:card,
      });


    }catch(error){

      return res.status(400).json({
        success:false,
        error:error instanceof Error
          ? error.message
          :"Failed to update card.",
      });

    }

  }





  // Scanner lookup using internal ID
  static async getCardById(
    req:AuthenticatedRequest,
    res:Response
  ){

    try{

      const cardId = String(req.params.cardId);

const card =
  await CardService.getCardById(
    req.user!.companyId,
    cardId
  );


      return res.json({
        success:true,
        data:card,
      });


    }catch(error){

      return res.status(404).json({
        success:false,
        error:error instanceof Error
          ? error.message
          :"Card not found.",
      });

    }

  }





  // Delete card
  static async deleteCard(
    req:AuthenticatedRequest,
    res:Response
  ){

    try{

      await CardService.deleteCard(
        req.user!.companyId,
        String(req.params.cardId)
      );


      return res.json({
        success:true,
        message:"Card deleted.",
      });


    }catch(error){

      return res.status(400).json({
        success:false,
        error:error instanceof Error
          ? error.message
          :"Failed to delete card.",
      });

    }

  }



  // Scan card when giving it to customer
static async scanTakeCard(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const rfidUid =
  String(req.params.rfidUid).trim();

const card =
  await CardService.scanTakeCard(
    companyId,
    rfidUid
  );

    return res.status(200).json({
      success: true,
      message: "Card scanned and given to customer.",
      data: card,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to scan card.",
    });

  }
}



// Scan card when customer returns it
static async scanReturnCard(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const rfidUid =
  String(req.params.rfidUid).trim();

const card =
  await CardService.scanReturnCard(
    companyId,
    rfidUid
  );

    return res.status(200).json({
      success: true,
      message: "Card returned successfully.",
      data: card,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to return card.",
    });

  }
}


// Register RFID UID to an existing card
static async registerRfid(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId =
      req.user!.companyId;

    const cardId =
      String(req.params.cardId);

    const rfidUid =
      String(req.body.rfidUid).trim();

    if (!rfidUid) {
      return res.status(400).json({
        success: false,
        error: "RFID UID is required.",
      });
    }

    const card =
      await CardService.registerRfid(
        companyId,
        cardId,
        rfidUid
      );

    return res.status(200).json({
      success: true,
      message:
        "RFID card registered successfully.",
      data: card,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to register RFID card.",
    });
  }
}


// Scanner lookup using RFID UID
static async getCardByRfid(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId =
      req.user!.companyId;

    const rfidUid =
      String(req.params.rfidUid).trim();

    const card =
      await CardService.getCardByRfid(
        companyId,
        rfidUid
      );

    return res.json({
      success: true,
      data: card,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "RFID card not found.",
    });
  }
}


}