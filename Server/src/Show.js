import mongoose from 'mongoose';


const Show = new mongoose.Schema({
 
    title: { type: String, required: true }, // "Paris"
    description: { type: String, required: true }, // "Best trip"
    price: { type: Number, required: true }, // 500
    imgSrc: { type: String, required: true }, // большая картинка (страница страны) - обязательный параметр!
    
    
    previewImgSrc: { type: String }, // картинка-превью (страница репертуар) - необязательный (если не указан, будет использован imgSrc)
    direction: { type: [String] } // [ "West" ]
});

// Экспортируем модель 'Show', созданную по одноименной схеме
export default mongoose.model('Show', Show);
