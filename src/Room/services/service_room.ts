import BookingModel from "../../Booking/models/booking_models";
import CustomerModel from "../../Management_Customer/models/management_cmodels";
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
      // 1️⃣ Cek apakah customer sudah terdaftar di room lain
      const existingRoom = await RoomModel.findOne({ customer_key });

      if (existingRoom) {
        // 2️⃣ Kosongkan data lama di room sebelumnya
        await RoomModel.findByIdAndUpdate(existingRoom._id, {
          $set: {
            customer_key: null,
            status: true, // kembali available
          },
        });
        console.log(`Customer sebelumnya dihapus dari room ${existingRoom._id}`);
      }

      // 3️⃣ Tambahkan customer ke room baru
      const updatedRoom = await RoomModel.findOneAndUpdate(
        { _id, status: true },
        {
          $set: {
            status: false, // room jadi tidak available
            customer_key,
          },
        },
        { new: true }
      );

      if (!updatedRoom) {
        throw new Error(`Room tidak ditemukan atau sudah terisi: ${_id}`);
      }

      console.log(`Customer ${customer_key} berhasil ditambahkan ke room ${_id}`);
      return true;

    } catch (err) {
      console.error("Gagal menambahkan customer ke room:", err);
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

  async UpdateStatusRoomByRoom(_id: string) {
    
    try {
            
      let message = {
        booking: '',
        customer: '',
        error: ''
      }

      const Booking = await BookingModel.findOneAndUpdate(
        { room_key: _id} ,
        { status : "CL" },
        { new: true }
      );

      if (!Booking) {

        message.booking = 'Room no register in Booking'

      }

      const Customer = await CustomerModel.findOneAndUpdate(
        { room_key: _id} ,
        { booking_status : "K" },
        { new: true }
      );

      if (!Customer) {

        message.customer = 'Room no register in Customer'
      }

      return message

    } catch (err) {
      console.error("Gagal update status kamar:", err);
      throw err;
    }
  }

  

}

export const RoomServices = new RoomService();
