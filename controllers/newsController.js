const { formidable } = require('formidable')
const cloudinary = require('cloudinary').v2
const newsModel = require('../models/newsModel')
const authModel = require('../models/authModel')
const galleryModel = require('../models/galleryModel')
const { mongo: { ObjectId } } = require('mongoose')
const moment = require('moment')

class newsController {
    add_news = async (req, res) => {

        const { id, name } = req.userInfo;
        const form = formidable({})
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        })
        try {

            const [fields, files] = await form.parse(req)
            const { url } = await cloudinary.uploader.upload(files.image[0].filepath, { folder: 'news_images' })
            const { title, description, category } = fields
            const news = await newsModel.create({
                writerId: id,
                title: title[0].trim(),
                slug: title[0].trim().split(' ').join('-'),
                category: category[0].trim(),
                description: description[0],
                date: moment().format('LL'),
                writerName: name,
                image: url
            })
            return res.status(201).json({ message: 'news add success', news })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    // update_news = async (req, res) => {

    //     const { news_id } = req.params
    //     const form = formidable({})

    //     cloudinary.config({
    //         cloud_name: process.env.cloud_name,
    //         api_key: process.env.api_key,
    //         api_secret: process.env.api_secret,
    //         secure: true
    //     })

    //     try {
    //         const [fields, files] = await form.parse(req)
    //         const { title, description, category } = fields
    //         // let url = fields.old_image[0]
    //         let url = Array.isArray(fields.old_image) && fields.old_image.length > 0 ? fields.old_image[0] : '';


    //         if (Object.keys(files).length > 0) {
    //             const spliteImage = url.split('/')
    //             const imagesFile = spliteImage[spliteImage.length - 1].split('.')[0]
    //             await cloudinary.uploader.destroy(imagesFile);
    //             const data = await cloudinary.uploader.upload(files.new_image[0].filepath, { folder: 'news_images' })
    //             url = data.url
    //         }

    //         const news = await newsModel.findByIdAndUpdate(news_id, {
    //             title: title[0].trim(),
    //             category: category[0].trim(),
    //             slug: title[0].trim().split(' ').join('-'),
    //             description: description[0],
    //             image: url
    //         }, { new: true })

    //         return res.status(200).json({ message: 'news update success', news })
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ message: error.message })
    //     }
    // }

    update_news = async (req, res) => {
        const { news_id } = req.params;
        const form = formidable({});
    
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        });
    
        try {
            const [fields, files] = await form.parse(req);
            const { title, description, category } = fields;
        
            let url = Array.isArray(fields.old_image) && fields.old_image.length > 0 ? fields.old_image[0] : '';
    
            if (Object.keys(files).length > 0) {
                const splitImage = url.split('/');
                const imageFile = splitImage[splitImage.length - 1].split('.')[0];
                await cloudinary.uploader.destroy(imageFile);
                const data = await cloudinary.uploader.upload(files.new_image[0].filepath, { folder: 'news_images' });
                url = data.url;
            }
    
            const news = await newsModel.findByIdAndUpdate(news_id, {
                title: title[0].trim(),
                category: category[0].trim(),
                slug: title[0].trim().split(' ').join('-'),
                description: description[0],
                image: url
            }, { new: true });
    
            return res.status(200).json({ message: 'news update success', news });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    };
    
    get_images = async (req, res) => {
        const { id } = req.userInfo

        try {
            const images = await galleryModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 })
            return res.status(201).json({ images })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    get_recent_news = async (req, res) => {
        try {
            const news = await newsModel.find().sort({ createdAt: -1 }).skip(6).limit(6)
            return res.status(201).json({ news })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    delete_news = async (req, res) => {
        try{
            const { id } = req.params;
            const news = await newsModel.findById(id);

            if (!news) {
                res.status(400).json({ message: "News not found" })
            }

            await news.deleteOne();
            return res.status(201).json({ message: 'News delete success' })
        }catch(error){
            return res.status(500).json({ message: error.message })
        }
    }

    get_category_news = async (req, res) => {

        const { category } = req.params

        try {
            const news = await newsModel.find({
                $and: [
                    {
                        category: {
                            $eq: decodeURIComponent(category)
                        }
                    },
                ]
            })
            return res.status(201).json({ news })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    news_search = async (req, res) => {
        const { value } = req.query
        try {
            const news = await newsModel.find({
                // status: 'active',
                $text: {
                    $search: value
                }
            })
            return res.status(201).json({ news })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    add_images = async (req, res) => {

        const form = formidable({})
        const { id } = req.userInfo

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        })

        try {
            const [_, files] = await form.parse(req)
            let allImages = []
            const { images } = files

            for (let i = 0; i < images.length; i++) {
                const { url } = await cloudinary.uploader.upload(images[i].filepath, { folder: 'news_images' })
                allImages.push({ writerId: id, url })
            }

            const image = await galleryModel.insertMany(allImages)
            return res.status(201).json({ images: image, message: "images uplaod success" })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    get_dashboard_news = async (req, res) => {
        const { id, role } = req.userInfo
        try {
            if (role === 'admin') {
                const news = await newsModel.find({}).sort({ createdAt: -1 })
                return res.status(200).json({ news })
            } else {
                const news = await newsModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 })
                return res.status(200).json({ news })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    get_dashboard_single_news = async (req, res) => {
        const { news_id } = req.params
        try {
            const news = await newsModel.findById(news_id)
            return res.status(200).json({ news })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }


    // website

    get_all_news = async (req, res) => {
        try {
            const category_news = await newsModel.aggregate([
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: "$category",
                        news: {
                            $push: {
                                _id: '$_id',
                                title: '$title',
                                slug: '$slug',
                                writerName: '$writerName',
                                image: '$image',
                                description: '$description',
                                date: '$date',
                                category: '$category'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        news: {
                            $slice: ['$news', 5]
                        }
                    }
                }
            ])

            const news = {}
            for (let i = 0; i < category_news.length; i++) {
                news[category_news[i].category] = category_news[i].news
            }
            return res.status(200).json({ news })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    get_news = async (req, res) => {

        const { slug } = req.params


        try {

            const news = await newsModel.findOneAndUpdate({ slug }, {
                $inc: { count: 1 }
            }, { new: true })

            const relateNews = await newsModel.find({
                $and: [
                    {
                        slug: {
                            $ne: slug
                        }
                    }, {
                        category: {
                            $eq: news.category
                        }
                    }
                ]
            }).limit(4).sort({ createdAt: -1 })

            return res.status(200).json({ news: news ? news : {}, relateNews })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

     add_category = async (req, res) => {
        const { category } = req.body;
    
        try {
            const existingCategory = await newsModel.aggregate([
                {
                    $match: {
                        category: category
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]);
    
            if (existingCategory.length > 0) {
                return res.status(400).json({ message: 'Category already exists' });
            }
    
            const newCategory = await newsModel.create({ category });
    
            const result = await newsModel.aggregate([
                {
                    $match: {
                        category: newCategory.category
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        count: 1
                    }
                }
            ]);
    
            return res.status(201).json({ message: 'Category added successfully', result });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    

    get_categories = async (req, res) => {
        try {
            const categories = await newsModel.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        count: 1
                    }
                }
            ])
            return res.status(200).json({ categories })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    get_popular_news = async (req, res) => {
        try {
            const popularNews = await newsModel.find().sort({ count: -1 }).limit(4);

            // popularNews = popularNews.sort(() => Math.random() - 0.5);
            return res.status(200).json({ popularNews })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    get_latest_news = async (req, res) => {
        try {
            const news = await newsModel.find().sort({ createdAt: -1 }).limit(6)

            return res.status(200).json({ news })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    }
    get_images = async (req, res) => {
        try {
            const images = await newsModel.aggregate([
                {
                    $sample: {
                        size: 9
                    }
                },
                {
                    $project: {
                        image: 1
                    }
                }
            ])
            return res.status(200).json({ images })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    }
}
module.exports = new newsController()