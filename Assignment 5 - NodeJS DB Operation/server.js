const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql2')
const credentials = require('./constants.js')

const app = express()

const connection = mysql.createConnection(credentials);

connection.connect((err)=>{
    if(err) throw err;
    console.log("Connected successfully to MySql server")
});

app.engine('handlebars', exphbs({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout : 'index'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));

const validateForm = (body) => {
    const errors = []
    if(!body.code.match(/^[a-z A-Z 0-9 .]*$/)){
        errors.push("Invalid Subject Code")
    }
    if(!body.name.match(/^[a-z A-Z]*$/)){
        errors.push("Invalid Subject Name")
    }
    if(!body.instName.match(/^[a-z A-Z]*$/)){
        errors.push("Invalid Institute Name")
    }
    if(!body.deptName.match(/^[a-z A-Z]*$/)){
        errors.push("Invalid Department Name")
    }
    return errors
}

app.route('/subjects')
.get((req,res) => {
    let query = `SELECT * FROM subjects` 
    connection.query(query,(err,result)=>{
        if(err){
            let errors = [err.sqlMessage]
            res.render('form',{errors})
        }else if(result.length == 0){
            let errors = ["No records to view."]
            res.render('form',{errors})
        }else{
            res.render('subjects',{ 
                subjects : result.map(e => ({
                    code : e.sub_code,
                    name : e.sub_name,
                    instName: e.inst_name,
                    deptName: e.dept_name,
                    sem: e.sem
                })
                )
            })
        }
    })
})

app.route('/subject')
.get((req,res) => {
    res.render('form')
})
.post((req,res) => {
    let errors = validateForm(req.body)
    if(errors.length == 0){
        let query = `INSERT INTO subjects 
            (sub_code,sub_name,inst_name,dept_name,sem) 
            VALUES("${req.body.code}","${req.body.name}","${req.body.instName}","${req.body.deptName}",${Number(req.body.sem)})`
        connection.query(query,(err,result)=>{
            if(err){
                let errors = [err.sqlMessage]
                res.render('form',{errors})
            }else{
                res.redirect('/subjects')
            }
        })
    }else{
        res.render('form',{errors})
    }
})

app.listen(3000,() => {
    console.log("Server Running at Port 3000")
})