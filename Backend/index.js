const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const bcrypt = require('bcrypt');
const {nanoid}=require('nanoid');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const admin=require('firebase-admin')
const serviceAccountKey=require('./traveldiaries-blog-firebase-adminsdk-z4c7e-c9b657356a.json')

const User = require('./Schema/User.js');
const Trip = require('./Schema/Trip.js');

const app = express();
const PORT = 3000;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
  });

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

app.use(express.json());
app.use(cors())

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
});

const verifyJWT = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(token==null){
        return res.status(401).json({"Error":"No access token"})
    }
    jwt.verify(token,process.env.SECRET_ACCESS_KEY,(err,user)=>{
        if(err){
            return res.status(403).json({"Error":"Access token is invalid"})
        }
        req.user=user.id; 
        next();
    })
}

const formatDatatoSend =(user)=>{

    const access_token=jwt.sign({id:user._id},process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img:user.personal_info.profile_img,
        username:user.personal_info.username,
        fullname:user.personal_info.fullname
    }
}

const generateUsername=async(email)=>{
    let username = email.split("@")[0];

    const userNameExists=await User.exists({"personal_info.username":username}).then((result)=>result)

    userNameExists?username += nanoid().substring(0,4): "";

    return username;
}

app.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return res.status(403).json({ "Error": "Fullname must be atleast 3 letters long" });
    }
    if (!email.length) {
        return res.status(403).json({ "Error": "Enter email" });
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "Error": "Email is invalid" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "Error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase" });
    }

    try {
        const existingUser = await User.findOne({ 'personal_info.email': email });
        if (existingUser) {
            return res.status(403).json({ "Error": "Email already exists" });
        }

        bcrypt.hash(password, 10, async(err, hashed_password) => {
            const username = await generateUsername(email);
            const user = new User({
                personal_info: { fullname, email, password:hashed_password, username }
            });

            user.save()
                .then((u) => {
                    return res.status(200).json(formatDatatoSend(u));
                })
                .catch(err => {
                    return res.status(500).json({ "Error": err.message });
                });
        });
    } catch (err) {
        return res.status(500).json({ "Error": err.message });
    }
});

app.post("/signin",(req,res)=>{

    const {email,password}=req.body;

    User.findOne({"personal_info.email":email})
    .then((user)=>{
        if(!user){
            return res.status(403).json({"Error":"Email not found"})
        }

        if(!user.google_auth){
            bcrypt.compare(password,user.personal_info.password,(err,result)=>{
                if(err){
                    return res.status(403).json({"Error":"Error occured while login please try again"});
                }
                if(!result){
                    return res.status(403).json({"Error":"Incorrect password"});
                }
                else{
                    return res.status(200).json(formatDatatoSend(user));
                }
            })
        }
        else{
            return res.status(403).json({"Error":"Account was created using google. Try loggin with it"})
        }
           
    })
    .catch(err=>{
        console.log(err.message)
        return res.status(500).json({"Error":err.message})
    })
})

app.post("/google-auth",async(req,res)=>{

    let {access_token}=req.body;

    admin.auth()
    .verifyIdToken(access_token)
    .then(async(decodedUser)=>{

        let {email,name,picture} = decodedUser;

        picture=picture.replace("s96-c","s384-c");

        let user=await User.findOne({"personal_info.email": email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u)=>{
            return u || null;
        })
        .catch(err=>{
            return res.status(500).json({"Error":err.message})
        })

        if(user){
            if(!user.google_auth){
                return res.status(403).json({"Error":"This email was signed up without google. Please login with password to access the account"})
            }
        }
        else{
            let username=await generateUsername(email);

            user=new User({
                personal_info:{fullname:name,email,username},google_auth:true
            })
            await user.save().then((u)=>{
                user=u;
            })
            .catch((err)=>{
                return res.status(500).json({"Error":err.message})
            })
        }

        return res.status(200).json(formatDatatoSend(user))

    })
    .catch((err)=>{
        return res.status(500).json({"Error":"Failed to authenticate you with google. Try with some other google account"})
    })
})

app.post('/latest-trips',(req,res)=>{
    let{page}=req.body;
    const maxLimit=10;
    Trip.find()
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt":-1})
    .select('trip_id title location budget duration mustvisit content activity publishedAt -_id')
    .skip((page.page-1)*maxLimit)
    .limit(maxLimit)
    .then(trips=>{
        return res.status(200).json({trips})
    })
    .catch(err=>{
        return res.status(500).json({error: err.message})
    })
})

