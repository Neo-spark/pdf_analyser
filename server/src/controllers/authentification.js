const mongoose=require('mongoose');

const User=require('../models/User');
const bcypt=require('bcrypt');
const jwt=require('jsonwebtoken');



const register=async(req,res)=>
{
    const {name,email,password}=req.body;
    if(!name || !email || !password)
    {
        return res.status(400).json({message:"Please fill all the fields"});
    }
    try
    {
        const user=await User.findOne({email});
        if(user)
        {
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword= await bcypt.hash(password,10);
        const newuser=new User({name,email,password:hashedPassword});
        await newuser.save();
        res.status(201).json({message:"User registered successfully"});
    }
    catch(error)
    {
        res.status(500).json({message:"Error occurred while registering user"});
    }
};

const generateAAccessToken=(user)=>
{
    const
}

const generateRefreshToken=(user)=>
{
    const 
}

const login=async(req,res)=>
{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return res.status(400).json({message:"Please fill all the fields"});
    }
    try
    {
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({message:"User not found"});
        }
        const isMatch=await bcypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid credentials"});
        }

    }
}