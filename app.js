const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const dynamicRoutes = require("./controller/dynamicRoutes"); 
app.use(bodyParser.json());
app.use(cors()); 

app.get("/", (req,res)=>{
  res.json({ status : "success", data : "Welcome to Datastore" }); 
})

app.use('/api', dynamicRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
