const whiteList=['https://www.google.com',
  'http://127.0.0.1:5501',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5000',
  'http://localhost:3500',
  'http://127.0.0.1:3500',
  'https://mobile-1-7i8e.onrender.com'];

// Add Netlify URL if provided in environment
if (process.env.FRONTEND_URL) {
  whiteList.push(process.env.FRONTEND_URL);
}

const corsOptions={
  
  origin:(origin,callback)=>{
     if(whiteList.indexOf(origin)!==-1 || !origin)
  { 
      callback(null,true);
  }
  else
  {
     callback(new Error('Not allowed by CORS')); 
  }

  } ,                           
  optionsSuccessStatus:200
 
}

module.exports=corsOptions;