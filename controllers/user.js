const User=require("../models/user")
const {Order}=require("../models/order")

//
//
//
//
exports.getUserById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"UserID doesnt exsists"
            });
        }
        //
        req.profile = user;
        next();
    });
}

//
//
exports.getUser=(req,res)=>{
    //
    req.profile.salt=undefined
    req.profile.encyp_password =undefined
    req.profile.createdAt=undefined
    req.profile.updatedAt=undefined

    return  res.json(req.profile);
}

exports.updateUserData=(req,res)=>{
    User.findByIdAndUpdate(
        //
        {_id:req.profile._id},
        //
        {$set:req.body},
        //
        {new: true,useFindAndModify: false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"Data Not Changed"
                });
            }
            
            user.salt=undefined
            user.encyp_password=undefined
            user.createdAt=undefined
            user.updatedAt=undefined
            
            res.json(user);
        }
    )
}

//
exports.userPurchaseList=(req,res)=>{
    Order.find({user:req.profile._id})
    //
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No Order Found For User"
            });
        }
        return res.json(order);
    })
}


//
exports.pushOrderInPurchaseList = (req,res,next)=>{
    
    let purchaseList=[]

    req.body.order.products.forEach(product =>{
        purchaseList.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transcation_id:req.body.order.transcation_id
        });
    });

    //
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        //
        {$push: {purchases:purchaseList}},
        {new:true},
        (err,purchesess)=>{
            if(err){
                return res.status(400).json({
                    "error":"Unable to Update Purchase List"
                });
            }
            next();
        }
    );
    
}