import mongoose from "mongoose";


const interviewSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    role:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
    },
    techstack:{
        type:Array,
        required:true,
    },
    level:{
        type:String,
        required:true
    },
    questions:{
        type:Array,
        required:true
    },
    finalized:{
        type:Boolean,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required:true
    }
})

const Interview = mongoose.models.interview || mongoose.model('interview', interviewSchema);
export {Interview};