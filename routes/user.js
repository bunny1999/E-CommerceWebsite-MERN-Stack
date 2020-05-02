const express=require("express");
const router=express.Router();

//
const {getUserById, getUser, updateUserData, userPurchaseList} = require("../controllers/user");
const {isSignedin,isAdmin,isAuthenticated} =require("../controllers/auth")

//
//
router.param("userId",getUserById);

//
router.get('/user/:userId', isSignedin,isAuthenticated,getUser);

router.put('/user/:userId', isSignedin, isAuthenticated, updateUserData);

router.get('/orders/user/:userId', isSignedin, isAuthenticated, userPurchaseList)

module.exports=router