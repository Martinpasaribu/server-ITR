import RoomModel from "../models/room_models";

class RoomService {

  async KeepRoomBooking(status: string, _id: string) {
    
    try {

      let newStatus: boolean;


      const StatusRoom = await RoomModel.findOneAndUpdate(
      { _id, status: true },
      { status: false }
      );

      if (status === "C") {

        if(!StatusRoom) throw new Error("Room sudah di gunakan");

        newStatus = false; // kamar dipakai
        
      } else if (status === "CL") {

        newStatus = true; // kamar dilepas

      } else {
        throw new Error("Status tidak valid");
      }

      const updatedRoom = await RoomModel.findByIdAndUpdate(
        _id,
        { status: newStatus },
        { new: true }
      );

      if (!updatedRoom) {
        throw new Error(`Room not found ${_id} (KeepRoomBooking)`); // lempar error, biar controller yang handle response
      }

      return updatedRoom;
    } catch (err) {
      console.error("Gagal update status kamar:", err);
      throw err;
    }
  }

  async AddCustomerToRoom(_id: string, customer_key: string) {
    
    try {

      const AddCustomer = await RoomModel.findOneAndUpdate(
      { _id, status: true },
      { status: false, customer_key }
      );

      if (!AddCustomer) {
        throw new Error(`Room not found ${_id} (AddCustomerToRoom)`); // lempar error, biar controller yang handle response
      }

      return true;

    } catch (err) {
      console.error("Gagal add customer to room:", err);
      throw err;
    }
  }


  async CekRoomAvailable(_id: string){
    
    try {

    const RoomStatus = await RoomModel.findOne({ _id, isDeleted: false });
      
    if (!RoomStatus) {
        throw new Error(`Room not found ${_id} (CekRoomAvailable)`); // lempar error, biar controller yang handle response
      }

    return RoomStatus.status

    } catch (err) {
        console.error("Gagal cek status kamar:", err);
        throw err;
    }
  }

  async CekRoomAvailableOnUse(_id: string){
    
    try {

    const RoomStatus = await RoomModel.findOne({ _id:_id, status: true, isDeleted: false });
      
    if (!RoomStatus) {
        throw new Error(`Room not found ${_id} (CekRoomAvailableOnUse)`); // lempar error, biar controller yang handle response
      }

    return true;

    } catch (err) {
        console.error("Gagal cek status kamar:", err);
        throw err;
    }
  }

  async UpdateStatusRoom(status: string, _id: string) {
    try {


      const StatusRoom = await RoomModel.findByIdAndUpdate(
        _id,
        {status: false }
      );

      let newStatus: boolean;

      if (status === "M" || status === "P") {

        if(!StatusRoom) throw new Error("Room sudah di gunakan");

        newStatus = false; // kamar dipakai

      } else if (status === "K") {

        newStatus = true; // kamar dilepas

      } else {
        throw new Error("Status tidak valid");
      }

      const updatedRoom = await RoomModel.findByIdAndUpdate(
        _id,
        { status: newStatus },
        { new: true }
      );

      if (!updatedRoom) {
        throw new Error(`Room not found ${_id} (UpdateStatusRoom)`); // lempar error, biar controller yang handle response
      }

      return updatedRoom;
    } catch (err) {
      console.error("Gagal update status kamar:", err);
      throw err;
    }
  }


}

export const RoomServices = new RoomService();
