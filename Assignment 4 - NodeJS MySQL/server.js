const express =require('express')
require('dotenv').config()
const mysql=require('mysql2')

const app=express()

const connection = mysql.createConnection({
    host : process.env.host,
    user : process.env.user,
    password : process.env.password
});

connection.connect((err)=>{
    if(err) throw err;
    console.log("Connected successfully to MySql server")
});

const middleWare = (req,res,next) => {
    if(res.db == undefined){
        res.db = 'dbUniversity'
    }
    next()
}

//db-create => Create Database in University

app.get("/db-create", (req,res)=>{
    const dbquery="CREATE DATABASE IF NOT EXISTS dbUniversity";

    connection.query(dbquery,(err,result)=>{
        if(err) {
            return res.status(400).json({
                error : err
            })
        }
        return res.status(200).json({
            message: "dbUniversity Database successfully created."
        })
    })
});


//db-create-table => Create Table in University DB

app.get("/db-create-table/:type",middleWare,(req,res)=>{
    let dbTable
    let {type} = req.params
    
    if(type == "student"){
        dbTable = `CREATE TABLE IF NOT EXISTS tblstudentInfo(
            studentID varchar(10) NOT NULL,
            fname varchar(50) NOT NULL,
            lname varchar(50) NOT NULL,
            mobileNo varchar(15) NOT NULL,
            PRIMARY KEY (studentID));`
    }else if(type == "faculty"){
        dbTable = `CREATE TABLE IF NOT EXISTS tblfacultyInfo(
            facultyID varchar(10) NOT NULL,
            fname varchar(50) NOT NULL,
            lname varchar(50) NOT NULL,
            mobileNo varchar(15) NOT NULL,
            PRIMARY KEY (facultyID));` 
    }else{
        return res.status(400).json({
            error : "Type specified is invalid."
        })
    }

    connection.query(`USE ${res.db}`,(err,result)=>{ 
        if(err) {
            console.log(err)
            return res.status(400).json({
                error : "Database cant be accessed."
            })
        }
        connection.query(dbTable,(err,result)=>{ 
            if(err) {
                console.log(err)
                return res.status(400).json({
                    error : "Table could not be created."
                })
            }
            return res.status(200).json({
                message : `tbl${type}Info Table was successfully created.`
            })
        })
    })
})

//db-insert => Insert Record into Table

app.get("/db-insert/:type", middleWare,(req,res)=>{

    let dbInsert
    let {type} = req.params

    if(type == "student"){
        dbInsert=`INSERT INTO tblstudentInfo
            (studentID,fname,lname,mobileNo)
            VALUES ('102','Mrugendra','Rahevar','123456789'),
            ('103','Martin','Parmar','123456789'),
            ('104','Vraj','Shah','123456789')`;
    }else if(type == "faculty"){
        dbInsert=`INSERT INTO tblfacultyInfo
            (facultyID,fname,lname,mobileNo)
            VALUES ('102','Mrugendra','Rahevar','123456789'),
            ('103','Martin','Parmar','123456789'),
            ('104','Vraj','Shah','123456789')`; 
    }else{
        return res.status(400).json({
            error : "Type specified is invalid."
        })
    }

    connection.query(`USE ${res.db}`,(err,result)=>{ 
        if(err) {
            console.log(err)
            return res.status(400).json({
                error : "Database cant be accessed."
            })
        }
        connection.query(dbInsert,(err,result)=>{ 
            if(err) {
                console.log(err)
                return res.status(400).json({
                    error : "Rows could not be inserted."
                })
            }
            return res.status(200).json({
                message : `tbl${type}Info Table was successfully modified.
                Total inserted rows: ${result['affectedRows']}`
            })
        })
    }) 
});

//db-update => Update Record in Table

app.get("/db-update/:type/:id", middleWare,(req,res)=>{

    let dbUpdate
    let {id,type} = req.params

    if(id == undefined){
        return res.status(400).json({
            error : "Id was not specified."
        })
    }

    if(type == "student"){
        dbUpdate=`UPDATE tblstudentInfo SET
            mobileNo = '987654321' WHERE studentId = '${id}'`
    }else if(type == "faculty"){
        dbUpdate=`UPDATE tblfacultyInfo SET
            mobileNo = '987654321' WHERE facultyId = '${id}'`
    }else{
        return res.status(400).json({
            error : "Type specified is invalid."
        })
    }

    connection.query(`USE ${res.db}`,(err,result)=>{ 
        if(err) {
            console.log(err)
            return res.status(400).json({
                error : "Database cant be accessed."
            })
        }
        connection.query(dbUpdate,(err,result)=>{ 
            if(err) {
                console.log(err)
                return res.status(400).json({
                    error : "Rows could not be updated."
                })
            }
            return res.status(200).json({
                message : `tbl${type}Info Table was successfully modified.
                Total updated rows: ${result['affectedRows']}`
            })
        })
    }) 
});

//db-delete => Delete Record from Table

app.get("/db-delete/:type/:id",middleWare,(req,res)=>{

    let dbDelete
    let {id,type} = req.params

    if(id == undefined){
        return res.status(400).json({
            error : "Id was not specified."
        })
    }

    if(type == "student"){
        dbDelete=`DELETE FROM tblstudentInfo
            WHERE studentID = ${id}`;
    }else if(type == "faculty"){
        dbDelete=`DELETE FROM tblfacultyInfo
            WHERE facultyID = ${id}`;
    }else{
        return res.status(400).json({
            error : "Type specified is invalid."
        })
    }

    connection.query(`USE ${res.db}`,(err,result)=>{ 
        if(err) {
            console.log(err)
            return res.status(400).json({
                error : "Database cant be accessed."
            })
        }
        connection.query(dbDelete,(err,result)=>{ 
            if(err) {
                console.log(err)
                return res.status(400).json({
                    error : "Rows could not be deleted."
                })
            }
            return res.status(200).json({
                message : `tbl${type}Info Table was successfully modified.
                Total deleted rows: ${result['affectedRows']}`
            })
        })
    }) 
});

app.listen(3000,()=>{
    console.log("Server is running on port number 3000")
})