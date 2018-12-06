const express=require('express');
const bodyParser=require('body-parser');
const couchDB=require('node-couchdb');
const session=require('express-session');
const passport =require('passport');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const couch= new couchDB({
    auth:{
        user:'admin',
        password:'admin'
    }
});

couch.listDatabases().then((dbs)=>{
console.log(dbs);
});

const dataUrl='reviewsystem';
const login='login';
const feedbackdata="_design/login/_view/rv_feedback";
const loginurl="_design/login/_view/logindetail";

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/',(req,res)=>{
    couch.get(dataUrl,feedbackdata).then((data,headers,status)=>{
        res.send(data);
    },
    (err)=>{
        res.send(err);
    });
});

app.post('/login',(req,res)=>{
    const employeeid=req.body.employeeid;
    const password=req.body.password;
    couch.get(login, loginurl).then(({data, headers, status}) => {
        const user= data.rows.find((row)=>row.value.employeeid===employeeid);
        console.log("user",user);
        if(user){
            (user.value.password===password) ? res.send({loginsuccess:true,name:user,state:user.value}):res.send({loginsuccess:false});
        }else{
            res.send({loginsuccess:false});
        }
    },(err)=>{
        res.send(err);
    });
});

app.post('/customer',(req,res)=>{
    const name=req.body.name;
    const age=req.body.age;
    const location=req.body.location;
    couch.uniqid().then((ids)=>{
        const id=ids[0];
        couch.insert('sample',{
            id:id,
            name:name,
            age:age,
            location:location
        }).then(
            (data,headers,status)=>{
                res.send(data);
            },
            (err)=>{
                res.send(err);
            }
        );
    });
});

app.post('/feedback',(req,res)=>{
    couch.uniqid().then((ids)=>{
        const id=ids[0];
        couch.insert('reviewsystem',{
        emp_name:req.body.emp_name,
        emp_number:req.body.emp_number,
        applicantname:req.body.applicantname,
        position:req.body.position,
        spocname:req.body.spocname,
        rating:{
            angular:req.body.rating.angular,
            javascript:req.body.rating.javascript,
            html:req.body.rating.html,
            css:req.body.rating.css,
            testingyool:req.body.rating.testingtool,
            subversion:req.body.rating.subversion
        },
        comment:req.body.comment,
        recommendation:req.body.recommendation,
        interviewdate:req.body.interviewdate,
        status:req.body.status
        }).then(
            (data,headers,status)=>{
                res.send(data);
            },
            (err)=>{
                res.send(err);
            }
        );
    });
});

app.delete('/customer/:id',(req,res)=>{
    const id=req.params.id;
    const rev=req.body.rev;
    couch.del(dataUrl,id,rev).then(
        (data,headers,status)=>{
            res.send('deleted succesfully');
        },
        (err)=>{
            res.send(err);
        }
    )
})

app.listen(3000,()=>{
    console.log("serer listening to 3000");
})