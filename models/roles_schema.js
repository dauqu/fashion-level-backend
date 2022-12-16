const mongoose = require("mongoose")

const RoleSchema = new mongoose.Schema({
    for: {
        type: String, 
        required: true  
    },
    role: {
        type: String,
        required: true
    },
    dashboard:{
        type: Boolean,
        required: true,
        default: false
    },
    order: {
        read: {
            type: Boolean,
            required: true,
            default: false
        },
        edit: {
            type: Boolean,
            required: true,
            default: false
        },
        delete: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    product: {
        create: {
            type: Boolean,
            required: true,
            default: false
        },
        edit: {
            type: Boolean,
            required: true,
            default: false
        },
        delete: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    user: {
        create: {
            type: Boolean,
            required: true,
            default: false
        },
        edit: {
            type: Boolean,
            required: true,
            default: false
        },
        delete: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    finance: {
        order_overview: {
            type: Boolean,
            required: true,
            default: false
        },
        statement_overview: {
            type: Boolean,
            required: true,
            default: false
        },
        user_payout: {
            type: Boolean,
            required: true,
            default: false
        },
        return_refund: {
            type: Boolean,
            required: true,
            default: false
        },
        vat: {
            type: Boolean,
            required: true,
            default: false
        },
        taxes_charges: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    marketing: {
         coupon: {
            type: Boolean,
            required: true,
            default: false
         },
         notification: {
            type: Boolean,
            required: true,
            default: false
         },
         popup_banner: {
            type: Boolean,
            required: true,
            default: false
         },
         sticky_banner: {
            type: Boolean,
            required: true,
            default: false
         }
    },
    setting: {
        shipping: {
            type: Boolean,
            required: true,
            default: false
        },        
        return_setting: {
            type: Boolean,
            required: true,
            default: false
        },        
        payment_setting: {
            type: Boolean,
            required: true,
            default: false
        }        
    },
    report: {
        type: Boolean,
        required: true,
        default: false
    },
    policy: {
        create: {
            type: Boolean,
            required: true,
            default: false
        },
        edit: {
            type: Boolean,
            required: true,
            default: false
        },
        delete: {
            type: Boolean,
            required: true,
            default: false
        },
    }
    }, {
        timestamps: true
})

module.exports = mongoose.model("Roles", RoleSchema)