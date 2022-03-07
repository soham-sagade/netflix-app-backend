const mongoose = require('mongoose');
const List = require('../models/List');
module.exports = {
    //CREATE
    async createList(req,res) {
        if(req.user.isAdmin) {
            try {
                const newList = new List({ ... req.body });
                const list = await newList.save();
                return res.status(200).send(list);                        
            } catch(e) {
                res.status(500).send(e);
            }
        } else {
            res.status(403).send('Not Allowed!');
        }

    },


    async getLists(req, res) {
        const typeQ = req.query.type;
        const genreQ = req.query.genre;
        let content
        if(typeQ) {
            if(genreQ) {
                content = await List.aggregate([
                    { $sample: { size: 10 }},
                    { $match: { type: typeQ, genre: genreQ }}
                ])
            } else {
                content = await List.aggregate([
                    { $sample: { size: 10 }},
                    { $match: { type: typeQ }}
                ])
            }
        } else {
            content = await List.aggregate([ { $sample: { size: 10 } } ]);
        }
        return res.status(200).send(content);
    },

    async updateList(req, res) {
        if(req.user.isAdmin) {
            try {
                const list = await List.findByIdAndUpdate(req.params.id,{
                    $set: { ...req.body }
                }, {
                    new: true
                });

                return res.status(200).send(list);                        
            } catch(e) {
                res.status(500).send(e);
            }
        } else {
            res.status(403).send('Not Allowed!');
        }
    },

    async deleteList(req, res) {
        if(req.user.isAdmin) {
            try {
                const list = await List.findByIdAndDelete(req.params.id)
                res.status(200).send(list);                        
            } catch(e) {
                res.status(500).send(e);
            }
        } else {
            res.status(403).send('Not Allowed!');
        }
    }
}