app.post('/all-latest-trips-count',(req,res)=>{
    Trip.countDocuments()
    .then(count=>{
        return res.status(200).json({totalDocs:count})
    })
    .catch(err=>{
        console.log(err.message)
        return res.status(500).json({error:err.message})
    })
})

app.get('/trending-trips',(req,res)=>{
    Trip.find()
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"activity.total_reads":-1,"activity.total_likes":-1,"publishedAt":-1})
    .select("trip_id title publishedAt -_id")
    .limit(10)
    .then(trips=>{
        return res.status(200).json({trips});
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
})

app.post('/post-trip',verifyJWT,(req,res)=>{
    
    let authorId=req.user;

    let {title,budget,duration,location,content,mustvisit,stay} =req.body;

    if(!title.length){
        return res.status(403).json({"Error":"You must provide a title to publish the trip"})
    }
    if(!location.length){
        return res.status(403).json({"Error":"You must provide a location to publish the trip"})
    }
    if(!stay){
        return res.status(403).json({"Error":"Please enter the details of stay and food"})
    }
    if(!budget){
        return res.status(403).json({"Error":"You must provide the budget of your trip"})
    }
    if(!duration){
        return res.status(403).json({"Error":"You must provide the duration of your trip"})
    }
    if(!content.blocks.length){
        return res.status(403).json({"Error":"You must provide the experience of your trip"})
    }
    if(!mustvisit.length){
        return res.status(403).json({"Error":"You must provide the mustvisit places of your trip"})
    }

    mustvisit=mustvisit.map(place=>place.toLowerCase());

    let trip_id=title.replace(/[^a-zA-Z0-9]/g," ").replace(/\s+/g,"-").trim()+nanoid();

    let trip=new Trip({
        title,budget,duration,location,content,mustvisit,stay,author:authorId,trip_id
    })

    trip.save().then(trip=>{
        User.findOneAndUpdate({_id:authorId},{$inc:{"account_info.total_posts":1},$push:{"trips":trip._id}})
        .then(user=>{
            return res.status(200).json({id:trip.trip_id})
        })
        .catch(err=>{
            return res.status(500).json({"Error":"Failed to update total posts number"})
        })
    })
    .catch(err=>{
        return res.status(500).json({"Error":err.message})
    })
    
})

app.post('/search-users',(req,res)=>{
    const {query}=req.body;

    User.find({"personal_info.username":new RegExp(query,'i')})
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then(users=>{
        return res.status(200).json({users})
    })
    .catch(err=>{
        return res.status(500).json({error:err.messege})
    })
})

app.post('/search-trips',(req,res)=>{
    const { location,page,query,author } = req.body;
    let findQuery;
    if(location){
        findQuery={ location: new RegExp(location,'i') };
    }
    else if(query){
        findQuery={ title: new RegExp(query,'i') };
    }
    else if(author){
        findQuery={author}
    }

    Trip.find(findQuery)
    .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt":-1})
    .select('trip_id title location budget duration mustvisit content activity publishedAt -_id')
    .skip((page-1)*10)
    .limit(10)
    .then(trips=>{
        return res.status(200).json({trips})
    })
    .catch(err=>{
        return res.status(500).json({error: err.message})
    })

})

app.post('/search-trips-count',(req,res)=>{
    const {location,query,author}=req.body;
    let findQuery;
    if(location){
        findQuery={ location: new RegExp(location,'i') };
    }
    else if(query){
        findQuery={ title: new RegExp(query,'i') };
    }
    else if(author){
        findQuery={author}
    }
    Trip.countDocuments(findQuery)
    .then(count=>{
        return res.status(200).json({totalDocs:count})
    })
    .catch(err=>{
        console.log(err.message);
        return res.status(500).json({error:err.message})
    })
})

app.post('/get-profile',(req,res)=>{
    const {username} =req.body;
    User.findOne({"personal_info.username":username})
    .select("-personal_info.password -google_auth -updatedAt -trips")
    .then(user=>{
        return res.status(200).json(user);
    })
    .catch(err=>{
        return res.status(500).json({error:err.message})
    })
})

app.post('/get-trip',(req,res)=>{
    const {trip_id}=req.body;
    const incrementVal=1;
    Trip.findOneAndUpdate({trip_id},{$inc:{"activity.total_reads":incrementVal}})
    .populate("author","personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title location duration budget mustvisit content stay publishedAt trip_id activity")
    .then(trip=>{
        User.findOneAndUpdate({"personal_info.username":trip.author.personal_info.username},{$inc:{"account_info.total_reads":incrementVal}})
        .catch(err=>{
            return res.status(500).json({error:err.message})
        })
        return res.status(200).json({trip});
    })
    .catch(err=>{
        return res.status(500).json({error: err.message})
    })
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
