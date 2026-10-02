import { CardStatus } from "@prisma/client";
import { db } from "../../config/db";


export class CardService {


  static async createCard(
  companyId: string,
  cardNumber: string,
  rfidUid?: string
) {
  return db.card.create({
    data: {
      companyId,
      cardNumber,
      rfidUid: rfidUid ?? null,
    },
  });
}



   



  // Create batch cards 001-100
  static async createManyCards(
    companyId: string,
    startNumber: number,
    endNumber: number
  ) {

    const cards = [];

    for (
      let i = startNumber;
      i <= endNumber;
      i++
    ) {

      cards.push({
        companyId,
        cardNumber: i.toString().padStart(3, "0"),
      });

    }


    return db.card.createMany({
      data: cards,
      skipDuplicates: true,
    });
  }



  // Register RFID UID to an existing physical card
static async registerRfid(
  companyId: string,
  cardId: string,
  rfidUid: string
) {
  const card = await db.card.findFirst({
    where: {
      id: cardId,
      companyId,
    },
  });

  if (!card) {
    throw new Error("Card not found.");
  }

  const existingRfid = await db.card.findUnique({
    where: {
      rfidUid,
    },
  });

  if (
    existingRfid &&
    existingRfid.id !== cardId
  ) {
    throw new Error(
      "This RFID card is already registered to another card."
    );
  }

  return await db.card.update({
    where: {
      id: cardId,
    },
    data: {
      rfidUid,
    },
  });
}




  // Get all company cards
  static async getCards(companyId: string) {

    return db.card.findMany({
      where:{
        companyId,
      },
      orderBy:{
        cardNumber:"asc",
      },
    });

  }

  // Get card using RFID scanner UID
static async getCardByRfid(
  companyId: string,
  rfidUid: string
) {
  const card = await db.card.findFirst({
    where: {
      companyId,
      rfidUid,
    },
  });

  if (!card) {
    throw new Error(
      "Unknown RFID card. This card has not been registered."
    );
  }

  return card;
}





  // Update card status
  static async updateStatus(
    companyId:string,
    cardId:string,
    status:CardStatus
  ){

    const card = await db.card.findFirst({
      where:{
        id:cardId,
        companyId,
      },
    });


    if(!card){
      throw new Error(
        "Card not found"
      );
    }


    return db.card.update({
      where:{
        id:cardId,
      },
      data:{
        status,
      },
    });

  }




  // Get card by internal ID (scanner)
  static async getCardById(
    companyId:string,
    cardId:string
  ){

    const card =
      await db.card.findFirst({
        where:{
          id:cardId,
          companyId,
        },
      });


    if(!card){
      throw new Error(
        "Card not found"
      );
    }


    return card;

  }




  // Delete card
  static async deleteCard(
    companyId:string,
    cardId:string
  ){

    const card =
      await db.card.findFirst({
        where:{
          id:cardId,
          companyId,
        },
      });


    if(!card){
      throw new Error(
        "Card not found"
      );
    }


    return db.card.delete({
      where:{
        id:cardId,
      },
    });

  }

static async scanTakeCard(
  companyId: string,
  rfidUid: string
) {
  const card = await db.card.findFirst({
    where: {
      companyId,
      rfidUid,
    },
  });

  if (!card) {
    throw new Error(
      "Unknown RFID card. This card has not been registered."
    );
  }

  if (
    card.status !==
    CardStatus.AVAILABLE_AT_SECURITY
  ) {
    throw new Error(
      `Card ${card.cardNumber} is not available at security. Current status: ${card.status}.`
    );
  }

  return await db.card.update({
    where: {
      id: card.id,
    },
    data: {
      status: CardStatus.WITH_CUSTOMER,
    },
  });
}


static async scanReturnCard(
  companyId: string,
  rfidUid: string
) {
  const card = await db.card.findFirst({
    where: {
      companyId,
      rfidUid,
    },
  });

  if (!card) {
    throw new Error(
      "Unknown RFID card. This card has not been registered."
    );
  }

  if (
    card.status !==
    CardStatus.RETURN_PENDING
  ) {
    throw new Error(
      `Card ${card.cardNumber} is not waiting for return. Current status: ${card.status}.`
    );
  }

  return await db.card.update({
    where: {
      id: card.id,
    },
    data: {
      status:
        CardStatus.AVAILABLE_AT_SECURITY,
    },
  });
}

}