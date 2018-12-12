# CRUD-CouchDB
Couchdb integrated nodejs applications

#DataBase Creation

## Install Couchdb.After installation browse for localhost:5984/_utils.
Create "admin" and "admin" as username and password for couchdb login

Create New Document named "reviewsystem" and "login"

 Create New View For both the above mentioned documents as "logindetail" for login document and "rv_feedback" for "reviewsystem".

## rv_feedback View
 {
  "emp_name": "vinoth",
  "emp_number": "235954",
  "applicantname": "vignesh",
  "position": "engineer",
  "spocname": "triuptu",
  "rating": {
    "angular": "2",
    "html": "4",
    "css": "7",
    "testingyool": "7",
    "subversion": "6"
  },
  "comment": "sample",
  "recommendation": "l2 selected",
  "status": "selected"
 }

 ##logindetail View
 {
   "_id": "_design/login",
   "_rev": "3-a21ec51d42920b7dc3c080f2a13a997a",
   "views": {
     "logindetail": {
      "map": "function (doc) {\n  emit(doc._id,{employeeid: doc.employeeid,password:doc.password,name:doc.name});\n}"
     }
   },
   "language": "javascript"
