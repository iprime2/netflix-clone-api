const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')

dotenv.config()

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(cors(corsOptions))

// routes
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const moviesRoute = require('./routes/movies')
const listRoute = require('./routes/list')

// Routes
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/movies', moviesRoute)
app.use('/api/lists', listRoute)

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    app.listen(process.env.PORT || 8282, () => {
      console.log('Server is running on : ' + process.env.PORT)
      console.log('DB Connected')
    })
  } catch (error) {
    console.log(error)
  }
}

start()
