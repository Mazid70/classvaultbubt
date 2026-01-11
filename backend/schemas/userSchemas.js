const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
  userName:{
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required:true,
  },
  password:{
    type: String,
    required:true,
  },
 
  role:{
    type: String,
    enum: ['student', 'admin','cr'],
    default:'student'
  },
  photoUrl: {
    type: String,
    default:'https://i.ibb.co.com/VW9spYck/user-3331256-1280.webp'
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted','Blocked'],
    default:'Pending'
  },
  
}, { timestamps: true })
module.exports=userSchema