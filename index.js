const express=require('express');
const bodyParser=require('body-parser');
const couchDB=require('node-couchdb');

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

const dbname='sample';
const viewurl='_design/all_customers/_view/all';

app.get('/',(req,res)=>{
    couch.get(dbname,viewurl).then((data,headers,status)=>{
        res.send(data);
    },
    (err)=>{
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

app.delete('/customer/:id',(req,res)=>{
    const id=req.params.id;
    const rev=req.body.rev;
    couch.del(dbname,id,rev).then(
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