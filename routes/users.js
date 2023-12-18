const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");


//update user
router.put('/:id', async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err){ 
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Accont has been Updated")
        } catch(err){
            return res.status(500).json(err);
        }

    } else{
        return res.status(403).json("You can Update your account only")
    }
});

//Delete user
router.delete('/:id', async (req, res)=>{
    // if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Accont has been Deleted")
        } catch(err){
            return res.status(500).json(err);
        }

    // } else{
        // return res.status(403).json("You can Delete your account only")
    // }
});


// Get user

router.get('/:id', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        console.log(user);
        const {password, updatedAt,createdAt, ...other} = user._doc
        res.status(200).json(other);
    } catch(err){
        res.status(500).json(err);
    }
});

// get all Users

router.get('/', async (req, res)=>{
    try{
        const users = await User.find();
        const userList = users.map(user => {
            const {password, updatedAt,createdAt, ...other} = user._doc;
            return other;
        })
        res.status(200).json(userList);
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Follow a User

router.put('/:id/follow', async (req, res)=>{
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{ followers: req.body.userId }})
                await currentUser.updateOne({$push:{ followings: req.params.id }});
                res.status(200).json("user Followed")
            } else{
                res.status(403).json("you already follwing this user")
            }
        } 
        catch (err) {
            res.status(500).json(err);
        }
    } else{
        res.status(403).json("You can not folllow yourself")
    }
})

// Unfollow a User

router.put('/:id/unfollow', async (req, res)=>{
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{ followers: req.body.userId }})
                await currentUser.updateOne({$pull:{ followings: req.params.id }});
                res.status(200).json("user unfollowed")
            } else{
                res.status(403).json("you don't follow this user")
            }
        } 
        catch (err) {
            res.status(500).json(err);
        }
    } else{
        res.status(403).json("You can not unfolllow yourself")
    }
})



router.get("/" , (req, res)=>{
    res.send("This is User Route")
})

module.exports = router;
