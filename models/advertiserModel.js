import mongoose from 'mongoose';

const advertiserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    companyName: { type: String, required: true },
    website: { type: String, default: '' },
    industry: { type: [String], required: true },
    location: { type: String, required: true },

    businessDescription: { type: String, required: true },
    businessStage: { type: String, required: true },
    topicsOfInterest: { type: [String], required: true },
    primaryReason: { type: String, required: true },
    additionalComments: { type: String, default: '' }
}, {
    timestamps: true
});

const advertiserModel = mongoose.models.advertiser || mongoose.model('advertiser', advertiserSchema);

export default advertiserModel;