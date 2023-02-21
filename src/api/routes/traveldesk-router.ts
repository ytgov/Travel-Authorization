import express, { Request, Response } from "express";
import { RequiresAuth, RequiresRolePatAdminOrAdmin } from "../middleware";
import { DB_CONFIG } from "../config";
import knex from "knex";
import { UserService } from "../services";

const db = knex(DB_CONFIG);

export const travelDeskRouter = express.Router();
const userService = new UserService();

travelDeskRouter.get("/travel-request/:taid", RequiresAuth, async function (req: Request, res: Response) {
  

  const travelRequest = await db("travelDeskTravelRequest").select("*").where({
    TAID: req.params.taid
  });

  if(travelRequest.length>0){
    const flightRequests = await db("travelDeskFlightRequest").select("*").where("requestID", travelRequest[0].requestID);
    travelRequest[0].flightRequests=flightRequests

    const rentalCars = await db("travelDeskRentalCar").select("*").where("requestID", travelRequest[0].requestID);
    travelRequest[0].rentalCars=rentalCars

    const hotels = await db("travelDeskHotel").select("*").where("requestID", travelRequest[0].requestID);
    travelRequest[0].hotels=hotels

    const otherTransportation = await db("travelDeskOtherTransportation").select("*").where("requestID", travelRequest[0].requestID);
    travelRequest[0].otherTransportation=otherTransportation
  }

  res.status(200).json(travelRequest);
});

travelDeskRouter.post("/travel-request/:taid", RequiresAuth, async function (req: Request, res: Response) {
  try {
    
    await db.transaction(async trx => {
      const TAID = Number(req.params.taid);
      const newTravelRequest = req.body;
      console.log(newTravelRequest)

      if (TAID) {

        const flightRequests = newTravelRequest.flightRequests
        delete newTravelRequest.flightRequests

        const rentalCars = newTravelRequest.rentalCars
        delete newTravelRequest.rentalCars

        const hotels = newTravelRequest.hotels
        delete newTravelRequest.hotels

        const otherTransportations = newTravelRequest.otherTransportation
        delete newTravelRequest.otherTransportation


        let id = null
        const travelRequestQuery = await db("travelDeskTravelRequest").select("*").where("TAID", TAID);
        
        if (travelRequestQuery.length == 1) {
          id = await db("travelDeskTravelRequest").update(newTravelRequest, "requestID").where("TAID", TAID);
        } 
        else if (travelRequestQuery.length == 0){          
          id = await db("travelDeskTravelRequest").insert(newTravelRequest, "requestID");
        } 
        else {
          return res.status(500).json("Multiple Travel Request Records!");
        }

        //FlightRequests
        await db("travelDeskFlightRequest").delete().where("requestID", id[0].requestID);
        
        for(const flightRequest of flightRequests){
          delete flightRequest.tmpId
          if(flightRequest.flightRequestID==null) delete flightRequest.flightRequestID
          flightRequest.requestID=id[0].requestID          
          await db("travelDeskFlightRequest").insert(flightRequest);
        }

        //RentalCars
        await db("travelDeskRentalCar").delete().where("requestID", id[0].requestID);
        
        for(const rentalCar of rentalCars){
          delete rentalCar.tmpId
          if(rentalCar.rentalVehicleID==null) delete rentalCar.rentalVehicleID
          rentalCar.requestID=id[0].requestID          
          await db("travelDeskRentalCar").insert(rentalCar);
        }

        //Hotels
        await db("travelDeskHotel").delete().where("requestID", id[0].requestID);
        
        for(const hotel of hotels){
          delete hotel.tmpId
          if(hotel.hotelID==null) delete hotel.hotelID
          hotel.requestID=id[0].requestID          
          await db("travelDeskHotel").insert(hotel);
        }

        //Other Transportations
        await db("travelDeskOtherTransportation").delete().where("requestID", id[0].requestID);
        
        for(const otherTransportation of otherTransportations){
          delete otherTransportation.tmpId
          if(otherTransportation.transportationID==null) delete otherTransportation.transportationID
          otherTransportation.requestID=id[0].requestID          
          await db("travelDeskOtherTransportation").insert(otherTransportation);
        }

        res.status(200).json("Successful");
      } else {
        res.status(500).json("Required fields in submission are blank");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Saving the Travel Request failed");
  }
});
