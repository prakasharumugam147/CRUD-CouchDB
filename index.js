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

// couch.listDatabases().then((dbs)=>{
// console.log(dbs);
// });

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
            html:{
               forms:req.body.rating.html.forms,
               newfeatures:req.body.rating.html.newfeatures,
               graphics:req.body.rating.html.graphics,
               htmlmedia:req.body.rating.html.htmlmedia,
               geolocation:req.body.rating.html.geolocation,
               cssconcepts:req.body.rating.html.cssconcepts
            },
            css:{
             cssconcepts:req.body.rating.css.cssconcepts,
             csssprites:req.body.rating.css.csssprites,
             cssadvanced:req.body.rating.css.cssadvanced,
             cssresponsive:req.body.rating.css.cssresponsive,
             cssreference:req.body.rating.css.cssreference
            },
            javascript:{
             jsbasicpart1:req.body.rating.javascript.jsbasicpart1,
             jsbasicpart2:req.body.rating.javascript.jsbasicpart2,
             jsbasicpart3:req.body.rating.javascript.jsbasicpart3,
             jsdomevent:req.body.rating.javascript.jsdomevent,
             jsbrowser:req.body.rating.javascript.jsbrowser,
             jsjson:req.body.rating.javascript.jsjson
            },
            advancejs:{
             advancejspart1:req.body.rating.advancejs.advancejspart1,
             advancejspart2:req.body.rating.advancejs.advancejspart2,
             advancejspart3:req.body.rating.advancejs.advancejspattern,
             jsprototype:req.body.rating.advancejs.jsprototype
            },
            angularjs:{
             angularpart1:req.body.rating.angularjs.angularpart1,
             angularpart2:req.body.rating.angularjs.angularpart2,
             angularpart3:req.body.rating.angularjs.angularpart3,
             angularpart4:req.body.rating.angularjs.angularpart4,
             angularadvance:req.body.rating.angularjs.angularadvance,
             angulartesting:req.body.rating.angularjs.angulartesting
            },
            techcomp:{
             techcomppattern:req.body.rating.techcomp.techcomppattern,
             techcomptesting:req.body.rating.techcomp.techcomptesting,
             techcompnfr:req.body.rating.techcomp.techcompnfr
            },
            processtools:{
             buildtools:req.body.rating.processtools.buildtools,
             sdlc:req.body.rating.processtools.sdlc,
             repository:req.body.rating.processtools.repository
            }
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

// app.delete('/customer/:id',(req,res)=>{
//     const id=req.params.id;
//     const rev=req.body.rev;
//     couch.del(dataUrl,id,rev).then(
//         (data,headers,status)=>{
//             res.send('deleted succesfully');
//         },
//         (err)=>{
//             res.send(err);
//         }
//     )
// })

app.listen(4000,()=>{
    console.log("server listening to 4000");
})