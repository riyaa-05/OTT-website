const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb+srv://itsriyaa05:Riya123@login.vzf01.mongodb.net/?retryWrites=true&w=majority&appName=login')
.then(
  console.log('mongodb connected')
)


app.get('/api/data', async (req, res) => {
    try {
        const response = await axios.get('https://retoolapi.dev/QhTxfm/data');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Error fetching data' });
    }
});
app.get('/api/data/2', async (req, res) => {
    try {
        const response = await axios.get('https://retoolapi.dev/imsfHA/data');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Error fetching data' });
    }
});
app.get('/api/data/3', async (req, res) => {
    try {
        const response = await axios.get('https://retoolapi.dev/bZHaBv/data22');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Error fetching data' });
    }
});


const userSchema = new mongoose.Schema({

      email:{
        type: String, 
      required: true,
      unique: true
      },
      
    password: { 
      type: String, 
      required: true }
  });
  
  const User = mongoose.model('User', userSchema);

  const movieSchema = new mongoose.Schema({
    title:{
      type: String,
      required: true
    },

    desc: {
      type: String,
      required:true
    }
  })

  const Movie = mongoose.model('Movie', movieSchema);

  app.get('/read', async(req,res)=>{

    try{
        const response = await Movie.find({})
        res.send(response)
    }catch{

    }
})

app.post('/upload',async(req,res)=>{
  const title = req.body.title
  const desc = req.body.desc
  const am = new Movie({title: title, desc: desc})

  try{
    await am.save();
    res.send("uploaded")
  }
  catch(err){
    console.log(err)
  }
})

app.put('/update', async(req,res)=>{
  const newMovieName = req.body.newMovieName
  const id = req.body.id 
  try{
      const updatedMovie = await Movie.findById(id)
          updatedMovie.title = newMovieName
          updatedMovie.save()
      
  }
  catch(err){
      console.log(err)
  }
})

app.delete('/delete/:id', async(req,res)=>{
  const id = req.params.id 
  try{
     await Movie.findByIdAndDelete(id).exec();
     console.log("deleted");
  } catch(err){

  }
})

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });
  
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
      req.userId = decoded.userId;
      next();
    });
  };

  app.post('/SignUp', async (req, res) => {
    try {
      const { email,password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
    }
  });

  app.post('/SignIn', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, userId: user._id });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in this account.' });
    }
  });

  app.listen(3003,()=>{
    console.log('server running http://localhost:3003')
  })
  