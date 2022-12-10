const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        uppercase: true,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        default: 0,
      },
      pickup_slot:{
        type: String,
      },
      order_by: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
      },
      payment_status: {
        type: String,
        required: true,
        default: "pending"
      },
      date: {
        type: Date,
        default: Date.now,
      },
      currency: {
        type: String,
        uppercase: true,
        default: "INR",
      },
      status: {
        type: String,
        default: "pending"
      },
      payment_method: {
        type: String,
      },
    
      products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true
        }],

      address_line_1: {
        type: String,
      },
      address_line_2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zip_code: {
        type: String,
      },
      country: {
        type: String,
      },
},{
    timestamps: true
})

module.exports = mongoose.model("Order", OrderSchema);