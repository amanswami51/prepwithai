import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    interviewId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'interview'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    totalScore:{
        type:Number,
        required:true,
    },
    categoryScores:{
        type:Array,
        required:true
    },
    strengths:{
        type:Array,
        required:true
    },
    areasForImprovement:{
        type:Array,
        required:true
    },
    finalAssessment:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required:true
    }
})

const Feedback = mongoose.models.feedback || mongoose.model('feedback', feedbackSchema)
export {Feedback};