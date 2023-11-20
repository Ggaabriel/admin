const express = require("express");
const router = express.Router();
const connection = require("../db/db")
const jwt = require('jsonwebtoken')
const {secret} = require("../config")
const multer = require("../middleware/file");
const makeToken = (login,password) =>{
    const payload = {
        login,
        password
    }
    return jwt.sign(payload,secret, {expiresIn:"24h"})
}

router.get("/",(req,res)=>{ 
    const {token} = req.headers
    console.log(token);
    if(!token){
        connection.query('SELECT `id`, `dateOfAdd`, `lastName`, `firstName`, `middleName`, `image` FROM `workers`', function (error, results) {
            if(error){
                res.status(400)
                res.send("error! Call some ambulance idk")
                throw error
            }
            console.log('The solution is: ', results);
            res.status(200)
            res.send(results)
        });

    }else{
        connection.query('SELECT * FROM `workers` WHERE 1', function (error, results) {
            if(error){
                res.status(400)
                res.send("error! Call some ambulance idk")
                throw error
            }
            console.log('The solution is: ', results);
            res.status(200)
            res.send(results)
        });
    }
    
    
})

router.post("/login",(req,res)=>{
    const {login, password} = req.body
    const sql = "SELECT `login`,`password` FROM `admins` WHERE `login` LIKE '"+login+"' AND `password` LIKE '"+password+"'"
    connection.query(sql,async function (error, results,fiends) {
        if(error){
            res.status(400)
            res.send("Неопределенная ошибка")
            throw error
        }
        if(await results[0] === undefined){
            res.status(400).json({message:"Неправильный логин или пароль"})
        }
        else{
            console.log('admin: ', results[0]);
            const token = makeToken(login,password)
            res.status(200)
            res.json({token}) 
        }
        
    });
})

router.patch("/worker/:id",(req,res)=>{
    const {lastName,firstName,middleName,birthday} = req.body
    const workerId = req.params.id
    const sql = "UPDATE `workers` SET `lastName`='"+lastName+"',`firstName`='"+firstName+"',`middleName`='"+middleName+"',`birthday`='"+birthday+"' WHERE `id` = '"+workerId+"'"
    connection.query(sql, function (error, results) {
        if(error){
            res.status(400)
            res.send("error! Call some ambulance idk")
            throw error
        }
        console.log('The solution is: ', results);
        res.status(200)
        res.json({workerId});
    });
})
router.delete("/worker/:id",(req,res)=>{
    const workerId = req.params.id
    const sql = "DELETE FROM `workers` WHERE `id` = '"+workerId+"'"
    connection.query(sql, function (error, results) {
        if(error){
            res.status(400)
            res.send("error! Call some ambulance idk")
            throw error
        }
        console.log('The solution is: ', results);
        res.status(200)
        res.json(null);
    });
})
    
router.post("/worker/add",(req,res)=>{
    const {lastName,firstName,middleName,birthday} = req.body
    const sql = "INSERT INTO `workers`( `lastName`, `firstName`, `middleName`, `birthday`, `image`) VALUES ('"+lastName+"','"+firstName+"','"+middleName+"','"+birthday+"','')"
    connection.query(sql, function (error, results) {
        if(error){
            res.status(400)
            res.send("error! Call some ambulance idk")
            throw error
        }
        console.log('The solution is: ', results);
        res.status(200)
        res.json({id:results.insertId});
    });
})

router.post("/worker/:id/upload", multer.single("file"), (req, res) => {
    console.log(req.file);
    if (req.file) {
        const workerId = req.params.id;
        const filepath = req.file.path.replace(/\\/g, '/')
        const sql = "UPDATE `workers` SET `image`='"+filepath+"' WHERE `id` = '"+workerId+"'";
        
        connection.query(sql, function (error, results) {
            if(error){
                res.status(400)
                res.send("error! Call some ambulance idk")
                throw error
            }
            console.log('The solution is: ', results);
            res.status(200)
            res.json({filepath});
        });
       
       
    } else {
        res.send(null);
    }
});

module.exports = router;