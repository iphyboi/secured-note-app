import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    content: { 
        type: String,
         required: [true, "Note content is required"],
         minlength: [3, "Note must be at least 3 characters long"],
         maxlength: [1000, "Note is too long (max 1000 characters)"],
         trim: true
         },
    userId: {
         type:
         mongoose.Schema.Types.ObjectId,
          ref: "user", 
          required: [true, "Note must belong to a user"]
         },
        }, {
            timestamps: true
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);