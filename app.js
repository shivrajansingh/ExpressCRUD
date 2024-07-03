const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;
const dynamicRoutes = require("./controller/dynamicRoutes"); 
app.use(bodyParser.json());


app.get("/", (req,res)=>{
  res.json({ status : "success", data : "Welcome to Datastore" }); 
})

app.use('/api', dynamicRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
