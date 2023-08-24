//import mongoose from "mongoose";

//const cartCollection = "cart";

import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartSchema = Schema({
  products: [{ pid: {type: Schema.Types.ObjectId, ref: 'products'}, quantity: Number}] 
});



/* 
const cartSchema = new mongoose.Schema({
  products: [{ id: Number, quantity: Number }],

  debe ser object id con referencia a producto  
}); */

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;