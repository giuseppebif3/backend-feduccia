// server/index.js
const { createHash } = require('crypto');
const express = require("express");
const cors = require('cors');
const {Client} = require('pg')



const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());

const connectionString = process.env.CONNECTION_STRING

const client = new Client({
    connectionString,
  });

client.connect();

app.get('/', (req, res)=>{
    res.send("Welcome to your server")
    })


app.post("/generate_token", (req, res)=>{
    username = req.body.username
    password = req.body.password
    sha = createHash('sha256').update(username+password).digest('hex');
    res.send({token:sha})
    })

app.post("/verify_token", (req, response)=>{
    token = req.body.token
    username = req.body.username
    q = 'SELECT token FROM accounts WHERE username=$1'
    v = [username]
    //console.log(q)
    client.query(q,v,(err,res)=>{
        if(!err){
            if (res?.rows[0]?.token == token.data.token){
                response.send({message:true})
            }
            else{
                response.send({message:false})
            }

        }else{
            console.log(err.message)
            response.send({message:false})
        }
        
    })
})

// app.post('/add_account',(req, response) => {
//     id = req.body
//     name_to_add = req.name
//     //date = req.date
//     q = "INSERT INTO accounts VALUES (4,6,'bubu',1)"
//     q2='SELECT * FROM exams'
//     client.query(q,(err,res)=>{
//         if(!err){
//             console.log(res)
//         }else{
//             console.log(err.message)
//         }
//     })
// })

app.post('/add_exam',(req, response) => {
    token = req.body.token
    exam_name = req.body.name
    //date = req.date
    q = 'INSERT INTO exams VALUES ($1,$2)'
    v = [token,exam_name]
    client.query(q,v,(err,res)=>{
        if(!err){
            console.log(res)
            response.send({message:"OK"})
        }else{
            console.log(err.message)
        }
    })
})

app.post('/del_exam',(req, response) => {
    token = req.body.token
    exam_name = req.body.name
    q = 'DELETE FROM exams WHERE token=$1 AND name=$2'
    v = [token,exam_name]

    client.query(q,v,(err,res)=>{
        if(!err){
            console.log(res)
            response.send({message:"OK"})
        }else{
            console.log(err.message)
        }
    })
})
app.post('/add_question',(req, response) => {
    token = req.body.token
    exam_name = req.body.exam
    question = req.body.question
    //date = req.date
    q = 'INSERT INTO questions VALUES ($1,$2,$3)'
    v = [token,exam_name,question]
    client.query(q,v,(err,res)=>{
        if(!err){
            console.log(res)
            response.send({message:"OK"})
        }else{
            console.log(err.message)
        }
    })
})

app.post('/del_question',(req, response) => {
    token = req.body.token
    exam_name = req.body.exam
    question = req.body.question
    q = 'DELETE FROM questions WHERE token=$1 AND exam_name=$2  AND question=$3'
    v = [token,exam_name,question]
    client.query(q,v,(err,res)=>{
        if(!err){
            console.log(res)
            response.send({message:"OK"})
        }else{
            console.log(err.message)
        }
    })
})

app.post("/get_questions", (req, response) => {
    client.query('SELECT * FROM questions',(err,res)=>{
        if(!err){
            console.log(res.rows)
            response.send({ questions: res.rows });
        }else{
            console.log(err.message)
        }
    })
  });

app.post("/get_exams", (req, response) => {
    client.query('SELECT * FROM exams',(err,res)=>{
        if(!err){
            console.log(res.rows)
            response.send({ exams: res.rows });
        }else{
            console.log(err.message)
        }
    })
  });



app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});