import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const app=express(), port=process.env.PORT||4100;
app.use(cors()); app.use(express.json());
const rideSchema=new mongoose.Schema({
  type:{type:String,enum:['offer','request'],required:true},name:{type:String,required:true,trim:true,maxlength:50},
  from:{type:String,required:true,trim:true,maxlength:90},to:{type:String,required:true,trim:true,maxlength:90},
  date:{type:String,required:true},time:{type:String,required:true},seats:{type:Number,min:1,max:6,default:1},
  contribution:{type:Number,min:0,max:300,default:0},note:{type:String,maxlength:180,default:''},createdAt:{type:Date,default:Date.now}
});
const Ride=mongoose.model('Ride',rideSchema);
const demo=[
 {id:'r1',type:'offer',name:'Maya Chen',from:'Northbridge University',to:'Central Station',date:'2026-11-10',time:'16:30',seats:3,contribution:4,note:'Leaving after my last lecture. Room for bags.'},
 {id:'r2',type:'offer',name:'Jordan Lee',from:'Northbridge University',to:'Riverside Mall',date:'2026-11-10',time:'17:15',seats:2,contribution:3,note:'Can pick up at the east campus gate.'},
 {id:'r3',type:'request',name:'Amara O.',from:'Northbridge University',to:'Airport Terminal 1',date:'2026-11-11',time:'07:00',seats:1,contribution:12,note:'Flight at 10 am, one carry-on.'},
 {id:'r4',type:'offer',name:'Sam Rivera',from:'Central Station',to:'Northbridge University',date:'2026-11-10',time:'19:00',seats:3,contribution:4,note:'Returning to campus after work.'}
];
let memoryRides=[...demo];
app.get('/api/rides',async(req,res)=>{
  const {from='',to='',date='',type='all'}=req.query; const source=mongoose.connection.readyState===1?await Ride.find().sort({createdAt:-1}).lean():memoryRides;
  const filtered=source.filter(r=>(type==='all'||r.type===type)&&(!date||r.date===date)&&(!from||r.from.toLowerCase().includes(String(from).toLowerCase()))&&(!to||r.to.toLowerCase().includes(String(to).toLowerCase())));
  res.json(filtered);
});
app.post('/api/rides',async(req,res)=>{
  try{const data={...req.body,name:String(req.body.name||'').trim(),from:String(req.body.from||'').trim(),to:String(req.body.to||'').trim()};
    if(!data.name||!data.from||!data.to||!data.date||!data.time)return res.status(400).json({error:'Fill in your name, route, date and time.'});
    const ride=mongoose.connection.readyState===1?await Ride.create(data):{...data,id:`local-${Date.now()}`,createdAt:new Date().toISOString()};
    if(mongoose.connection.readyState!==1)memoryRides.unshift(ride); res.status(201).json(ride);
  }catch(error){res.status(400).json({error:error.message});}
});
app.get('/api/health',(_req,res)=>res.json({ok:true,database:mongoose.connection.readyState===1?'connected':'demo-memory'}));
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
app.use(express.static(path.join(root,'dist')));
app.get('*',(req,res,next)=>req.path.startsWith('/api/')?next():res.sendFile(path.join(root,'dist','index.html')));
if(process.env.MONGO_URI)mongoose.connect(process.env.MONGO_URI).then(()=>console.log('MongoDB connected')).catch(error=>console.error('MongoDB connection failed:',error.message));
app.listen(port,()=>console.log(`RideShare Campus server listening on ${port}`));
